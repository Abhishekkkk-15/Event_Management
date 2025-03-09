import { gql } from "@apollo/client";

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

const CREATE_EVENT = gql`
  mutation createEvent($event: CreateEventInput!, $files: [Upload!]!) {
    createEvent(event: $event, files: $files) {
     message
    }
  }
`;

const BOOK_TICKET = gql`
  mutation bookSlot($eventId: String!, $noOfTicket: Int) {
    bookSlot(eventId: $eventId, noOfTicket: $noOfTicket) {
      event{
        bookedSlots
      }
    }
  }
`;

const DELETE_EVENT = gql`
  mutation deleteEvent($eventID: String!){
    deleteEvent(eventID: $eventID) {
      message
      }
  }
`

const ADD_TO_WISH_LIST = gql`
mutation addToWishList($eventId: String!){
  addToWishList(eventId: $eventId){
    message
  }
}
`

const REMOVE_FROM_WISH_LIST = gql`
mutation addToWishList($Id: String!){
  addToWishList(Id: $Id){
    message
  }
}
`

export { GET_EVENT_BY_ID, CREATE_EVENT,BOOK_TICKET,DELETE_EVENT,ADD_TO_WISH_LIST,REMOVE_FROM_WISH_LIST };
