"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgetPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../lib/db");
const mailTransporter_1 = require("../../lib/mailTransporter");
const FRONTEND_URL = process.env.FRONTEND_URL; // Ensure fallback
const JWT_SECRET = process.env.JWT_SECRET; // Ensure it's defined
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if user exists
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await db_1.db.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Generate JWT token (valid for 15 minutes)
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "15m" });
        // Frontend Reset Password URL
        const resetLink = `${FRONTEND_URL}/forgetPassword/${token}`;
        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER, // Ensure this is set in .env
            to: email,
            subject: "Password Reset Request",
            html: `
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password. The link is valid for 15 minutes.</p>
                <a href="${resetLink}">${resetLink}</a>
            `,
        };
        // Send Email
        await mailTransporter_1.transporter.sendMail(mailOptions);
        return res.json({ message: "Password reset link sent to your email" });
    }
    catch (error) {
        console.error("Error in forgetPassword:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
exports.forgetPassword = forgetPassword;
const resetPassword = async (req, res) => {
    try {
        // const { token } = req.params; // Token from URL
        const { newPassword, token } = req.body;
        // Verify JWT token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET); // Ensure correct type
        if (!decoded || !decoded.userId) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        // Hash new password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        // Update user password
        await db_1.db.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword },
        });
        return res.json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
exports.resetPassword = resetPassword;
