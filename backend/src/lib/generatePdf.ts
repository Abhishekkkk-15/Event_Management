import PDFDocument from 'pdfkit';
import fs from 'fs';
import QRCODE from 'qrcode';

export const generateTicketPDF = async (ticketId: string, userEmail: string, eventTitle: string, tickets: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument();
            if (!fs.existsSync("./tickets")) fs.mkdirSync("./tickets", { recursive: true });

            const pdfPath = `./tickets/ticket-${ticketId}.pdf`; // Change the path
            const writeStream = fs.createWriteStream(pdfPath);
            doc.pipe(writeStream);

            doc.fontSize(20).text("Event Ticket", { align: "center" }).moveDown();
            doc.fontSize(14).text(`Event Title: ${eventTitle}`, { align: "center" }).text(`User Email: ${userEmail}`, { align: "center" }).moveDown();
            doc.fontSize(14).text(`No of Seat's: ${tickets} `, { align: "center" })
            // ✅ Generate QR Code before adding to PDF
            const qrCodePath = `./tickets/qrcode-${ticketId}.png`; // Change the path
            await QRCODE.toFile(qrCodePath, ticketId);

            // ✅ Ensure QR code exists before adding
            const pageWidth = doc.page.width;
            if (fs.existsSync(qrCodePath)) {
                const imageSize = 150; // Set desired image size
                const xPos = (pageWidth - imageSize) / 2; // Calculate center position
                doc.image(qrCodePath, xPos, doc.y, { width: imageSize });
            } else {
                console.error("QR Code generation failed!");
                return reject("QR Code generation failed");
            }

            doc.end(); // ✅ Close document properly

            // ✅ Resolve once file is written
            writeStream.on("finish", () => resolve(pdfPath));
            writeStream.on("error", reject);
        } catch (error) {
            reject(error);
        }
    });
};
