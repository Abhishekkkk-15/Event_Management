"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../lib/db");
const jwt_1 = require("../../lib/jwt");
const graphql_upload_minimal_1 = require("graphql-upload-minimal");
const redis_js_1 = require("../../services/redis.js");
exports.userResolver = {
    Query: {
        users: async (_, __, { user }) => {
            if (!user) {
                throw new Error('Not authenticated');
            }
            return await db_1.db.user.findMany();
        },
        user: async (_, __, { user }) => {
            if (!user.payload) {
                throw new Error('Not authenticated');
            }
            return await db_1.db.user.findUnique({
                where: {
                    id: user.payload.id
                }
            });
        },
        getAuthuser: async (_, __, { req, res, user }) => {
            if (!user)
                return { message: "User not authenticate" };
            const userInCache = await redis_js_1.redisClient.get(`user:${user.payload.id}`);
            if (userInCache) {
                return JSON.parse(userInCache);
            }
            const userInfo = await db_1.db.user.findUnique({
                where: {
                    id: user.payload.id
                },
                include: {
                    wishList: true
                }
            });
            if (!userInfo) {
                console.log("User not found");
                return { message: "User not found" };
            }
            const chachData = {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                avatar: userInfo.avatar || "",
                isVerified: userInfo.isVerified,
                wishList: userInfo.wishList || []
            };
            await redis_js_1.redisClient.set(`user:${user.payload.id}`, JSON.stringify(chachData), {
                EX: 600
            });
            // console.log(userInfo)
            return userInfo;
        },
    },
    User: {
        events: async (parent) => {
            // console.log("Parent : ",parent)
            const userEvents = await db_1.db.event.findMany({
                where: {
                    userId: parent.id
                }
            });
            return userEvents;
        },
        bookings: async (parent) => {
            const userBookings = await db_1.db.booking.findMany({
                where: {
                    userId: parent.id
                }
            });
            return userBookings;
        },
        wishList: async (parent) => {
            const wishList = await db_1.db.wishList.findMany({
                where: {
                    userId: parent.id
                }
            });
            return wishList;
        }
    },
    WishList: {
        user: async (parent) => {
            return await db_1.db.user.findFirst({
                where: {
                    id: parent.userId
                }
            });
        },
        event: async (parent) => {
            return await db_1.db.event.findFirst({
                where: {
                    id: parent.eventId
                }
            });
        }
    },
    Upload: graphql_upload_minimal_1.GraphQLUpload,
    Mutation: {
        signUp: async (_, { user }) => {
            const { email, password, name } = user;
            if (!email || !name || !password) {
                throw new Error("All fields are required");
            }
            try {
                const existingUser = await db_1.db.user.findUnique({
                    where: {
                        email: email
                    }
                });
                if (existingUser) {
                    throw new Error("User already exists");
                }
                const hashedPassword = await bcryptjs_1.default.hash(password, 10);
                const newUser = await db_1.db.user.create({
                    data: {
                        email: email,
                        password: hashedPassword,
                        name: name,
                    }
                });
                return newUser;
            }
            catch (error) {
                throw new Error(error.message);
            }
        },
        login: async (_, { input }, { req, res }) => {
            const { email, password } = input;
            if (!email || !password) {
                throw new Error("All fields are required");
            }
            try {
                const user = await db_1.db.user.findUnique({
                    where: {
                        email: email
                    }
                });
                if (!user) {
                    throw new Error("User does not exist");
                }
                const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }
                const token = (0, jwt_1.sign)({ "id": user.id });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: "false", // Only secure in production
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
                    sameSite: 'None',
                });
                return user;
            }
            catch (error) {
                throw new Error(error.message);
            }
        },
        logout: async (_, __, { req, res, user }) => {
            console.log("Logout is getting called!!");
            if (!user)
                throw new Error("User is not logged in");
            res.clearCookie("token");
            return "Done";
        },
        updateUser: async (_, { userInput }, { req, res, user }) => {
            try {
                if (!user || !user.payload || !user.payload.id) {
                    throw new Error("Unauthorized: User not authenticated");
                }
                const { email, name } = userInput;
                const updatedUser = await db_1.db.user.update({
                    where: { id: user.payload.id },
                    data: { name, email },
                });
                return {
                    success: true,
                    message: "Profile updated successfully",
                    user: updatedUser
                };
            }
            catch (err) {
                console.error("Update User Error:", err);
                return {
                    success: false,
                    message: err || "Something went wrong while updating the user",
                    user: null
                };
            }
        },
        addToWishList: async (_, { eventId }, { req, res, user }) => {
            if (!user)
                throw new Error("UnAuntincated user!!");
            const wish = await db_1.db.wishList.create({
                data: {
                    userId: user.payload.id,
                    eventId: eventId
                }
            });
            redis_js_1.redisClient.del(`user:${user.payload.id}`);
            return { message: "Done" };
        },
        removeFromWishList: async (_, { Id }, { req, res, user }) => {
            if (!Id)
                throw new Error("Id not provided");
            await db_1.db.wishList.delete({
                where: {
                    id: Id
                }
            });
            return { message: "Done" };
        }
    }
};
