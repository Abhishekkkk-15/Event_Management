"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        next();
        return null;
    }
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log(error);
        throw new Error('Invalid or expired token');
    }
};
exports.default = authenticate;
