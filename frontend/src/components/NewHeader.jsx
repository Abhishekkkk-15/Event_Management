import React, { useEffect, useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
import { country } from "../country.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";
import { VscSettings } from "react-icons/vsc";

function Header() {
  const [location, setLocation] = useState({ country: "", city: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Fetch country and city name
        const apiKey = "910fe7e0074db355c9d578e39e60dd19";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        setLocation({
          country: data.sys.country, // Country Code (e.g., "US")
          city: data.name, // City Name (e.g., "Los Angeles")
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const countryName =
    country.find((c) => c.code === location.country)?.name || "India";
  console.log("User from store", user);

  const handleSearching = () => {};

  return (
    <>
      <div
        className="h-32 w-full flex flex-col items-center justify-between gap-4"
        style={{ padding: "14px" }}
      >
        <div className="flex flex-row items-center justify-between w-full ">
          <Avatar className=" h-12 w-12 ">
            <AvatarImage src={user?.avatar} />
          </Avatar>

          <div className="flex items-center flex-col ">
            {/* <FaLocationCrosshairs className="text-white" size={22} /> */}
            <span className="text-[#C1C1C1] text-[12px]">Welcome back</span>
            <span className="text-[#FEFEFE] text-[16px]">{user?.name}</span>
          </div>
          <div className="bg-white/20 h-12 w-12 flex justify-center items-center rounded-full">
            <FaRegHeart className="text-[#F2F862]" size={22} />
          </div>
        </div>

        {/* Search Bar - Positioned at Bottom Center */}
        <div className="flex items-center justify-between w-full">
          <div
            className="  h-10 w-[80%] bg-white/20 rounded-3xl flex items-center justify-between px-4 shadow-lg text-[#FEFEFE]"
            style={{ border: "1px solid #C1C1C1" }}
          >
            <CiSearch className="text-[#FEFEFE] text-2xl  mr-9" style={{marginLeft:"8px"}} />
            <input
              type="text"
              className="bg-white/20 h-full w-full outline-none  placeholder:text-[#FEFEFE]"
              placeholder=" Discover"
              onChange={handleSearching}
            />
          </div>
          <div
            className="bg-white/20 h-12 w-12 flex justify-center items-center rounded-full text-[#FEFEFE]" 
            style={{ border: "1px solid #C1C1C1" }}
          >
            <VscSettings className="text-[#FEFEFE]" size={22} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
