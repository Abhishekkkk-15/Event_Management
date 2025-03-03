"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventResolver = void 0;
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
        getReview: async (_, { eventId, page, limit }) => {
            // if (!eventId) throw new Error("Event id not provided!")
            //     console.log(page,limit)
            return await db_1.db.review.findMany({
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
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
        // createEvent: async (_: any, { event, files }: { event: CreateEventInput, files: any }, { user }: any) => {
        //     if (!user) {
        //         throw new Error('Not authenticated');
        //     }
        //     if (!files || !Array.isArray(files) || files.length < 2) {
        //         throw new Error("There should be at least two images");
        //     }
        //     console.log("Files received (before resolving):", files);
        //     try {
        //         const resolvedFiles = await Promise.all(
        //             files.map(async (filePromise: any, index: number) => {
        //                 console.log(`Resolving file ${index + 1} promise...`);
        //                 const file = await filePromise; // Explicitly resolve each file promise
        //                 console.log(`File ${index + 1} resolved:`, file);
        //                 return file;
        //             })
        //         );
        //         console.log("All files resolved:", resolvedFiles);
        //         const job = await eventQueue.add("create-event", {
        //             event,
        //             files: resolvedFiles,
        //             userId: user.id
        //         });
        //         console.log(`Job added to queue: ${job.id}`);
        //         return { message: "Event creation job queued", jobId: job.id };
        //     } catch (error) {
        //         console.error("Error resolving file uploads:", error);
        //         throw new Error("Failed to resolve file uploads");
        //     }
        // }
        // ,
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
