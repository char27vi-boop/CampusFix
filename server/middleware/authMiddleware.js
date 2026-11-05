const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "campusfix-super-secret-key-2026";

/**
 * Middleware to verify JWT token from Authorization header.
 * Attaches decoded user payload ({ user_id, email, name, role }) to req.user.
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please provide a valid Bearer token."
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token. Please log in again."
            });
        }

        req.user = decoded;
        next();
    });
}

/**
 * Optional token verification.
 * If token is present and valid, attaches req.user; otherwise leaves req.user = null without throwing 401.
 */
function optionalToken(req, res, next) {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : null;

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (!err && decoded) {
            req.user = decoded;
        } else {
            req.user = null;
        }
        next();
    });
}

/**
 * RBAC middleware: ensures the authenticated user has one of the allowed roles.
 * Must be used after authenticateToken.
 */
function requireRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const userRole = (req.user.role || "").toLowerCase();
        const normalizedRoles = allowedRoles.map((r) => r.toLowerCase());

        if (!normalizedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Requires one of the following roles: [${allowedRoles.join(", ")}].`
            });
        }

        next();
    };
}

module.exports = {
    JWT_SECRET,
    authenticateToken,
    optionalToken,
    requireRoles
};
