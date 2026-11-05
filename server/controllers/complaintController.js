// Temporary complaint storage
let complaints = [];

// GET all complaints
const getAllComplaints = (req, res) => {
    res.status(200).json(complaints);
};


// GET complaint by ID
const getComplaintById = (req, res) => {
    const { id } = req.params;

    const complaint = complaints.find(
        (item) => item.id === id
    );

    if (!complaint) {
        return res.status(404).json({
            message: "Complaint not found"
        });
    }

    res.status(200).json(complaint);
};


// POST a new complaint
const createComplaint = (req, res) => {
    const { title, description, category, location } = req.body;

    const newComplaint = {
        id: `CF${Date.now()}`,
        title,
        description,
        category,
        location,
        priority: "Medium",
        status: "Pending",
        date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    };

    complaints.push(newComplaint);

    res.status(201).json({
        message: "Complaint submitted successfully",
        complaint: newComplaint
    });
};


// Export controller functions
module.exports = {
    getAllComplaints,
    getComplaintById,
    createComplaint
};