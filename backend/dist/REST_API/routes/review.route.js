"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controller/review.controller");
const route = (0, express_1.Router)();
route.post('/addReview', review_controller_1.createReview);
route.get('/getEventRating', review_controller_1.getEventRating);
exports.default = route;
