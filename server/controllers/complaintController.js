const { db } = require("../database/db");

// Convert database rows into the shape used by the React dashboard.
function formatComplaint(row) {
    if (!row) return null;

    return {
        id: row.id,
        user_id: row.user_id,
        user_name: row.user_name || null,
        user_email: row.user_email || null,
        title: row.title,
        description: row.description,
        category: row.category,
        location: row.location,
        priority: row.priority,
        status: row.status,
        date: new Date(`${row.created_at.replace(" ", "T")}Z`).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }),
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

// GET /api/complaints
// Return complaints. Supports ?scope=mine (default for students) vs ?scope=all.
// Staff and Admins can view all complaints.
const getAllComplaints = (req, res) => {
    const { status, category, user_id, mine, scope } = req.query;

    let sql = `
        SELECT complaints.*, users.name AS user_name, users.email AS user_email
        FROM complaints
        LEFT JOIN users ON complaints.user_id = users.user_id
        WHERE 1=1
    `;
    const values = [];

    // Filter complaints by status
    if (status && status.trim() && status.toLowerCase() !== "all") {
        sql += " AND complaints.status = ? COLLATE NOCASE";
        values.push(status.trim());
    }

    // Filter complaints by category
    if (category && category.trim() && category.toLowerCase() !== "all") {
        sql += " AND complaints.category = ? COLLATE NOCASE";
        values.push(category.trim());
    }

    // Student isolation & Scope handling
    const isStudent = req.user && req.user.role === "student";
    const requestedScope = (scope || (mine === "true" ? "mine" : isStudent ? "mine" : "all")).toLowerCase();

    if (requestedScope === "mine" && req.user && req.user.user_id) {
        sql += " AND complaints.user_id = ?";
        values.push(req.user.user_id);
    } else if (user_id && user_id.trim()) {
        sql += " AND complaints.user_id = ?";
        values.push(user_id.trim());
    } else if (isStudent && requestedScope !== "all") {
        sql += " AND complaints.user_id = ?";
        values.push(req.user.user_id);
    }

    // Display newest complaints first
    sql += " ORDER BY datetime(complaints.created_at) DESC";

    db.all(sql, values, (error, rows) => {
        if (error) {
            console.error("Could not fetch complaints:", error.message);
            return res.status(500).json({
                message: "Unable to fetch complaints."
            });
        }

        res.status(200).json(rows.map(formatComplaint));
    });
};

// GET /api/complaints/:id - return one complaint.
const getComplaintById = (req, res) => {
    const sql = `
        SELECT complaints.*, users.name AS user_name, users.email AS user_email
        FROM complaints
        LEFT JOIN users ON complaints.user_id = users.user_id
        WHERE complaints.id = ?
    `;

    db.get(sql, [req.params.id], (error, row) => {
        if (error) {
            console.error("Could not fetch complaint:", error.message);
            return res.status(500).json({
                message: "Unable to fetch complaint."
            });
        }

        if (!row) {
            return res.status(404).json({
                message: "Complaint not found."
            });
        }

        res.status(200).json(formatComplaint(row));
    });
};

