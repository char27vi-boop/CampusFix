
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

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
            db.exec(schema, (error) => {
                if (error) {
                    return reject(error);
                }

                console.log("CampusFix database tables are ready.");
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
