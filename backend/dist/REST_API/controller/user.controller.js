"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.updateUser = void 0;
const redis_1 = require("../../services/redis");
const cloudinaryConfig_1 = __importDefault(require("../../lib/cloudinaryConfig"));
const db_1 = require("../../lib/db");
const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const { id } = req.user.payload;
        const file = req.file;
        let user;
        const userInCache = await redis_1.redisClient.get(`user:${id}`);
        if (userInCache) {
            user = JSON.parse(userInCache);
        }
        else {
            user = await db_1.db.user.findUnique({
                where: { id }
            });
        }
        if (file) {
            const avatar = await (0, cloudinaryConfig_1.default)(file.path);
            await db_1.db.user.update({
                where: {
                    id
                },
                data: {
                    avatar: avatar,
                    name: name || user.name,
                    email: email || user.email
                }
            });
        }
        const updatedUser = await db_1.db.user.update({
            where: {
                id
            },
            data: {
                name: name || user.name,
                email: email || user.email
            }
        });
        await redis_1.redisClient.del(`user:${id}`);
        //    await redisClient.set(`user:${id}`,JSON.stringify(user))
        return res.status(200).json({ message: "User Profile Updated" });
    }
    catch (error) {
        res.status(500).json({ message: "Error whilte updating user Profile" });
    }
};
exports.updateUser = updateUser;
const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "logout successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error whilte updating user Profile" });
    }
};
exports.logout = logout;
