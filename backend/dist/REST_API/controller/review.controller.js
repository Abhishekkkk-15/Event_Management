"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventRating = exports.createReview = void 0;
const db_1 = require("../../lib/db");
const createReview = async (req, res) => {
    try {
        const { eventId, rating, comment } = req.body;
        const userId = req.user.payload.id; // Assuming authentication is set up
        if (!eventId || !rating) {
            return res.status(400).json({ error: 'Event ID and rating are required' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        const review = await db_1.db.review.create({
            data: { eventId, userId, rating, comment },
        });
        res.status(201).json({ message: 'Review submitted', review });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
};
exports.createReview = createReview;
const getEventRating = async (req, res) => {
    try {
        const { eventId } = req.params;
        const result = await db_1.db.review.aggregate({
            where: { eventId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        res.json({
            averageRating: result._avg.rating || 0,
            totalReviews: result._count.rating || 0,
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
};
exports.getEventRating = getEventRating;
