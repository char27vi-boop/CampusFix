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
const { authenticateToken, optionalToken } = require("../middleware/authMiddleware");

// GET all complaints (students isolated to their own; staff/admin see all)
router.get("/", optionalToken, getAllComplaints);

// GET complaint by ID (students can only see their own)
router.get("/:id", optionalToken, getComplaintById);

// POST a new complaint (associates authenticated user_id)
router.post("/", optionalToken, validateComplaint, createComplaint);

// PUT: Update an existing complaint (Admin/staff can update status/any; students can update their own details)
router.put("/:id", authenticateToken, updateComplaint);

// DELETE: Delete an existing complaint (Admin can delete any; students can delete their own)
router.delete("/:id", authenticateToken, deleteComplaint);

module.exports = router;
