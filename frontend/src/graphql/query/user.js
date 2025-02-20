import { gql } from "@apollo/client";

const GET_AUTH_USER = gql`
  query {
    getAuthuser {
      id
      name
      email
      avatar
    }
  }
`;

const GET_LOGGED_USER_INFO = gql`
  query{
    user{

      name
      avatar
      events{
        id
        date
        bookedSlots
        maxSlots
        title
        price
      }
      bookings{
        userId
        id
        event{
          title
          startAt
          date
        }
      }
    }
  }
`;

export {GET_AUTH_USER,GET_LOGGED_USER_INFO}