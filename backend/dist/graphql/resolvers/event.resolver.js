"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventResolver = void 0;
const db_1 = require("../../lib/db");
const redis_js_1 = require("../../services/redis.js");
exports.eventResolver = {
    Query: {
        events: async (_, { query, category, page, limit, price }, { user }) => {
            const today = new Date(); // ✅ Get today's date
            today.setHours(0, 0, 0, 0);
            if (price != 0) {
                if (category) {
                    return await db_1.db.event.findMany({
                        skip: (page - 1) * limit,
                        take: limit,
                        where: {
                            price: { lte: price },
                            category: category,
                            date: { gte: today }
                        }
                    });
                }
                return await db_1.db.event.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where: {
                        price: { lte: price },
                        date: { gte: today }
                    }
                });
            }
            if (category) {
                console.log(category);
                const categoryData = await db_1.db.event.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where: {
                        category: category,
                        date: { gte: today }
                    },
                    orderBy: {
                        date: 'asc'
                    }
                });
                return categoryData;
            }
            if (query && query != "") {
                const queryData = await db_1.db.event.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: query,
                                    mode: "insensitive"
                                }
                            }, {
                                description: {
                                    contains: query,
                                    mode: "insensitive"
                                }
                            }
                        ],
                        date: { gte: today }
                    }
                });
                return queryData;
            }
            const data = await db_1.db.event.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    date: { gte: today }
                },
                orderBy: {
                    date: 'asc'
                }
            });
            return data;
        },
        event: async (_, { id, limit }, { user }) => {
            const cachedEvent = await redis_js_1.redisClient.get(`event:${id}`);
            if (cachedEvent) {
                console.log("Sending from cach");
                return JSON.parse(cachedEvent);
            }
            console.log("⚠️ Cache Miss → Fetching from DB...");
            const fetchedEvent = await db_1.db.event.findUnique({
                where: {
                    id: id
                }
            });
            console.log(fetchedEvent);
            if (!fetchedEvent) {
                throw new Error('Event not found');
            }
            await redis_js_1.redisClient.set(`event:${id}`, JSON.stringify(fetchedEvent), {
                EX: 180
            });
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
        getReview: async (_, { eventId, page, limit }) => {
            // if (!eventId) throw new Error("Event id not provided!")
            //     console.log(page,limit)
            return await db_1.db.review.findMany({
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                where: {
                    eventId
                },
                orderBy: {
                    createdAt: 'desc'
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
                await db_1.db.event.delete({
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
