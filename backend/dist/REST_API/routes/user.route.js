"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const multer_1 = __importDefault(require("multer"));
const route = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
route.post('/logout', user_controller_1.logout);
route.put('/updateUser', upload.single('avatar'), user_controller_1.updateUser);
exports.default = route;
