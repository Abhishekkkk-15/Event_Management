import React, { useEffect, useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { country } from "../country.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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

  const countryName = country.find((c) => c.code === location.country)?.name || "India";
  console.log("User from store", user);

  const handleSearching = () => {};

  return (
    <>
      <div className="h-50 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-[4rem] relative">
        <div className="h-full bg-white/20 backdrop-blur-lg rounded-b-[4rem]">
          {/* Location Text */}
          <div className="relative top-2.5 left-6">
            <p className="text-white flex items-center gap-2 text-lg">
              <FaLocationCrosshairs className="text-white" /> {location.city}
            </p>
            <p className="text-white text-4xl font-semibold">
              {countryName}, {location.country}
            </p>
          </div>

          {/* Avatar Positioned in Right Corner */}
          <div className="absolute top-6 right-6 rounded-full">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none"
            >
              <img
                src={
                  user?.avatar ||
                  "https://res.cloudinary.com/dha7ofrer/image/upload/v1738293176/kgg4vvc27a1uf9ep6eef.jpg"
                } // Replace with actual user avatar
                alt="Avatar"
                className="w-full h-full object-cover  rounded-full"
              />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
    <ul className="py-2 text-gray-700">
      <li className="px-5 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2 transition-all duration-200">
        <Link to="/userProfile" className="w-full flex items-center">
          <span className="text-gray-600">👤</span> User Profile
        </Link>
      </li>
      <li className="px-5 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2 transition-all duration-200">
        <Link to="/bookings" className="w-full flex items-center">
          <span className="text-gray-600">📅</span> User Booking
        </Link>
      </li>
      <li className="px-5 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2 transition-all duration-200">
        <Link to="/dashboard" className="w-full flex items-center">
          <span className="text-gray-600">📊</span> Dashboard
        </Link>
      </li>
      <hr className="border-t border-gray-300 mx-3" />
      <li className="px-5 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2 transition-all duration-200">
        <Link to="/settings" className="w-full flex items-center">
          <span className="text-gray-600">⚙️</span> Settings
        </Link>
      </li>
      <li className="px-5 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2 transition-all duration-200">
        <Link to="/about" className="w-full flex items-center">
          <span className="text-gray-600">ℹ️</span> About Page
        </Link>
      </li>
    </ul>
  </div>
)}

          </div>

          {/* Search Bar - Positioned at Bottom Center */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-16 w-[90%] bg-white rounded-3xl flex items-center px-4 shadow-lg">
            <CiSearch className="text-gray-500 text-2xl mr-3" />
            <input
              type="text"
              className="h-full w-full outline-none bg-transparent text-lg"
              placeholder="Search event"
              onChange={handleSearching}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
