"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailVerification_controller_1 = require("../controller/emailVerification.controller");
const route = (0, express_1.Router)();
route.get('/sendVerificationCode', emailVerification_controller_1.sendVerificationCode);
route.post('/verifiyCode/:verificationCode', emailVerification_controller_1.verifiyEmail);
exports.default = route;
