import bcrypt from "bcryptjs";
import { db } from "../../lib/db";
import { sign } from "../../lib/jwt";
import { GraphQLUpload } from 'graphql-upload-minimal';
import uploadOnCloudinary from '../../lib/cloudinaryConfig.js';
import fileHandling from "../../lib/fileHandling.js";
import fs from 'fs'
import { redisClient } from "../../services/redis.js";
import { LoginInput, SignUpInput, User } from "@/lib/type";

export const userResolver = {

    Query: {
        users: async (_: any, __: any, { user }: any) => {
            if (!user) {
                throw new Error('Not authenticated');
            }
            return await db.user.findMany();
        },
        user: async (_: any, __: any, { user }: any) => {

            if (!user.payload) {
                throw new Error('Not authenticated');
            }
            return await db.user.findUnique({
                where: {
                    id: user.payload.id
                }
            });
        },
        getAuthuser: async (_: any, __: any, { req, res, user }: any) => {
            if (!user) return { message: "User not authenticate" }

            const userInCache = await redisClient.get(`user:${user.payload.id}`)
            if (userInCache) {
                // console.log(userInCache)
                return JSON.parse(userInCache)
            }

            const userInfo = await db.user.findUnique({
                where: {
                    id: user.payload.id
                },
                include:{
                    wishList: true
                }
            })



            if (!userInfo) {
                console.log("User not found")
                return { message: "User not found" }

            }

            const chachData = {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                avatar: userInfo.avatar || "",
                isVerified: userInfo.isVerified,
                wishList: userInfo.wishList || []
            }


            await redisClient.set(`user:${user.payload.id}`, JSON.stringify(chachData), {
                EX: 180
            });
            // console.log(userInfo)
            return userInfo
        },
    },

    User: {
        events: async (parent: any) => {
            // console.log("Parent : ",parent)
            const userEvents = await db.event.findMany({
                where: {
                    userId: parent.id
                }
            })
            return userEvents
        },
        bookings: async (parent: any) => {

            const userBookings = await db.booking.findMany({
                where: {
                    userId: parent.id
                }
            })
            return userBookings
        },
        wishList: async(parent: any) => {
            const wishList = await db.wishList.findMany({
                where:{
                    userId: parent.id
                }
            })
            return wishList
        }
    },
    WishList:{
        user:async (parent: any) =>{
            return await db.user.findFirst({
                where:{
                    id: parent.userId
                }
            })
        },
        event:async (parent: any) =>{
            return await db.event.findFirst({
                where:{
                    id: parent.eventId
                }
            })
        }
    },

    Upload: GraphQLUpload,
    Mutation: {
        signUp: async (_: any, { user }: { user: SignUpInput }) => {
            const { email, password, name } = user;
            if (!email || !name || !password) {
                throw new Error("All fields are required");
            }

            try {
                const existingUser = await db.user.findUnique({
                    where: {
                        email: email
                    }
                });

                if (existingUser) {
                    throw new Error("User already exists");
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await db.user.create({
                    data: {
                        email: email,
                        password: hashedPassword,
                        name: name,
                    }
                })

                return newUser
            } catch (error: any) {
                throw new Error(error.message);
            }

        },
        login: async (_: any, { input }: { input: LoginInput }, { req, res }: any) => {
            const { email, password } = input;
            if (!email || !password) {
                throw new Error("All fields are required");
            }

            try {
                const user = await db.user.findUnique({
                    where: {
                        email: email
                    }
                });

                if (!user) {
                    throw new Error("User does not exist");
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                const token = sign({ "id": user.id });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: "false", // Only secure in production
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
                    sameSite: 'None',
                });

                return user;

            } catch (error: any) {
                throw new Error(error.message);
            }
        },
        logout: async (_: any, __: any, { req, res, user }: any) => {
            console.log("Logout is getting called!!")

            if (!user) throw new Error("User is not logged in");
            res.clearCookie("token");
            return "Done"

        },
        updateUser: async (_: any, { userInput }: { userInput: { email: string; name: string } }, { req, res, user }: any) => {
            try {
                if (!user || !user.payload || !user.payload.id) {
                    throw new Error("Unauthorized: User not authenticated");
                }

                const { email, name } = userInput;

                const updatedUser = await db.user.update({
                    where: { id: user.payload.id },
                    data: { name, email },
                });

                return {
                    success: true,
                    message: "Profile updated successfully",
                    user: updatedUser
                };
            } catch (err) {
                console.error("Update User Error:", err);
                return {
                    success: false,
                    message: err || "Something went wrong while updating the user",
                    user: null
                };
            }
        },
        addToWishList: async (_: any, { eventId }: { eventId: string }, { req, res, user }: any) => {

            if (!user) throw new Error("UnAuntincated user!!")
            const wish = await db.wishList.create({
                data: {
                    userId: user.payload.id,
                    eventId: eventId
                }
            })

            redisClient.del(`user:${user.payload.id}`)

             return {message:"Done"}
        },
        removeFromWishList: async (_: any, { Id }: { Id: string }, { req, res, user }: any) => {
            if (!Id) throw new Error("Id not provided")
                console.log("first")
            await db.wishList.delete({
                where: {
                    id: Id
                }
            })
            return {message:"Done"}
        }

    }
}