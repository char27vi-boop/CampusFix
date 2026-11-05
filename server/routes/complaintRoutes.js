const express = require("express");
const router = express.Router();

const {
    getAllComplaints,
    getComplaintById,
    createComplaint,
    updateComplaint,
    deleteComplaint
} = require("../controllers/complaintController");

const validateComplaint = require("../middleware/validateComplaint");

// GET all complaints
router.get("/", getAllComplaints);

// GET complaint by ID
router.get("/:id", getComplaintById);

// POST a new complaint
router.post("/", validateComplaint, createComplaint);

// PUT: Update an existing complaint
router.put("/:id", updateComplaint);

// DELETE: Delete an existing complaint
router.delete("/:id", deleteComplaint);

module.exports = router;