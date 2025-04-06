"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = void 0;
const eventProducer_1 = require("../../services/kafka/producers/eventProducer");
const createEvent = async (req, res) => {
    try {
        const { title, description, location, date, maxSlots, price, category, startAt, endAt, userEmail } = req.body;
        if (!req.files || !Array.isArray(req.files) || req.files.length < 2) {
            return res.status(400).json({ error: "At least two images are required" });
        }
        const filePaths = req.files.map(file => file.path);
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
