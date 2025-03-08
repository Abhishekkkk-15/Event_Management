import React, { useEffect, useState } from "react";
import SmallCard from "../components/SmallCard";
import { useQuery } from "@apollo/client";
import { GET_LOGGED_USER_INFO } from "../graphql/query/user";
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";

function TicketPage() {
  const { data, loading, error } = useQuery(GET_LOGGED_USER_INFO);
  const [userBookings, setUserbookings] = useState([]);

  useEffect(() => {
    if (data?.user?.bookings) {
      setUserbookings([...data.user.bookings]);
    }
  }, [data]); // ✅ `loading` is not needed here

  // ✅ Loading & Error Handling
  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white/30 backdrop-blur-sm">
        <img src={loadingSvg} alt="Loading..." />
      </div>
    );
    
  }

  if (error) {
    console.log("Error:", error.message);
  }

  return (
    <div
      className="min-h-screen w-ful bg-[#000000]0"
      style={{ paddingBottom: "90px" }}
    >
      <div className="flex flex-col  justify-center items-center text-[#FEFEFE] gap-2 ">
        <span
          className="font-bold w-full mt-10 text-[#FEFEFE] text-center text-[25px]"
          style={{ marginTop: "25px" }}
        >
          Booking's
        </span>
        <div className="w-full flex flex-col justify-center items-center gap-2">
          {userBookings.map((data, idx) => {
           return   <SmallCard data={data.event} />
           
           
          })}
        </div>
      </div>
    </div>
  );
}

export default TicketPage;
