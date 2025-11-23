export const userTypeDefs = `#graphql
scalar Upload

    type User {
        id: String!
        email: String!
        name: String!
        events: [Event]
        avatar:String
        bookings: [Booking]  
        isVerified: Boolean
        wishList: [WishList]
    }
type AuthUser{
         id: String!
        email: String!
        name: String!
        avatar:String
        isVerified: Boolean
        wishList: [WishList]
}
    input UpdateUserInput {
  name: String!
  email: String!  
}

type WishList{
  id: ID
  eventId: ID
  event:Event
        user:User
        userId: ID
}

type Booking{
        id:ID
        createdAt: String!
        event:Event
        user:User
        userId: ID
        tickets: ID
        isUsed: Boolean
    },

    type Query{
        users: [User!]
        user: User
        getAuthuser:AuthUser
    }

    type Mutation { 
        signUp(user: SignUpInput!): User
        login(input:LoginInput!): User
        updateUser(userInput: UpdateUserInput!): User!
        logout: String!
        addToWishList(eventId: String!): Message
        removeFromWishList(Id: String!): Message
    }
    type Message{
        message:String
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
`