import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../../lib/db";
import { transporter } from "../../lib/mailTransporter";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

const FRONTEND_URL = process.env.FRONTEND_URL ; // Ensure fallback
const JWT_SECRET = process.env.JWT_SECRET as string; // Ensure it's defined

export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
       
        // Check if user exists
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate JWT token (valid for 15 minutes)
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "15m" });

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
        await transporter.sendMail(mailOptions);

        return res.json({ message: "Password reset link sent to your email" });

    } catch (error: any) {
        console.error("Error in forgetPassword:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        // const { token } = req.params; // Token from URL
        const { newPassword ,token} = req.body;
       

        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // Ensure correct type
        if (!decoded || !decoded.userId) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await db.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword },
        });

        return res.json({ message: "Password reset successful" });

    } catch (error: any) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
