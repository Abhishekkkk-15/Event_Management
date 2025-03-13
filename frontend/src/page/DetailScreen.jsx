import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_TO_WISH_LIST, BOOK_TICKET } from "../graphql/mutation/event.js";
import { CiCalendar, CiHeart } from "react-icons/ci";
import { showError, showInfo, showSuccess } from "../utils/toast.js";
import { ticketBooking } from "../REST_API/booking.js";
import { useSelector } from "react-redux";
import ReviewsList from "../components/ReviewsList.jsx";
import Congratulations from "../components/Congratulations.jsx";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";
import { GET_EVENT_BY_ID } from "../graphql/query/event.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { FaHeart } from "react-icons/fa6";

function DetailScreen() {
  const [event, setEvent] = useState({});
  const user = useSelector((state) => state.auth.user);
  const userWishList = user?.wishList?.map((event) => event.event.id) || [];
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
 const [addToWishList, { loading:wishlistLoading, error:wishListError, data:wishListData }] = useMutation(ADD_TO_WISH_LIST);

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

  if (mutationError) showInfo(mutationError.message);
  if (error) console.log(error);
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
const wishListFunction =async () =>{
  if(userWishList.includes(event.id)) return showInfo("Allready in wish list")
 try {
  const res = await addToWishList({
     variables:{
       eventId: event.id
     }
   })
   showSuccess("Added to your wish list")
 } catch (error) {
  console.log(error)
 }
}
  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center  backdrop-blur-sm">
        <img src={loadingSvg} alt="Loading..." />
      </div>
    );
  }
  console.log(event?.bookedSlots);
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
        <div className="absolute bottom-4 left-1/2 md:hidden lg:hidden transform -translate-x-1/2 flex gap-2">
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

      {loading && (
        <div className="w-full h-[full flex justify-center items-center backdrop-blur-sm">
          <div className="w-[50px] h-[50px] flex justify-center items-center backdrop-blur-sm">
            <img src={loadingSvg} alt="Loading..." className="h-[10px]" />
          </div>
        </div>
      )}
      {/* Title, Date & Location */}
      <div className="flex items-center justify-between h-24 w-[95%] bg-[#404040] rounded-3xl mt-4">
        <div
          className="w-[80%] flex flex-col text-wrap"
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
            {event?.bookedSlots || 0}/{event?.maxSlots}
          </span>
        </div>
      </div>

      {/* Description Section */}
      <div className="min-h-48 max-h-96 bg-[#404040] rounded-3xl w-[95%] flex flex-col ">
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
      <div className="fixed bottom-5 flex w-[95%] items-center gap-4 z-50 ">
        <div
          onClick={() => setIsModalOpen(true)}
          className="flex items-center text-2xl justify-center h-16 w-[80%] bg-gradient-to-r bg-[#F2F862] rounded-3xl text-[#000000] text-center cursor-pointer"
        >
          Buy Ticket
        </div>

        <div className="text-[#FEFEFE] flex items-center justify-center  rounded-full bg-gray-500 w-16 h-16"
        onClick={wishListFunction}
        >
          {userWishList.includes(event.id) ? (
            <FaHeart size={40} className="text-white" />
          ) : (
            <CiHeart className="  rounded-full " size={40} />
          )}
        </div>
      </div>
      {/* { isBooked && <Congratulations eventId={ticketId} onClose={()=> setIsBooked(false)}/>} */}

      {/* Modal for Ticket Selection */}
      <div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent
            className="bg-[#F2F862] p-6 rounded-lg shadow-lg w-[90%] max-w-md"
            style={{ padding: "10px", background: "#F2F862" }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Select Tickets
              </DialogTitle>
            </DialogHeader>

            {/* Ticket Selector */}
            <div className="mb-4 flex flex-col gap-2">
              <label className="block text-lg font-medium">
                Number of Tickets:
              </label>
              <Select
                value={String(ticketCount)}
                onValueChange={(value) => setTicketCount(Number(value))}
              >
                <SelectTrigger className="w-full border rounded-lg p-2">
                  <SelectValue placeholder="Select tickets" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(4)].map((_, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-lg font-medium">
                Total amount: {Math.floor(ticketCount * event.price)}
              </div>
            </div>

            {/* Buttons */}
            <DialogFooter className="flex justify-end flex-row gap-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#F2F862] text-black hover:bg-[#e6e652]"
                onClick={() =>
                  handleBookEvent(event.id, user.email, ticketCount)
                }
                disabled={mutationLoading}
              >
                {mutationLoading ? "Booking..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
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
