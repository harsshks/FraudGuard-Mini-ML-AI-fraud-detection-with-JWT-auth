const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

// Helper — generate JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * POST /api/auth/register
 * Create a new account.
 */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "Please provide name, email, and password" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "An account with this email already exists" });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                token: generateToken(user._id),
            },
        });
    } catch (error) {
        console.error("❌ Register error:", error.message);

        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, error: messages.join(", ") });
        }

        res.status(500).json({ success: false, error: "Registration failed" });
    }
});

/**
 * POST /api/auth/login
 * Log in with email + password.
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Please provide email and password" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                token: generateToken(user._id),
            },
        });
    } catch (error) {
        console.error("❌ Login error:", error.message);
        res.status(500).json({ success: false, error: "Login failed" });
    }
});

/**
 * GET /api/auth/profile
 * Get current user's profile (protected).
 */
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        console.error("❌ Profile error:", error.message);
        res.status(500).json({ success: false, error: "Failed to fetch profile" });
    }
});

/**
 * PUT /api/auth/profile
 * Update current user's name / email (protected).
 */
router.put("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const { name, email } = req.body;
        if (name) user.name = name;
        if (email) {
            // Check if new email is already taken by another user
            const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
            if (existing) {
                return res.status(400).json({ success: false, error: "Email is already in use" });
            }
            user.email = email;
        }

        await user.save();

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("❌ Profile update error:", error.message);
        res.status(500).json({ success: false, error: "Failed to update profile" });
    }
});

module.exports = router;
