"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        next();
        return res.status(404).json({ message: " User not authenticated" });
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({ message: " User not authenticated or Token expired" });
    }
};
exports.default = auth;
