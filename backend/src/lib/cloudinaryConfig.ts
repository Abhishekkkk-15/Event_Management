import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import { config  as econfig} from 'dotenv';

econfig();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (localFilePath:any) => {
  try {
    if (!localFilePath) {
      console.error("No file path provided");
      return null;
    }

    // Upload the file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'image',
    });
    
    // Log the uploaded image's secure URL
    console.log("File uploaded successfully:", uploadResponse.secure_url);
    // Return the secure URL to save in the database
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);

    // Remove the locally saved file if upload fails
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Synchronously delete the file
      console.log("Local file removed due to upload failure");
    }

    return null;
  }
};

export default uploadOnCloudinary;