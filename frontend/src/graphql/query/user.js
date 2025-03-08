import { gql } from "@apollo/client";

const GET_AUTH_USER = gql`
  query {
    getAuthuser {
      id
      name
      email
      avatar
      isVerified
    }
  }
`;

const GET_LOGGED_USER_INFO = gql`
  query {
    user {
      name
      avatar
      isVerified
      events {
        id
        date
        bookedSlots
        maxSlots
        title
        price
      }
      bookings {
        id
        userId
        event {
          id
          title
          location
          price
          eventImages
          date
          bookings {
            user {
              avatar
            }
          }
        }
      }
    }
  }
`;

export { GET_AUTH_USER, GET_LOGGED_USER_INFO };
