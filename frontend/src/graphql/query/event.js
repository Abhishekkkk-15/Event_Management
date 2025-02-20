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



export {GET_EVENTS}