const express = require("express");
const router = express.Router();

const {
    getAllComplaints,
    getComplaintById,
    createComplaint
} = require("../controllers/complaintController");

const validateComplaint = require("../middleware/validateComplaint");

// GET all complaints
router.get("/", getAllComplaints);

// GET complaint by ID
router.get("/:id", getComplaintById);

// POST a new complaint
router.post("/", validateComplaint, createComplaint);

module.exports = router;