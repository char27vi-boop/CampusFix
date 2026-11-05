
const { db } = require("../database/db");

// Convert database rows into the shape already used by the React dashboard.
function formatComplaint(row) {
    if (!row) return null;

    return {
        id: row.id,
        user_id: row.user_id,
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
// Return all complaints with optional status and category filters.
const getAllComplaints = (req, res) => {
    const { status, category } = req.query;

    let sql = "SELECT * FROM complaints WHERE 1=1";
    const values = [];

    // Filter complaints by status.
    if (status && status.trim()) {
        sql += " AND status = ? COLLATE NOCASE";
        values.push(status.trim());
    }

    // Filter complaints by category.
    if (category && category.trim()) {
        sql += " AND category = ? COLLATE NOCASE";
        values.push(category.trim());
    }

    // Display newest complaints first.
    sql += " ORDER BY datetime(created_at) DESC";

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
    db.get("SELECT * FROM complaints WHERE id = ?", [req.params.id], (error, row) => {
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

// POST /api/complaints - save a new complaint permanently.
const createComplaint = (req, res) => {
    const { title, description, category, location } = req.body;
    const id = `CF${Date.now()}`;

    // Authentication middleware will provide req.user after Login/Signup integration.
    // Until then, user_id stays NULL.
    const userId = req.user?.user_id ?? null;

    const sql = `
        INSERT INTO complaints (id, user_id, title, description, category, location)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [id, userId, title.trim(), description.trim(), category.trim(), location.trim()],
        function (error) {
            if (error) {
                console.error("Could not create complaint:", error.message);
                return res.status(500).json({
                    message: "Unable to save complaint."
                });
            }

            db.get("SELECT * FROM complaints WHERE id = ?", [id], (readError, row) => {
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
const updateComplaint = (req, res) => {
    const allowedFields = [
        "title",
        "description",
        "category",
        "location",
        "priority",
        "status"
    ];

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
    values.push(req.params.id);

    const sql = `UPDATE complaints SET ${assignments.join(", ")} WHERE id = ?`;

    db.run(sql, values, function (error) {
        if (error) {
            if (error.message.includes("CHECK constraint failed")) {
                return res.status(400).json({
                    message: "Invalid status or priority value."
                });
            }

            console.error("Could not update complaint:", error.message);
            return res.status(500).json({
                message: "Unable to update complaint."
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                message: "Complaint not found."
            });
        }

        db.get("SELECT * FROM complaints WHERE id = ?", [req.params.id], (readError, row) => {
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
};

// DELETE /api/complaints/:id - delete a complaint.
const deleteComplaint = (req, res) => {
    db.run("DELETE FROM complaints WHERE id = ?", [req.params.id], function (error) {
        if (error) {
            console.error("Could not delete complaint:", error.message);
            return res.status(500).json({
                message: "Unable to delete complaint."
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                message: "Complaint not found."
            });
        }

        res.status(200).json({
            message: "Complaint deleted successfully."
        });
    });
};

// Export controller functions.
module.exports = {
    getAllComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint
};
