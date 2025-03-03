"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = require("express");
const event_controller_1 = require("../controller/event.controller");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        console.log(file);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ".png");
    }
});
// Set a file size limit (2MB per file)
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).array("files", 5);
router.post("/create", exports.upload, event_controller_1.createEvent);
exports.default = router;
