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
const { authenticateToken, optionalToken, requireRoles } = require("../middleware/authMiddleware");

// GET all complaints (optional token to support ?mine=true filter)
router.get("/", optionalToken, getAllComplaints);

// GET complaint by ID
router.get("/:id", optionalToken, getComplaintById);

// POST a new complaint (optionalToken associates user_id if logged in)
router.post("/", optionalToken, validateComplaint, createComplaint);

// PUT: Update an existing complaint (Protected: requires admin or staff role)
router.put("/:id", authenticateToken, requireRoles("admin", "staff"), updateComplaint);

// DELETE: Delete an existing complaint (Protected: requires admin role)
router.delete("/:id", authenticateToken, requireRoles("admin"), deleteComplaint);

module.exports = router;
