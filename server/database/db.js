const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

// Keep the database file inside server/database.
const databasePath = path.join(__dirname, "campusfix.db");
const schemaPath = path.join(__dirname, "schema.sql");

// Connect to the CampusFix SQLite database.
const db = new sqlite3.Database(databasePath, (error) => {
    if (error) {
        console.error("Could not connect to CampusFix database:", error.message);
    } else {
        console.log("Connected to CampusFix SQLite database.");
    }
});

// Seed default users and sample complaints if database is newly initialized
async function seedDefaultData() {
    return new Promise((resolve) => {
        db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
            if (err || (row && row.count > 0)) {
                return resolve();
            }

            try {
                const adminHash = await bcrypt.hash("admin123", 10);
                const studentHash = await bcrypt.hash("student123", 10);
                const staffHash = await bcrypt.hash("staff123", 10);

                const insertUser = `
                    INSERT INTO users (name, email, password_hash, role)
                    VALUES (?, ?, ?, ?)
                `;

                db.run(insertUser, ["Campus Admin", "admin@campusfix.edu", adminHash, "admin"], function (e1) {
                    if (e1) console.error("Admin seed error:", e1.message);
                });

                db.run(insertUser, ["Alex Student", "student@campusfix.edu", studentHash, "student"], function (e2) {
                    if (e2) {
                        console.error("Student seed error:", e2.message);
                        return resolve();
                    }

                    const studentId = this.lastID;

                    db.run(insertUser, ["Maintenance Staff", "staff@campusfix.edu", staffHash, "staff"]);

                    // Seed a few initial complaints
                    db.get("SELECT COUNT(*) as cCount FROM complaints", (cErr, cRow) => {
                        if (!cErr && cRow && cRow.cCount === 0) {
                            const sampleComplaints = [
                                [
                                    "CF1001",
                                    studentId,
                                    "Water leakage in Library 2nd floor restroom",
                                    "Water is continuously dripping from the sink pipe causing water accumulation on the floor.",
                                    "Plumbing",
                                    "Central Library, 2nd Floor",
                                    "High",
                                    "In Progress"
                                ],
                                [
                                    "CF1002",
                                    studentId,
                                    "Wi-Fi router unresponsive in Hostel Block B",
                                    "Hostel B 3rd floor Wi-Fi signal drops frequently, causing disruption during evening hours.",
                                    "Internet & Wi-Fi",
                                    "Hostel Block B, 3rd Floor",
                                    "Medium",
                                    "Pending"
                                ],
                                [
                                    "CF1003",
                                    studentId,
                                    "Broken desk in Seminar Hall 1",
                                    "Two wooden benches have loose screws and pose a hazard to students.",
                                    "Carpentry & Furniture",
                                    "Academic Block 1, Hall 101",
                                    "Low",
                                    "Resolved"
                                ]
                            ];

                            const insertComplaint = `
                                INSERT INTO complaints (id, user_id, title, description, category, location, priority, status)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                            `;

                            for (const c of sampleComplaints) {
                                db.run(insertComplaint, c);
                            }
                            console.log("Seeded initial sample complaints and default accounts.");
                        }
                        resolve();
                    });
                });
            } catch (seedErr) {
                console.error("Error during database seeding:", seedErr);
                resolve();
            }
        });
    });
}

// Initialize the database and create tables.
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        // Enable foreign-key enforcement before executing the schema.
        db.run("PRAGMA foreign_keys = ON", (error) => {
            if (error) {
                return reject(error);
            }

            // Read the SQL schema file.
            const schema = fs.readFileSync(schemaPath, "utf8");

            // Execute the schema to create tables and indexes.
            db.exec(schema, async (execError) => {
                if (execError) {
                    return reject(execError);
                }

                console.log("CampusFix database tables are ready.");
                await seedDefaultData();
                resolve();
            });
        });
    });
}

// Export database connection and initialization function.
module.exports = {
    db,
    initializeDatabase
};
