const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

const complaintRoutes = require("./routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("CampusFix Backend is running!");
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Initialize database before starting the server
const { initializeDatabase } = require("./database/db");

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    });