const jwt = require("jsonwebtoken");

/**
 * JWT authentication middleware.
 * Accepts token from:
 *   - Authorization: Bearer <token> header
 *   - ?token=<token> query param (for PDF downloads via window.open)
 * Attaches req.user = { id } on success.
 */
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Also accept token from query string (for PDF download via window.open)
    const queryToken = req.query.token;

    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : queryToken;

    if (!token) {
        return res.status(401).json({ success: false, error: "Not authorized — no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error("❌ Auth error:", error.message);
        return res.status(401).json({ success: false, error: "Not authorized — invalid token" });
    }
};

module.exports = protect;
