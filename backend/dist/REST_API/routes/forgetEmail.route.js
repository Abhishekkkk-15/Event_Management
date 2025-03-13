"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const forgetPassword_controller_1 = require("../controller/forgetPassword.controller");
const route = (0, express_1.Router)();
route.post('/forgetEmail', forgetPassword_controller_1.forgetPassword);
route.put('/resetPassword', forgetPassword_controller_1.resetPassword);
exports.default = route;
