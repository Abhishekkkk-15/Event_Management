"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTypeDefs = void 0;
exports.userTypeDefs = `#graphql
scalar Upload

    type User {
        id: String!
        email: String!
        name: String!
        events: [Event]
        avatar:String
        bookings: [Booking]  
        isVerified: Boolean
    }

    input UpdateUserInput {
  name: String!
  email: String!
}

type Booking{
        id:ID
        createdAt: String!
        event:Event
        user:User
        userId: ID
    },

    type Query{
        users: [User!]
        user: User
        getAuthuser:User
    }

    type Mutation { 
        signUp(user: SignUpInput!): User
        login(input:LoginInput!): User
        updateUser(userInput: UpdateUserInput!): User!
        logout: String!
    }

    input SignUpInput {
    email: String
    password: String
    name: String
    }

  input LoginInput {
    email: String!
    password: String!
  }

  type LogoutResponse {
    message: String!
  }
`;
