import { gql } from "@apollo/client";

const GET_AUTH_USER = gql`
  query {
    getAuthuser {
      id
      name
      email
      avatar
      isVerified
     wishList{
      event{
        id
      }
     }
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
          title
          location
          price
          eventImages
          date
          startAt
          category
          bookedSlots
          maxSlots
          bookings {
            user {
              avatar
            }
          }
      }
      bookings {
        id
        userId
        tickets
        event {
          id
          title
          location
          price
          eventImages
          date
          startAt
          category
          bookings {
            user {
              avatar
            }
          }
        }
      }
      wishList{
        id
        user{
          name
        }
        event{
          id 
          title
        }
      }
    }
  }
`;

export { GET_AUTH_USER, GET_LOGGED_USER_INFO };
