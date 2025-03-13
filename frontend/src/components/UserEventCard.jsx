import React, { useState } from "react";
import { GoArrowUpRight, GoHeart, GoLocation } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";
import { CiLocationOn, CiTimer } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useMutation } from "@apollo/client";
import { DELETE_EVENT } from "../graphql/mutation/event";
import { showError, showSuccess } from "../utils/toast";
import DeleteEventDialog from "./DeleteEventDialog";
function UserEventCard({ data, idx, removeItem }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [onClose,setOnClose] = useState(false)
  const timestamp = Number(data?.date); // Ensure it's a number
  console.log("From card : ", data);
  const [deleteEvemt, { loading, error }] = useMutation(DELETE_EVENT, {
    variables: {
      eventID: data.id,
    },
  });
  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Invalid Date";

  let isExpired = timestamp <= Date.now();

  const handleDeleteEvent = async () => {
    try {
      await deleteEvemt();
      showSuccess("Event Deleted Successfully!!");
      removeItem(idx)
    } catch (error) {
      showError("Error while deleting Event, Try Again");
      console.log(error)
    }
  };  

  return (
    <div
      className={` ${
        isExpired ? "bg-[#181818]" : "bg-[#F2F862]"
      }  h-[16rem] rounded-3xl w-full  flex flex-col p-3 gap-5 ${
        isExpired ? "text-[#F1F1F1]" : "text-[#000000]"
      } `}
      style={{ padding: "20px" }}
    >
      {/* Image background */}

      <div className="h-[80px] w-full flex flex-row items-center gap-1 ">
        <div className="h-[50%] w-full  flex flex-row items-center justify-start rounded-3xl gap-4">
          <img
            src={`${data.eventImages[0].replace(
              "/upload/",
              "/upload/w_70,h_70/"
            )}`}
            alt="Event"
            className="object-cover rounded-3xl"
          />
          <div className="flex flex-col justify-start w-[60%]">
            <span
              className={`${
                isExpired ? "text-[#FEFEFEF]" : "text-[#000000]"
              } font-bold text-[20px] `}
            >
              {data?.title}
            </span>
            <span
              className={`${
                isExpired ? "text-[#F1F1F1]" : "text-[#000000]"
              }  text-[18px] `}
            >
              {data?.category}
            </span>
          </div>
        </div>
        <div className="h-full w-[30%] flex justify-end items-center">
          <div
            className={`relative top-0 right-0 ${
              isExpired ? "bg-white/20" : "bg-black/20"
            } bg-black/20 rounded-full h-[50px] w-[50px] flex justify-center items-center ${
              isExpired ? "text-[#F1F1F1]" : "text-[#000000]"
            } flex-col font-bold text-sm cursor-pointer`}
            onClick={() => setOnClose(!onClose)}
            
          >
            <DeleteEventDialog onClose={setOnClose} open={onClose} onDelete={handleDeleteEvent}  />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full px-4 gap-3">
        <div className="flex items-center justify-evenly h-10 w-[30%]  ">
          <div>
            <CiTimer
              className={`${isExpired ? "text-[#C1C1C1]" : "text-[#000000]"}`}
              size={20}
            />
          </div>
          <span
            className={`text-[16px] ${
              isExpired ? "text-[#C1C1C1]" : "text-[#000000]"
            }`}
          >
            {data.startAt}
          </span>
        </div>
        |
        <div className="flex items-center h-10 w-[40%] gap-2">
          <div>
            <CiLocationOn size={20} />
          </div>
          <span
            className={`text-[16px] ${
              isExpired ? "text-[#C1C1C1]" : "text-[#000000]"
            }`}
          >
            {data.location}
          </span>
        </div>
        <div
          className="relative flex flex-row h-[50%] w-[20%%] items-center justify-center  left-3"
          style={{ padding: "5px" }}
        >
          {data?.bookings?.length >= 2 ? (
            <>
              <Avatar
                className="relative h-8 w-8 left-6 border-2 border-white"
                style={{ border: "2px solid white" }}
              >
                <AvatarImage src={data?.bookings[0]?.user?.avatar} />
              </Avatar>

              <Avatar
                className="relative h-8 w-8 left-3 border-2 border-white"
                style={{ border: "2px solid white" }}
              >
                <AvatarImage src={data?.bookings[1]?.user?.avatar} />
              </Avatar>
            </>
          ) : (
            ""
          )}
          {data?.bookings?.length >= 2 && (
            <Avatar
              className=" h-8 w-8 bg-[#F2Fb62] flex items-center justify-center border-2 border-white gap-3"
              style={{ border: "2px solid white" }}
            >
              <span className={`text-[12px] ${isExpired ? "text-[#C1C1C1]" : "text-[#000000]"} `}>{data?.bookings?.length}+</span>
            </Avatar>
          )}
        </div>
      </div>

      <div
        className={`flex items-center justify-between gap-5 ${
          isExpired ? "text-white" : "text-[#000000]"
        }  `}
      >
        <div
          className={`${
            isExpired ? "bg-white/20" : "bg-black/20"
          } h-[70px] w-[40%] rounded-3xl flex justify-start items-center flex-col`}
          style={{ padding: "10px" }}
        >
          <span className=" font-semibold">Total Tickets</span>
          <span className="text-[24px] ">
            {data.bookedSlots} / {data.maxSlots}
          </span>
        </div>
        <div
          className={`${
            isExpired ? "bg-white/20" : "bg-black/20"
          } h-[70px] w-[40%] rounded-3xl flex justify-start items-center flex-col`}
          style={{ padding: "10px" }}
        >
          <span className=" font-semibold">Earning's</span>
          <span className="text-[24px] ">
            ₹ {data.price * data.bookedSlots}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserEventCard;
