import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";

function Card({ data }) {
  const navigate = useNavigate();
  const formattedDate = data?.date 
  ? new Date(Number(data.date)).toLocaleDateString("en-US", { 
      year: "numeric", month: "short", day: "numeric" 
    }) 
  : "Invalid Date";
    
  const handleNavigate = (id) => {
    navigate(`/detailsScreen/${id}`)
  }


  return (
    <div className="relative h-[15rem] w-[26rem] max-w-[27rem] min-w-[25rem] rounded-3xl overflow-hidden sm:h-[12rem] sm:w-[20rem] md:h-[14rem] md:w-[22rem] lg:h-[16rem] lg:w-[26rem]">
  {/* Image background */}
  <img
    src={`${data?.eventImages[0].replace('/upload/', '/upload/w_400,h_300,c_fill/')}`}
    alt="Card"
    className="w-full h-full object-cover"
  />
  
  {/* Text content with glass effect at the bottom */}
  <div className="absolute bottom-2 left-4 w-[92%] bg-transparent">
    <div className="backdrop-blur-lg rounded-4xl flex items-center justify-between h-20 sm:h-16 md:h-18 lg:h-20">
      {/* Text content */}
      <div className="relative left-4 sm:left-3 md:left-4 lg:left-4">
        <h2 className="text-yellow-100 text-[14px] sm:text-[12px] md:text-[14px] lg:text-[16px]">{formattedDate}</h2>
        <p className="text-white font-bold text-[16px] sm:text-[14px] md:text-[18px] lg:text-[24px]">{data?.title}</p>
      </div>
  
      {/* Arrow icon */}
      <div
        onClick={() => handleNavigate(data?.id)}
        className="h-14 w-14 bg-white/20 backdrop-blur-md flex justify-center items-center rounded-full relative right-3 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16"
      >
        <GoArrowUpRight className="text-white" />
      </div>
    </div>
  </div>
</div>

  );
}

export default Card;
