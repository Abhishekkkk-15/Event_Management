"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = void 0;
const eventProducer_1 = require("../../services/kafka/producers/eventProducer");
// export const createEvent = async (req: Request, res: Response) => {
//     try {
//         const { title, description, location, date, maxSlots, price, category, startAt, endAt ,userEmail } = req.body;
//         if (!req.files || !Array.isArray(req.files) || req.files.length < 2) {
//             return res.status(400).json({ error: "At least two images are required" });
//         }
//         // Extract file paths instead of passing full file objects
//         const filePaths = req.files.map(file => file.path);
//         // Add job to the queue
//         const job = await eventQueue.add("create-event", {
//             event: { title, description, location, date, maxSlots, price, category, startAt, endAt,userEmail },
//             files: filePaths,  // ✅ Pass only file paths
//             userId: req.user.payload.id
//         });
//         return res.status(200).json({ message: "Event creation job queued", jobId: job.id });
//     } catch (error) {
//         console.error("Error creating event:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };
const createEvent = async (req, res) => {
    try {
        const { title, description, location, date, maxSlots, price, category, startAt, endAt, userEmail } = req.body;
        if (!req.files || !Array.isArray(req.files) || req.files.length < 2) {
            return res.status(400).json({ error: "At least two images are required" });
        }
        const filePaths = req.files.map(file => file.path);
        // 🔥 Publish to Kafka instead of adding to BullMQ
        await (0, eventProducer_1.publishEventCreated)({
            event: {
                title,
                description,
                location,
                date,
                maxSlots,
                price,
                category,
                startAt,
                endAt,
                userEmail
            },
            files: filePaths,
            userId: req.user.payload.id
        });
        return res.status(200).json({ message: "Event creation job published to Kafka" });
    }
    catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.createEvent = createEvent;
