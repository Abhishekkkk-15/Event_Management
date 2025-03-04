"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifiyEmail = exports.sendVerificationCode = void 0;
const mailTransporter_1 = require("../../lib/mailTransporter");
const db_1 = require("../../lib/db");
const redis_1 = require("../../services/redis");
const sendVerificationCode = async (req, res) => {
    const userId = req.user.payload.id;
    try {
        const user = await db_1.db.user.findFirst({
            where: {
                id: userId
            }
        });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found!!" });
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const mailOptions = (to, verificationCode) => ({
            from: '   ', // Sender address
            to, // Receiver email
            subject: "Verify Your Email - Your App Name",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
                  <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
                  <p style="font-size: 16px; color: #555;">Hello,</p>
                  <p style="font-size: 16px; color: #555;">Thank you for signing up. Please use the verification code below to verify your email address:</p>
                  <div style="text-align: center; margin: 20px 0;">
                    <span style="display: inline-block; padding: 10px 20px; font-size: 20px; font-weight: bold; color: #fff; background: #007bff; border-radius: 5px;">
                      ${verificationCode}
                    </span>
                  </div>
                  <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
                  <p style="font-size: 16px; color: #555;">Best regards, <br> Your App Name Team</p>
                </div>
              `,
        });
        await mailTransporter_1.transporter.sendMail(mailOptions(user.email, verificationCode));
        await db_1.db.user.update({
            where: {
                id: userId
            },
            data: {
                verificationCode
            }
        });
        res.status(201).json({ success: true, message: "Verification Email Send!!" });
    }
    catch (error) {
        res.status(505).json({ success: false, message: "Server Error!!" });
        console.log("Error in sendVerificationCode : ", error);
    }
};
exports.sendVerificationCode = sendVerificationCode;
const verifiyEmail = async (req, res) => {
    const verificationCode = req.params.verificationCode;
    if (!verificationCode)
        return res.status(404).json({ success: false, message: "Verification code not provided!!" });
    const userId = req.user.payload.id;
    try {
        const user = await db_1.db.user.findFirst({
            where: {
                id: userId
            }
        });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found!!" });
        if (verificationCode != user.verificationCode)
            return res.json({ success: false, message: "Verification code not matched!!" });
        await db_1.db.user.update({
            where: {
                id: userId
            },
            data: {
                isVerified: true
            }
        });
        redis_1.redisClient.del(`user:${userId}`);
        res.status(201).json({ success: true, message: "User Email verified" });
    }
    catch (error) {
        res.status(505).json({ success: false, message: "Server Error!!" });
        console.log("Error in verifingCode : ", error);
    }
};
exports.verifiyEmail = verifiyEmail;
