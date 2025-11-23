import fileHandling from '../../lib/fileHandling.js';
import uploadOnCloudinary from '../../lib/cloudinaryConfig.js';
import { db } from '../../lib/db';
import fs from 'fs';
import { authUser, Booking, CreateEventInput, EventType } from '@/lib/type.js';
import { redisClient } from '../../services/redis.js';
import { eventQueue } from '../../bullMQ/queue.js';

export const eventResolver = {

    Query: {
        events: async (_: any, { query, category, page, limit, price }: any, { user }: any) => {
            const today = new Date(); // ✅ Get today's date
            today.setHours(0, 0, 0, 0);
            
            if (price != 0) {
                if (category) {

                    return await db.event.findMany({
                        skip: (page - 1) * limit,
                        take: limit,
                        where: {
                            price: { lte: price },
                            category: category,
                            date: {gte : today}
                        }
                    })
                }
                
                return await db.event.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where: {
                        price: { lte: price }, 
                        date: {gte : today}
                    }
                })
            }

            if (category) {
                console.log(category)
                const categoryData = await db.event.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    where: {
                        category: category,
                        date: {gte : today}

                    },
                    orderBy: {
                        date: 'asc'
                    }
                });

                return categoryData
            }

            if (query && query != "") {
                const queryData = await db.event.findMany({
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
                        date: {gte: today}
                    }
                })

                return queryData
            }


           
            const data = await db.event.findMany({
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
        event: async (_: any, { id, limit }: any, { user }: any) => {


            const cachedEvent = await redisClient.get(`event:${id}`)
            if (cachedEvent) {
                console.log("Sending from cach")
                return JSON.parse(cachedEvent)
            }
            console.log("⚠️ Cache Miss → Fetching from DB...");
            const fetchedEvent = await db.event.findUnique({
                where: {
                    id: id
                }
            });
            console.log(fetchedEvent)
            if (!fetchedEvent) {
                throw new Error('Event not found');
            }

            await redisClient.set(`event:${id}`, JSON.stringify(fetchedEvent), {
                EX: 180
            })

            return { ...fetchedEvent, limit: limit }
        },
        bookedSlots: async (_: any, { id }: any, { user }: any) => {
            if (!user) {
                throw new Error('Not authenticated');
            }
            const events = await db.event.findFirst({
                where: {
                    userId: id
                }
            })
            if (!events) throw new Error("No Events create by user")
            return { events, id };
        },
        eventAnalystics: async (_: any, { eventId }: { eventId: string }, { user }: any) => {
            if (!user) {
                throw new Error("Aunthecated!!")
            }
            const totalBookings = await db.booking.count({
                where: {
                    eventId: eventId
                }
            })
            const totalAttendees = await db.booking.count({
                where: {
                    eventId: eventId,
                    isUsed: true
                }
            })
            const totalEarnings = await db.booking.aggregate({
                where: {
                    eventId: eventId,
                },
                _sum: {
                    pricePaid: true
                }
            })
            const attendanceRate = totalBookings > 0 ? (totalAttendees / totalBookings) * 100 : 0
            return {
                totalBookings,
                totalAttendees,
                totalEarnings,
                attendanceRate
            }
        },
        getReview: async (_: any, { eventId, page, limit }: { eventId: string, page: Number, limit: Number }) => {
            // if (!eventId) throw new Error("Event id not provided!")
            //     console.log(page,limit)
            return await db.review.findMany({
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                where: {
                    eventId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }

    },

    Event: {
        user: async (event: EventType) => {

            return await db.user.findUnique({
                where: {
                    id: event.userId
                }
            })
        },
        bookings: async (parent: EventType) => {
            const bookings = await db.booking.findMany({
                where: {
                    eventId: parent.id
                }
            })
            return bookings
        }
    },
    Booking: {
        user: async (parent: Booking) => {

            const fetchedUser = await db.user.findUnique({

                where: {
                    id: parent.userId
                }

            })
            return fetchedUser
        },
        event: async (parent: Booking) => {
            const fetchedEvent = await db.event.findUnique({
                where: {
                    id: parent.eventId
                }
            })
            return fetchedEvent
        }
    },
    Review: {
        user: async (parent: Booking) => {

            const fetchedUser = await db.user.findUnique({

                where: {
                    id: parent.userId
                }

            })
            return fetchedUser
        },
        event: async (parent: Booking) => {
            const fetchedEvent = await db.event.findUnique({
                where: {
                    id: parent.eventId
                }
            })
            return fetchedEvent
        }
    },
    Mutation: {
        deleteEvent: async (_: any, { eventID }: { eventID: string }, { user }: any) => {
            try {

                if (!user) {
                    throw new Error('Not authenticated');
                }

                const isUserValid = await db.event.findUnique({
                    where: {
                        id: eventID
                    }
                })

                if (isUserValid?.userId != user.payload.id) {
                    return { success: false, message: 'authenticated' }
                }

                await db.event.delete({
                    where: {
                        id: eventID
                    }
                });



                await redisClient.del(`user:${user.payload.id}`)

                return { success: false, message: 'Deleted Successfully' }
            } catch (error) {
                console.log(error)
                throw new Error('Error deleting event')
            }
        },
        bookSlot: async (_: any, { eventId, noOfTicket }: { eventId: string, noOfTicket: number }, { user }: any) => {
            console.log("Its woring : ", eventId, noOfTicket, user.payload.id)
            const userId = user.payload.id
            if (!user && !eventId) {
                throw new Error("Both userId and eventId are required")
            }
            const isAlreadyBooked = await db.booking.findFirst({
                where: {
                    userId: userId,
                    eventId: eventId
                }
            })
            if (isAlreadyBooked) {
                console.log("Already booked")
                throw new Error("Already booked you slot")
            }
            console.log("trying book")
            try {
                const booking = await db.booking.create({
                    data: {
                        userId: userId,
                        eventId: eventId,
                        tickets: Number(noOfTicket)
                    }
                }
                );


                await db.event.update({
                    where: {
                        id: eventId
                    },
                    data: {
                        bookedSlots: Number(noOfTicket)
                    }
                });
                return booking

            } catch (error) {
                console.log(error)
                throw Error("Error while booking Slot")
            }


        }
    }

}

