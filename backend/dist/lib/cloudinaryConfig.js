"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("No file path provided");
            return null;
        }
        // Upload the file to Cloudinary
        const uploadResponse = await cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: 'image',
        });
        // Log the uploaded image's secure URL
        console.log("File uploaded successfully:", uploadResponse.secure_url);
        // Return the secure URL to save in the database
        return uploadResponse.secure_url;
    }
    catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        // Remove the locally saved file if upload fails
        if (localFilePath && fs_1.default.existsSync(localFilePath)) {
            fs_1.default.unlinkSync(localFilePath); // Synchronously delete the file
            console.log("Local file removed due to upload failure");
        }
        return null;
    }
};
exports.default = uploadOnCloudinary;
