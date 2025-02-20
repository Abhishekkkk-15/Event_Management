"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.sign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
const sign = (payload) => {
    return jsonwebtoken_1.default.sign({ payload }, secret, { expiresIn: '7d' });
};
exports.sign = sign;
const verify = (token) => jsonwebtoken_1.default.verify(token, secret);
exports.verify = verify;
