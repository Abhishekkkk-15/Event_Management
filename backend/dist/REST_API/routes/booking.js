"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qr_controller_1 = require("../controller/qr.controller");
const route = (0, express_1.Router)();
route.post('/booking-ticket', qr_controller_1.bookTicket);
route.get('/download-ticket', qr_controller_1.downloadTicket);
route.post('/validate-ticket', qr_controller_1.verifyTicket);
exports.default = route;
