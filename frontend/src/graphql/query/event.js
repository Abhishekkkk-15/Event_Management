import { gql } from "@apollo/client";

const GET_EVENTS = gql`
  query ($query: String, $category: String ,$limit: Int, $page: Int) {
    events(query: $query,category:$category, limit: $limit, page: $page) {
      id
      title
      location
      price
      eventImages
      date
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



export {GET_EVENTS,GET_ALL_REVIEWS}