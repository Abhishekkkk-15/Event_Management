import React, { useState } from "react";
import { GoArrowUpRight, GoHeart, GoLocation } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";
import { CiLocationOn, CiTimer } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useMutation } from "@apollo/client";
import { REMOVE_FROM_WISH_LIST } from "../graphql/mutation/event";
import { showError, showSuccess } from "../utils/toast";


function WishListCard({ data,onDelete ,idx}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const timestamp = Number(data?.event.date); // Ensure it's a number
const [remove_from_wish_list,{loading,error}] = useMutation(REMOVE_FROM_WISH_LIST,{
    variables:{
        Id: data.id
    }
})
console.log(idx)
  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Invalid Date";

  let isExpired = timestamp < Date.now();

  function toSet() {
    setIsOpen(false);
  }
  if(error) console.log(error)

  return (
    <div
      className={` ${
        isExpired ? "bg-[#181818]" : "bg-[#F2F862]"
      }  h-[10rem] rounded-3xl w-full  flex flex-col p-3 gap-5 ${
        isExpired ? "text-[#F1F1F1]" : "text-[#000000]"
      } `}
      style={{ padding: "20px" }}
    >
      {/* Image background */}

      <div className="h-[80px] w-full flex flex-row items-center gap-1 ">
        <div className="h-[50%] w-full  flex flex-row items-center justify-start rounded-3xl gap-4">
          <img
            src={`${data?.event?.eventImages[0].replace(
              "/upload/",
              "/upload/w_70,h_70/"
            )}`}
            alt="Event"
            className="object-cover rounded-3xl"
          />
          <div className="flex flex-col justify-start w-[60%]">
            <Link to={`/detailsScreen/${data?.event?.id}`}
              className={`${
                isExpired ? "text-[#FEFEFEF]" : "text-[#000000]"
              } font-bold text-[20px] `}
            >
              {data?.event?.title}
            </Link>
            <span
              className={`${
                isExpired ? "text-[#F1F1F1]" : "text-[#000000]"
              }  text-[18px] `}
            >
              {data?.event?.category}
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
            onClick={ async() => {
               await remove_from_wish_list().then(() =>{
                 showSuccess("Removed from Wish List")
               onDelete(idx)

                })
               .catch((err) => showError("Error while Removing from wish List",error) )
            }}
          >
            <MdDeleteOutline size={20} />
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
            {data.event?.startAt}
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
            {data.event?.location}
          </span>
        </div>
        <div
          className="relative flex flex-row h-[50%] w-[20%%] items-center justify-center  left-3"
          style={{ padding: "5px" }}
        >
          {data?.event?.bookings?.length >= 2 ? (
            <>
              <Avatar
                className="relative h-8 w-8 left-6 border-2 border-white"
                style={{ border: "2px solid white" }}
              >
                <AvatarImage src={data?.event?.bookings[0]?.user?.avatar} />
              </Avatar>

              <Avatar
                className="relative h-8 w-8 left-3 border-2 border-white"
                style={{ border: "2px solid white" }}
              >
                <AvatarImage src={data?.event?.bookings[1]?.user?.avatar} />
              </Avatar>
            </>
          ) : (
            ""
          )}
          {data?.event?.bookings?.length >= 2 && (
            <Avatar
              className=" h-8 w-8 bg-[#F2Fb62] flex items-center justify-center border-2 border-white gap-3"
              style={{ border: "2px solid white" }}
            >
              <span className="text-[8px]">
                {data?.event?.bookings?.length}+
              </span>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
}

export default WishListCard;
