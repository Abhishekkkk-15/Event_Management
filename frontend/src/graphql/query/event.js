import { gql } from "@apollo/client";

const GET_EVENTS = gql`
  query ($query: String, $category: String ,$limit: Int, $page: Int,$price: Float) {
    events(query: $query,category:$category, limit: $limit, page: $page, price: $price) {
      id
      title
      location
      price
      eventImages
      date
      bookings{
        user{
          avatar
        }
      }
        bookedSlots
    }
  }
`;

const GET_ALL_REVIEWS = gql`
  query GetReview($eventId: String, $page: Int!, $limit: Int!) {
  getReview(eventId: $eventId, page: $page, limit: $limit) {
    id
    rating
    comment
   user{
    name 
    avatar
   }
   createdAt
  }
}
`;

const GET_EVENT_BY_ID = gql`
  query GetEvent($eventId: String!, $limit: Int) {
    event(id: $eventId, limit: $limit) {
      id
      title
      description
      date
      location
      price
      eventImages
      maxSlots
      bookedSlots
      user {
        name
        avatar
      }
      bookings {
        user {
          avatar
        }
      }
    }
  }
`;



export {GET_EVENTS,GET_ALL_REVIEWS,GET_EVENT_BY_ID}