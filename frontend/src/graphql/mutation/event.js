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
      id
      title
      description
      location
      date
      maxSlots
      price
      eventImages
      category
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

export { GET_EVENT_BY_ID, CREATE_EVENT,BOOK_TICKET,DELETE_EVENT };
