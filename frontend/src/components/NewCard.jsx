import React from "react";
import { GoArrowUpRight, GoHeart, GoLocation } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";

function Card({ data }) {
  const navigate = useNavigate();
  const formattedDate = data?.date
    ? new Date(Number(data.date)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Invalid Date";

  const handleNavigate = (id) => {
    navigate(`/detailsScreen/${id}`);
  };
  const [month, day] = formattedDate.split(" ");

  return (
    <div className="relative bg-[#181818] h-[22rem] w-[26rem] max-w-[27rem] min-w-[25rem] rounded-3xl overflow-hidden flex flex-col items-center  p-3">
      {/* Image background */}
      <div className="relative h-[75%] w-[94%] flex items-center justify-center rounded-3xl overflow-hidden" style={{marginBottom:"10px"}}>
        <img
          src={`${data?.eventImages[0].replace(
            "/upload/",
            "/upload/w_400,h_190,c_fill/"
          )}`}
          alt="Event"
          className="w-full h-full object-cover rounded-3xl"
        />

        {/* Date badge */}
        <div className="absolute top-7 left-3 bg-white/20 rounded-full h-12 w-12 flex justify-center items-center text-[#FEFEFE] flex-col font-bold text-sm">
          <span>{month}</span>
          <span>{day}</span>
        </div>

        {/* Favorite icon */}
        <div className="absolute top-7 right-3 bg-white/20 rounded-full h-12 w-12 flex justify-center items-center cursor-pointer">
          <GoHeart size={22} className="text-white" />
        </div>
      </div>

      {/* Content section */}
      <div
        className="flex "
        style={{ paddingLeft: "16px", paddingRight: "16px" }}
      >
        <div className="flex items-center justify-between ">
          <div
            className="flex flex-col items-center"
            style={{ marginRight: "200px" }}
          >
            <span className="text-[#FEFEFE] font-bold text-[20px] ml-1 ">
              {data.title}
            </span>
            <div className="flex justify-center items-center">
              <GoLocation size={16} className="text-[#FEFEFE]" />
              <span className="text-[#FEFEFE]">{data.location}</span>
            </div>
          </div>
          <div>
            <span className="text-[#FEFEFE] font-bold text-[28px]">
              ₹{data.price}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-evenly w-full px-4">
        <div
          className="relative flex flex-row h-20 w-[16%] items-center  right-3"
          style={{ padding: "5px" }}
        >
          {data?.bookings?.length >= 2 && (
            <Avatar
              className=" h-12 w-12 bg-[#F2Fb62] flex items-center justify-center border-2 border-white gap-3"
              style={{ border: "2px solid white" }}
            >
              <span>{data?.bookings?.length}+</span>
            </Avatar>
          )}

          {data?.bookings?.length >= 2 ? (
            <>
              <Avatar
                className="relative h-12 w-12 right-4 border-2 border-white"
                style={{ border: "2px solid white" }}
              >
                <AvatarImage src={data?.bookings[0]?.user?.avatar} />
              </Avatar>

              <Avatar
                className="relative h-12 w-12 right-6 border-2 border-white"
                style={{ border: "2px solid white" }}
              >
                <AvatarImage src={data?.bookings[1]?.user?.avatar} />
              </Avatar>
            </>
          ) : (
            ""
          )}
        </div>
        <div
          className=" bg-[#F2F862] h-12 w-[60%] rounded-3xl flex items-center justify-center"
          style={{ marginLeft: "50px" }}
          onClick={() => handleNavigate(data?.id)}
        >
          <button className="bg-[#F2F862] ">Buy Ticket</button>
        </div>
      </div>
    </div>
  );
}

export default Card;
