import fs from "fs";
import path from "path";

async function fileHandling(filePath: string) {
    // console.log("Processing file:", filePath);

    if (!fs.existsSync(filePath)) {
        throw new Error("File does not exist: " + filePath);
    }

    // Read file from the path
    const stream = fs.createReadStream(filePath);
    const uploadDir = path.join(__dirname, "uploads");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const outPath = path.join(uploadDir, path.basename(filePath));
    const out = fs.createWriteStream(outPath);

    stream.pipe(out);

    await new Promise((resolve) => out.on("finish",()=> resolve));

    return outPath; // Return the saved file path
}

export default fileHandling;
