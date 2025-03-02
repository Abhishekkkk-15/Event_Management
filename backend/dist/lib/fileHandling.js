"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function fileHandling(filePath) {
    // console.log("Processing file:", filePath);
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error("File does not exist: " + filePath);
    }
    // Read file from the path
    const stream = fs_1.default.createReadStream(filePath);
    const uploadDir = path_1.default.join(__dirname, "uploads");
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    const outPath = path_1.default.join(uploadDir, path_1.default.basename(filePath));
    const out = fs_1.default.createWriteStream(outPath);
    stream.pipe(out);
    await new Promise((resolve) => out.on("finish", () => resolve));
    return outPath; // Return the saved file path
}
exports.default = fileHandling;
