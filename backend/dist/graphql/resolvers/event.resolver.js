"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventResolver = void 0;
const fileHandling_js_1 = __importDefault(require("../../lib/fileHandling.js"));
const cloudinaryConfig_js_1 = __importDefault(require("../../lib/cloudinaryConfig.js"));
const db_1 = require("../../lib/db");
const redis_js_1 = require("../../services/redis.js");
exports.eventResolver = {
    Query: {
        events: async (_, { query, category, page, limit }, { user }) => {
            console.log(user);
            if (category) {
                return await db_1.db.event.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where: {
                        category: category
                    },
                    orderBy: {
                        date: 'asc'
                    }
                });
            }
            if (query) {
                const queryData = await db_1.db.event.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: "Sports"
                                }
                            }, {
                                description: {
                                    contains: "Sports"
                                }
                            }
                        ]
                    }
                });
                console.log(queryData);
                return queryData;
            }
            const today = new Date().toISOString();
            const data = await db_1.db.event.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    date: 'desc'
                }
            });
            console.log("Process handled by : ", process.pid);
            return data;
        },
        event: async (_, { id, limit }, { user }) => {
            // console.log(limit)
            if (!user) {
                throw new Error('Not authenticated');
            }
            const cachedEvent = await redis_js_1.redisClient.get(`event:${id}`);
            if (cachedEvent) {
                return JSON.parse(cachedEvent);
            }
            const fetchedEvent = await db_1.db.event.findUnique({
                where: {
                    id: id
                }
            });
            if (!fetchedEvent) {
                throw new Error('Event not found');
            }
            await redis_js_1.redisClient.set(`event:${id}`, JSON.stringify(fetchedEvent));
            return { ...fetchedEvent, limit: limit };
        },
        bookedSlots: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error('Not authenticated');
            }
            const events = await db_1.db.event.findFirst({
                where: {
                    userId: id
                }
            });
            if (!events)
                throw new Error("No Events create by user");
            return { events, id };
        },
        eventAnalystics: async (_, { eventId }, { user }) => {
            if (!user) {
                throw new Error("Aunthecated!!");
            }
            const totalBookings = await db_1.db.booking.count({
                where: {
                    eventId: eventId
                }
            });
            const totalAttendees = await db_1.db.booking.count({
                where: {
                    eventId: eventId,
                    isUsed: true
                }
            });
            const totalEarnings = await db_1.db.booking.aggregate({
                where: {
                    eventId: eventId,
                },
                _sum: {
                    pricePaid: true
                }
            });
            const attendanceRate = totalBookings > 0 ? (totalAttendees / totalBookings) * 100 : 0;
            return {
                totalBookings,
                totalAttendees,
                totalEarnings,
                attendanceRate
            };
        },
        getReview: async (_, { eventId }) => {
            if (!eventId)
                throw new Error("Event id not provided!");
            return await db_1.db.review.findMany({
                where: {
                    eventId
                }
            });
        }
    },
    Event: {
        user: async (event) => {
            return await db_1.db.user.findUnique({
                where: {
                    id: event.userId
                }
            });
        },
        bookings: async (parent) => {
            const bookings = await db_1.db.booking.findMany({
                where: {
                    eventId: parent.id
                }
            });
            return bookings;
        }
    },
    Booking: {
        user: async (parent) => {
            const fetchedUser = await db_1.db.user.findUnique({
                where: {
                    id: parent.userId
                }
            });
            return fetchedUser;
        },
        event: async (parent) => {
            const fetchedEvent = await db_1.db.event.findUnique({
                where: {
                    id: parent.eventId
                }
            });
            return fetchedEvent;
        }
    },
    Review: {
        user: async (parent) => {
            const fetchedUser = await db_1.db.user.findUnique({
                where: {
                    id: parent.userId
                }
            });
            return fetchedUser;
        },
        event: async (parent) => {
            const fetchedEvent = await db_1.db.event.findUnique({
                where: {
                    id: parent.eventId
                }
            });
            return fetchedEvent;
        }
    },
    Mutation: {
        createEvent: async (_, { event, files }, { req, res, user }) => {
            if (!user) {
                throw new Error('Not authenticated');
            }
            const date = new Date(event.date).toISOString();
            const images = [];
            if (files) {
                for (const file of files) {
                    const filePath = await (0, fileHandling_js_1.default)(file);
                    const upload = await (0, cloudinaryConfig_js_1.default)(filePath);
                    images.push(upload);
                    // fs.unlinkSync(filePath);
                }
            }
            else {
                throw new Error('There should be at least two image');
            }
            const newEvent = await db_1.db.event.create({
                data: {
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    date: date,
                    userId: req.user.payload.id,
                    maxSlots: Number(event.maxSlots) || 10,
                    eventImages: images,
                    price: event.price,
                    category: event.category,
                    startAt: event.startAt,
                    endAt: event.endAt
                }
            });
            return newEvent;
        },
        updateEvent: async (_, { event }, { user }) => {
            if (!user) {
                throw new Error('Not authenticated');
            }
            return await db_1.db.event.update({
                where: {
                    id: event.id
                },
                data: {
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    date: event.date
                }
            });
        },
        deleteEvent: async (_, { eventID }, { user }) => {
            try {
                if (!user) {
                    throw new Error('Not authenticated');
                }
                const isUserValid = await db_1.db.event.findUnique({
                    where: {
                        id: eventID
                    }
                });
                if (isUserValid?.userId != user.payload.id) {
                    return { success: false, message: 'authenticated' };
                }
                const deleteEvent = await db_1.db.event.delete({
                    where: {
                        id: eventID
                    }
                });
                await redis_js_1.redisClient.del(`user:${user.payload.id}`);
                return { success: false, message: 'Deleted Successfully' };
            }
            catch (error) {
                console.log(error);
                throw new Error('Error deleting event');
            }
        },
        bookSlot: async (_, { eventId, noOfTicket }, { user }) => {
            console.log("Its woring : ", eventId, noOfTicket, user.payload.id);
            const userId = user.payload.id;
            if (!user && !eventId) {
                throw new Error("Both userId and eventId are required");
            }
            const isAlreadyBooked = await db_1.db.booking.findFirst({
                where: {
                    userId: userId,
                    eventId: eventId
                }
            });
            if (isAlreadyBooked) {
                console.log("Already booked");
                throw new Error("Already booked you slot");
            }
            console.log("trying book");
            try {
                const booking = await db_1.db.booking.create({
                    data: {
                        userId: userId,
                        eventId: eventId,
                        tickets: Number(noOfTicket)
                    }
                });
                await db_1.db.event.update({
                    where: {
                        id: eventId
                    },
                    data: {
                        bookedSlots: Number(noOfTicket)
                    }
                });
                return booking;
            }
            catch (error) {
                console.log(error);
                throw Error("Error while booking Slot");
            }
        }
    }
};
