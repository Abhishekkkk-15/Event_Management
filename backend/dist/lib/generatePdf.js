"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTicketPDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const qrcode_1 = __importDefault(require("qrcode"));
const generateTicketPDF = async (ticketId, userEmail, eventTitle, tickets) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new pdfkit_1.default();
            if (!fs_1.default.existsSync("./tickets"))
                fs_1.default.mkdirSync("./tickets", { recursive: true });
            const pdfPath = `./tickets/ticket-${ticketId}.pdf`; // Change the path
            const writeStream = fs_1.default.createWriteStream(pdfPath);
            doc.pipe(writeStream);
            doc.fontSize(20).text("Event Ticket", { align: "center" }).moveDown();
            doc.fontSize(14).text(`Event Title: ${eventTitle}`, { align: "center" }).text(`User Email: ${userEmail}`, { align: "center" }).moveDown();
            doc.fontSize(14).text(`No of Seat's: ${tickets} `, { align: "center" });
            // ✅ Generate QR Code before adding to PDF
            const qrCodePath = `./tickets/qrcode-${ticketId}.png`; // Change the path
            await qrcode_1.default.toFile(qrCodePath, ticketId);
            // ✅ Ensure QR code exists before adding
            const pageWidth = doc.page.width;
            if (fs_1.default.existsSync(qrCodePath)) {
                const imageSize = 150; // Set desired image size
                const xPos = (pageWidth - imageSize) / 2; // Calculate center position
                doc.image(qrCodePath, xPos, doc.y, { width: imageSize });
            }
            else {
                console.error("QR Code generation failed!");
                return reject("QR Code generation failed");
            }
            doc.end(); // ✅ Close document properly
            // ✅ Resolve once file is written
            writeStream.on("finish", () => resolve(pdfPath));
            writeStream.on("error", reject);
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.generateTicketPDF = generateTicketPDF;
