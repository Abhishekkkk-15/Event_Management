"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = void 0;
const queue_1 = require("../../bullMQ/queue");
const createEvent = async (req, res) => {
    try {
        const { title, description, location, date, maxSlots, price, category, startAt, endAt, userEmail } = req.body;
        if (!req.files || !Array.isArray(req.files) || req.files.length < 2) {
            return res.status(400).json({ error: "At least two images are required" });
        }
        // Extract file paths instead of passing full file objects
        const filePaths = req.files.map(file => file.path);
        // Add job to the queue
        const job = await queue_1.eventQueue.add("create-event", {
            event: { title, description, location, date, maxSlots, price, category, startAt, endAt, userEmail },
            files: filePaths, // ✅ Pass only file paths
            userId: req.user.payload.id
        });
        return res.status(200).json({ message: "Event creation job queued", jobId: job.id });
    }
    catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.createEvent = createEvent;
