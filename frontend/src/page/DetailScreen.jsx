import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_EVENT_BY_ID, BOOK_TICKET } from "../graphql/mutation/event.js";
import { CiCalendar, CiHeart } from "react-icons/ci";
import { showError, showInfo, showSuccess } from "../utils/toast.js";
import { ticketBooking } from "../REST_API/booking.js";
import { useSelector } from "react-redux";
import ReviewsList from "../components/ReviewsList.jsx";
import Congratulations from "../components/Congratulations.jsx";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";

function DetailScreen() {
  const [event, setEvent] = useState({});
  const user = useSelector((state) => state.auth.user);
  console.log("user from detail : ", user);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_EVENT_BY_ID, {
    variables: { eventId: id, limit: 2 },
  });
  const [avatars, setAvatars] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [bookSlot, { loading: mutationLoading, error: mutationError }] =
    useMutation(BOOK_TICKET);

  useEffect(() => {
    if (loading) return;
    if (data?.event) {
      setEvent(data?.event);
      setAvatars(data.event.bookings);
    }
    // console.log(data?.event?.bookings[0].user.avatar)
  }, [loading]);
  console.log(event);

  const formattedDate = event?.date
    ? new Date(Number(event?.date)).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Invalid Date";

  if (loading) return <p>Loading...</p>;
  if (mutationError) showInfo(mutationError.message);
    if(error) console.log(error)
  const handleBookEvent = async (eventId, userEmail, tickets) => {
    if (!eventId && !userEmail) return;
    if (!user.isVerified) {
      showError("Please verify your email to book tickets");
      return;
    }
    try {
      const { data } = await ticketBooking({ eventId, userEmail, tickets });
      console.log(data);
      setIsModalOpen(false);
      setIsBooked(true);
      setTicketId(data.ticketId);
      showSuccess(data.message);
    } catch (error) {
      console.log(error);
      showError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center h-full px-4 pb-44 gap-2 bg-[#000000]">
      {/* Image Section */}

      <div
        className="h-80 w-[95%] flex justify-center items-center rounded-3xl overflow-hidden relative"
        style={{ marginTop: "20px" }}
      >
        {/* Image Slider */}
        <div
          className="flex transition-all duration-700 ease-in-out gap-x-2 rounded-3xl"
          style={{
            transform: `translateX(-${currentIndex * 102}%)`,
            marginTop: "17px",
          }}
        >
          {event?.eventImages?.map((image, index) => (
            <img
              key={index}
              src={`${image.replace(
                "/upload/",
                "/upload/w_380,h_340,c_fill/"
              )}`}
              alt={`Event Image ${index}`}
              className="w-full object-fit rounded-3xl"
            />
          ))}
        </div>

        {/* Dots for Image Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {event?.eventImages?.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                currentIndex === index
                  ? " bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-gray-500"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Title, Date & Location */}
      <div className="flex items-center justify-between h-24 w-[95%] bg-[#404040] rounded-3xl mt-4">
        <div
          className="w-44 flex flex-col text-wrap"
          style={{ marginLeft: "16px" }}
        >
          <span className="font-bold text-2xl text-[#FEFEFE]">
            {event?.title}
          </span>
          <div className="flex items-center text-[#FEFEFE] ">
            <CiCalendar />
            {formattedDate} . {event?.location?.slice(0, 10)}
          </div>
        </div>
        <div
          className=" h-[90%] w-24 rounded-3xl flex justify-center items-center flex-col text-[#FEFEFE] bg-gray-500"
          style={{ marginRight: "6px" }}
        >
          <span className="text-2xl font-medium text-[#F2Fb62]">
            ₹ {event?.price}
          </span>
          <span className="text-lg font-medium text-[#FEFEFE]">
            {event?.maxSlots} Seats
          </span>
        </div>
      </div>

      {/* Description Section */}
      <div className="min-h-48 max-h-64 bg-[#404040] rounded-3xl w-[95%] flex flex-col ">
        <div className="flex flex-col items-center h-full 4 gap-2">
          {/* Description Section */}
          <div
            className=" rounded-3xl w-[95%] flex flex-col"
            style={{ padding: "10px" }}
          >
            <h4 className="text-lg font-semibold text-[#FEFEFE]">
              About Event
            </h4>

            {/* Description */}
            <div className="text-[#FEFEFE] mt-3">
              {isExpanded
                ? event?.description
                : `${event?.description?.slice(0, 100)}...`}{" "}
              <span
                className="text-[#F2F862] mt-2"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </span>
              {/* Display only the first 100 characters initially */}
            </div>

            {/* Read More Button */}
            <div
              className="relative flex flex-row h-20 w-[16%] items-center  right-3"
              style={{ padding: "5px" }}
            >
              {event?.bookings?.length >= 2 && (
                <Avatar
                  className=" h-12 w-12 bg-[#F2Fb62] flex items-center justify-center border-2 border-white gap-3"
                  style={{ border: "2px solid white" }}
                >
                  <span>{event?.bookings?.length}+</span>
                </Avatar>
              )}

              {event?.bookings?.length >= 2 ? (
                <>
                  <Avatar
                    className="relative h-12 w-12 right-4 border-2 border-white"
                    style={{ border: "2px solid white" }}
                  >
                    <AvatarImage src={event?.bookings[0]?.user?.avatar} />
                  </Avatar>

                  <Avatar
                    className="relative h-12 w-12 right-6 border-2 border-white"
                    style={{ border: "2px solid white" }}
                  >
                    <AvatarImage src={event?.bookings[1]?.user?.avatar} />
                  </Avatar>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buy Ticket Button */}
      <div className="fixed bottom-10 flex w-[95%] items-center gap-4 z-50 ">
        <div
          onClick={() => setIsModalOpen(true)}
          className="flex items-center text-2xl justify-center h-16 w-[80%] bg-gradient-to-r bg-[#F2F862] rounded-3xl text-[#000000] text-center cursor-pointer"
        >
          Buy Ticket
        </div>

        <div className="text-[#FEFEFE] flex items-center justify-center  w-[60px]">
          <CiHeart className="w-full h-14 text-center bg-gray-500 rounded-full " />
        </div>
      </div>
      {/* { isBooked && <Congratulations eventId={ticketId} onClose={()=> setIsBooked(false)}/>} */}

      {/* Modal for Ticket Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg z-50" >
          <div className="bg-[#F2F862] p-6 rounded-lg shadow-lg w-[90%] max-w-md" style={{padding:"10px"}} >
            <h2 className="text-xl font-bold mb-4">Select Tickets</h2>

            {/* Ticket Selector */}
            <div className="mb-4 flex flex-col gap-2">
              <label className="block text-lg font-medium">
                Number of Tickets:
              </label>
              <select
                className="w-full p-2 border rounded-lg mt-2]"
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
              >
                {[...Array(4)].map((_, i) => (
                  <option key={i} value={i + 1} >
                    {i + 1}
                  </option>
                ))}
              </select>

              <div>Total amount : {Math.floor(ticketCount * event.price)}</div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 z-30">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#F2F862] text-white rounded-lg cursor-pointer"
                onClick={() =>
                  handleBookEvent(event.id, user.email, ticketCount)
                }
              >
                {mutationLoading ? "Booking..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isBooked && (
        <Congratulations
          ticketId={ticketId}
          onClose={() => setIsBooked(false)}
        />
      )}
      <div className="w-[95%] h-[500px]  bottom-0 right-0 shadow-lg p-4 overflow-hidden flex flex-col">
        <ReviewsList eventId={event.id} />
      </div>
      {loading && (
        <div className="w-full h-[full flex justify-center items-center backdrop-blur-sm">
          <div className="w-[50px] h-[50px] flex justify-center items-center backdrop-blur-sm">
            <img src={loadingSvg} alt="Loading..." className="h-[10px]" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailScreen;
