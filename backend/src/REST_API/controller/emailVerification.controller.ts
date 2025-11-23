import { transporter } from "../../lib/mailTransporter";
import { db } from "../../lib/db";
import { Request, Response } from "express";
import { redisClient } from "../../services/redis";


export const sendVerificationCode = async (req: Request, res: Response) => {
    const userId = req.user.payload.id
    try {
        const user = await db.user.findFirst({
            where: {
                id: userId
            }
        })

        if (!user) return res.status(404).json({ success: false, message: "User not found!!" })
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const mailOptions = (to: string, verificationCode: string) => ({
            from: process.env.EMAIL_USER, // Sender address
            to, // Receiver email
            subject: "Verify Your Email - Event Buddy",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
                  <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
                  <p style="font-size: 16px; color: #555;">Hello,</p>
                  <p style="font-size: 16px; color: #555;">Thank you for signing up. Please use the verification code below to verify your email address with in 10 min:</p>
                  <div style="text-align: center; margin: 20px 0;">
                    <span style="display: inline-block; padding: 10px 20px; font-size: 20px; font-weight: bold; color: #fff; background: #007bff; border-radius: 5px;">
                      ${verificationCode}
                    </span>
                  </div>
                  <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
                  <p style="font-size: 16px; color: #555;">Best regards, <br> Event Buddy </p>
                </div>
              `,
        });

        await transporter.sendMail(mailOptions(user.email, verificationCode))
        
       await redisClient.set(userId, verificationCode,{
        EX:600
       })

        res.status(201).json({ success: true, message: "Verification Email Send!!" })
    } catch (error) {
        res.status(505).json({ success: false, message: "Server Error!!" })
        console.log("Error in sendVerificationCode : ", error)
    }
}

export const verifiyEmail = async (req: Request, res: Response) => {
    const verificationCode = req.params.verificationCode
    if (!verificationCode) return res.status(404).json({ success: false, message: "Verification code not provided!!" })
    const userId = req.user.payload.id
    try {
        const user = await redisClient.get(userId)

        if (!user) return res.status(404).json({ success: false, message: "User not found!!" })

        if (verificationCode != user) return res.json({ success: false, message: "Verification code not matched!!" })

        await db.user.update({
            where: {
                id: userId
            },
            data: {
                isVerified: true
            }
        })
        redisClient.del(`user:${userId}`)
        res.status(201).json({ success: true, message: "User Email verified" })


    } catch (error) {
        res.status(505).json({ success: false, message: "Server Error!!" })
        console.log("Error in verifingCode : ", error)

    }
}