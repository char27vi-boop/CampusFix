const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../database/db");
const { JWT_SECRET } = require("../middleware/authMiddleware");

// Email regex pattern for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ["student", "admin", "staff"];

/**
 * POST /api/auth/signup
 * Register a new user with name, email, password, and optional role (defaults to student).
 */
const signup = (req, res) => {
    let { name, email, password, role } = req.body;

    // Validate inputs
    if (!name || typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: "Name is required and must be at least 2 characters long."
        });
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "A valid email address is required."
        });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long."
        });
    }

    // Role assignment
    const assignedRole = role && ALLOWED_ROLES.includes(role.toLowerCase())
        ? role.toLowerCase()
        : "student";

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user already exists
    db.get(
        "SELECT user_id FROM users WHERE email = ? COLLATE NOCASE",
        [cleanEmail],
        async (findErr, existingUser) => {
            if (findErr) {
                console.error("Database query error during signup:", findErr.message);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error."
                });
            }

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "An account with this email address already exists."
                });
            }

            try {
                // Hash password
                const passwordHash = await bcrypt.hash(password, 10);

                // Insert into SQLite database
                const insertSql = `
                    INSERT INTO users (name, email, password_hash, role)
                    VALUES (?, ?, ?, ?)
                `;

                db.run(insertSql, [cleanName, cleanEmail, passwordHash, assignedRole], function (insertErr) {
                    if (insertErr) {
                        console.error("Database insert error during signup:", insertErr.message);
                        return res.status(500).json({
                            success: false,
                            message: "Unable to create account. Please try again."
                        });
                    }

                    const newUserId = this.lastID;

                    const tokenPayload = {
                        user_id: newUserId,
                        email: cleanEmail,
                        name: cleanName,
                        role: assignedRole
                    };

                    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

                    return res.status(201).json({
                        success: true,
                        message: "Account created successfully.",
                        token,
                        user: {
                            user_id: newUserId,
                            name: cleanName,
                            email: cleanEmail,
                            role: assignedRole
                        }
                    });
                });
            } catch (hashErr) {
                console.error("Password hashing error:", hashErr);
                return res.status(500).json({
                    success: false,
                    message: "Error securing password."
                });
            }
        }
    );
};

/**
 * POST /api/auth/login
 * Authenticate existing user with email and password.
 */
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    db.get(
        "SELECT user_id, name, email, password_hash, role FROM users WHERE email = ? COLLATE NOCASE",
        [cleanEmail],
        async (error, user) => {
            if (error) {
                console.error("Database error during login:", error.message);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error."
                });
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            try {
                const isMatch = await bcrypt.compare(password, user.password_hash);
                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password."
                    });
                }

                const tokenPayload = {
                    user_id: user.user_id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                };

                const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

                return res.status(200).json({
                    success: true,
                    message: "Login successful.",
                    token,
                    user: {
                        user_id: user.user_id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            } catch (compareErr) {
                console.error("Password comparison error:", compareErr);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error."
                });
            }
        }
    );
};

/**
 * GET /api/auth/me
 * Return current logged-in user details from token.
 */
const getMe = (req, res) => {
    if (!req.user || !req.user.user_id) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated."
        });
    }

    db.get(
        "SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?",
        [req.user.user_id],
        (error, user) => {
            if (error) {
                console.error("Error fetching user profile:", error.message);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error."
                });
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User account not found."
                });
            }

            return res.status(200).json({
                success: true,
                user
            });
        }
    );
};

module.exports = {
    signup,
    login,
    getMe
};
