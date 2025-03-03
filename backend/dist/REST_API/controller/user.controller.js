"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.updateUser = void 0;
const cloudinaryConfig_1 = __importDefault(require("../../lib/cloudinaryConfig"));
const db_1 = require("../../lib/db");
const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const { id } = req.user.payload;
        const file = req.file;
        const user = await db_1.db.user.findUnique({
            where: { id }
        });
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
        return res.send(updatedUser);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.updateUser = updateUser;
const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.send('logout');
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.logout = logout;
