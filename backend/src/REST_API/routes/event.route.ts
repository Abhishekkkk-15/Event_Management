import {NextFunction, Router} from "express";
import { createEvent } from "../controller/event.controller";
import multer from "multer";
import path from "path";
import { Request } from "express";


const router = Router();
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        console.log(file)
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ".png");
    }
});

// Set a file size limit (2MB per file)
export const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 }, 
}).array("files", 5);


router.post("/create", upload, createEvent);

export default router;
