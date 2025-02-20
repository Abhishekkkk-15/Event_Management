"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function fileHandling(file) {
    const { createReadStream, filename } = await file;
    if (!filename || !createReadStream) {
        throw new Error('Invalid file received.');
    }
    const uploadDir = path_1.default.join(__dirname, "uploads");
    console.log(uploadDir);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    // Create file path and stream
    const filePath = path_1.default.join(uploadDir, filename);
    const stream = createReadStream();
    const out = fs_1.default.createWriteStream(filePath);
    stream.pipe(out);
    await new Promise((resolve) => out.on("finish", resolve));
    return filePath;
}
exports.default = fileHandling;
