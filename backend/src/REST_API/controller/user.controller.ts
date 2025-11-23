import { redisClient } from "../../services/redis";
import uploadOnCloudinary from "../../lib/cloudinaryConfig";
import { db } from "../../lib/db";
import { Request, Response } from "express";



export const updateUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const { id } = req.user.payload;
        const file = req.file;

        let user;

        const userInCache = await redisClient.get(`user:${id}`)
        if (userInCache) {
            user = JSON.parse(userInCache)
        } else {

            user = await db.user.findUnique({
                where: { id }
            });
        }

        if (file) {
            const avatar = await uploadOnCloudinary(file.path)
            await db.user.update({
                where: {
                    id
                },
                data: {
                    avatar: avatar,
                    name: name || user!.name,
                    email: email || user!.email
                }
            });
        }
        const updatedUser = await db.user.update({
            where: {
                id
            },
            data: {
                name: name || user!.name,
                email: email || user!.email
            }
        });


       await redisClient.del(`user:${id}`)
    //    await redisClient.set(`user:${id}`,JSON.stringify(user))
        return res.status(200).json({message:"User Profile Updated"});
    } catch (error) {
        res.status(500).json({message:"Error whilte updating user Profile"});
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token');
        res.status(200).json({message:"logout successfully"});
    } catch (error) {
        res.status(500).json({message:"Error whilte updating user Profile"});
    }
}