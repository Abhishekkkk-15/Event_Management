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
const cloudinaryConfig_js_1 = __importDefault(require("../../lib/cloudinaryConfig.js"));
const fileHandling_js_1 = __importDefault(require("../../lib/fileHandling.js"));
const fs_1 = __importDefault(require("fs"));
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
            const userInCache = await redis_js_1.redisClient.hGetAll(`user:${user.payload.id}`);
            // if (Object.keys(userInCache).length > 0) {
            //     return userInCache
            // }
            const userInfo = await db_1.db.user.findUnique({
                where: {
                    id: user.payload.id
                }
            });
            if (!userInfo) {
                console.log("User not found");
                return { message: "User not found" };
            }
            await redis_js_1.redisClient.hSet(`user:${user.payload.id}`, {
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                avatar: userInfo.avatar || "",
                isVerified: userInfo.isVerified.toString()
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
        }
    },
    Upload: graphql_upload_minimal_1.GraphQLUpload,
    Mutation: {
        signUp: async (_, { user }) => {
            console.log(user);
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
                console.log(newUser);
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
        uploadAvatar: async (_, { file }, { req, res, user }) => {
            try {
                const isUserExist = db_1.db.user.findUnique({
                    where: {
                        id: user.id
                    },
                });
                if (!isUserExist)
                    return { message: "User does not exist" };
                if (!file)
                    return { message: "File not provided" };
                const filePath = await (0, fileHandling_js_1.default)(file);
                const upload = await (0, cloudinaryConfig_js_1.default)(filePath);
                await db_1.db.user.update({
                    where: { id: user.payload.id },
                    data: { avatar: upload },
                });
                fs_1.default.unlinkSync(filePath);
                return `File uploaded successfully: ${upload}`;
            }
            catch (error) {
                console.error("Upload error:", error);
                throw new Error("Failed to upload file");
            }
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
        }
    }
};
