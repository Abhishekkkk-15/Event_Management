"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventTypeDefs = void 0;
exports.eventTypeDefs = `#graphql
scalar Upload
    type Event {
        id: String!
        title: String!
        description: String!
        location: String!
        date: String!
        maxSlots: Int!
        price: Float!
        user: User
        bookings:[Booking]
        bookedSlots: Int
        startAt: String
        endAt: String
        eventImages:[String]
        category: String
    },
    type Review{
        id: String!
        comment: String!
        rating: Int
        user: User
        event: Event
        createdAt: String
    }
    type Query {
        events(query:String,category:String,limit:Int,page:Int,price:Float): [Event!]!
        event(id: String,limit:Int): Event
        bookedSlots(id:String!):Booking
        eventAnalystics(id:String!):eventAnalysticsData
        getReview(eventId: String, page: Int, limit: Int): [Review]
    },

  

    type eventAnalysticsData{
        totalBookings: Float
        totalAttendees: Float
        totalEarnings: Float
        attendanceRate: Float
    }

    type Booking{
        createdAt: String!
        event:Event
        user:User
    },

 

    type Mutation {
        # createEvent(event: CreateEventInput!,files:[Upload!]!): Message
        updateEvent(event: UpdateEventInput!): Event
        deleteEvent(eventID: String!): Message
        bookSlot(eventId:String!,noOfTicket:Int):Booking
    },

    type Message{
        message:String
    }

    input CreateEventInput {
        title: String!
        description: String!
        location: String!
        date: String
        userId: String
        maxSlots: Int!
        price: Float!
        category:String!
        startAt:String !
        endAt:String!
        userEmail:String!
        # images: [Upload!]!
    },
    input UpdateEventInput {
        id: String!
        title: String
        description: String
        location: String
        date: String
    }

`;