// POST /api/complaints - save a new complaint.
const createComplaint = (req, res) => {
    const { title, description, category, location, priority } = req.body;
    const id = `CF${Date.now()}`;

    // Extract user_id from authenticated session
    const userId = req.user?.user_id ?? null;
    const complaintPriority = priority && ["Low", "Medium", "High"].includes(priority)
        ? priority
        : "Medium";

    const sql = `
        INSERT INTO complaints (id, user_id, title, description, category, location, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [id, userId, title.trim(), description.trim(), category.trim(), location.trim(), complaintPriority],
        function (error) {
            if (error) {
                console.error("Could not create complaint:", error.message);
                return res.status(500).json({
                    message: "Unable to save complaint."
                });
            }

            const selectSql = `
                SELECT complaints.*, users.name AS user_name, users.email AS user_email
                FROM complaints
                LEFT JOIN users ON complaints.user_id = users.user_id
                WHERE complaints.id = ?
            `;

            db.get(selectSql, [id], (readError, row) => {
                if (readError) {
                    console.error("Could not read saved complaint:", readError.message);
                    return res.status(500).json({
                        message: "Complaint saved, but could not retrieve it."
                    });
                }

                res.status(201).json({
                    message: "Complaint submitted successfully",
                    complaint: formatComplaint(row)
                });
            });
        }
    );
};

// PUT /api/complaints/:id - update complaint details or status.
// Admins and staff can update all fields including status/priority.
// Students can update ONLY their own PENDING complaints (title, description, category, location).
const updateComplaint = (req, res) => {
    const complaintId = req.params.id;
    const userRole = (req.user?.role || "").toLowerCase();
    const userId = req.user?.user_id;

    db.get("SELECT * FROM complaints WHERE id = ?", [complaintId], (err, existing) => {
        if (err) {
            console.error("Database error checking complaint for update:", err.message);
            return res.status(500).json({ message: "Database error." });
        }

        if (!existing) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        // Ownership and role authorization
        if (userRole === "student") {
            if (existing.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. You can only update your own complaints."
                });
            }

            // Students can only update pending complaints
            if (existing.status !== "Pending") {
                return res.status(403).json({
                    success: false,
                    message: `You can only edit complaints while in 'Pending' status. This complaint is already '${existing.status}'.`
                });
            }

            if (req.body.status && req.body.status !== existing.status) {
                return res.status(403).json({
                    success: false,
                    message: "Students cannot modify complaint status. Please contact maintenance staff."
                });
            }

            if (req.body.priority && req.body.priority !== existing.priority) {
                return res.status(403).json({
                    success: false,
                    message: "Students cannot modify priority after submission."
                });
            }
        } else if (userRole !== "admin" && userRole !== "staff") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions."
            });
        }

        const allowedFields = userRole === "student"
            ? ["title", "description", "category", "location"]
            : ["title", "description", "category", "location", "priority", "status"];

        const updates = Object.entries(req.body).filter(([field, value]) =>
            allowedFields.includes(field) &&
            typeof value === "string" &&
            value.trim()
        );

        if (updates.length === 0) {
            return res.status(400).json({
                message: "Provide at least one valid field to update."
            });
        }

        const assignments = updates.map(([field]) => `${field} = ?`);
        assignments.push("updated_at = CURRENT_TIMESTAMP");

        const values = updates.map(([, value]) => value.trim());
        values.push(complaintId);

        const sql = `UPDATE complaints SET ${assignments.join(", ")} WHERE id = ?`;

        db.run(sql, values, function (updateError) {
            if (updateError) {
                if (updateError.message.includes("CHECK constraint failed")) {
                    return res.status(400).json({
                        message: "Invalid status or priority value."
                    });
                }

                console.error("Could not update complaint:", updateError.message);
                return res.status(500).json({
                    message: "Unable to update complaint."
                });
            }

            const selectSql = `
                SELECT complaints.*, users.name AS user_name, users.email AS user_email
                FROM complaints
                LEFT JOIN users ON complaints.user_id = users.user_id
                WHERE complaints.id = ?
            `;

            db.get(selectSql, [complaintId], (readError, row) => {
                if (readError) {
                    return res.status(500).json({
                        message: "Complaint updated, but could not retrieve it."
                    });
                }

                res.status(200).json({
                    message: "Complaint updated successfully",
                    complaint: formatComplaint(row)
                });
            });
        });
    });
};

// DELETE /api/complaints/:id - delete a complaint.
// Admins can delete any complaint. Students can delete ONLY their own PENDING complaints.
const deleteComplaint = (req, res) => {
    const complaintId = req.params.id;
    const userRole = (req.user?.role || "").toLowerCase();
    const userId = req.user?.user_id;

    if (!complaintId || !complaintId.trim()) {
        return res.status(400).json({
            success: false,
            message: "Complaint ID is required."
        });
    }

    db.get("SELECT * FROM complaints WHERE id = ?", [complaintId], (err, existing) => {
        if (err) {
            console.error("Database error checking complaint for deletion:", err.message);
            return res.status(500).json({ success: false, message: "Database error." });
        }

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found. It may have already been deleted."
            });
        }

        // Ownership and role check
        if (userRole === "student") {
            if (existing.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. You can only delete your own complaints."
                });
            }

            // Students can only cancel/delete pending complaints
            if (existing.status !== "Pending") {
                return res.status(403).json({
                    success: false,
                    message: `You can only cancel/delete complaints while in 'Pending' status. This complaint is already '${existing.status}'.`
                });
            }
        } else if (userRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators or the complaint owner can delete complaints."
            });
        }

        db.run("DELETE FROM complaints WHERE id = ?", [complaintId], function (deleteErr) {
            if (deleteErr) {
                console.error("Could not delete complaint:", deleteErr.message);
                return res.status(500).json({
                    success: false,
                    message: "An error occurred while deleting the complaint."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Complaint deleted successfully.",
                deletedId: complaintId
            });
        });
    });
};

// Export controller functions
module.exports = {
    getAllComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint
};
