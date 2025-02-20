import React from 'react';
import { FaLocationCrosshairs } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { useEffect ,useState} from 'react';
import {country} from '../country.js'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Header() {
  const [location, setLocation] = useState({ country: "", city: "" });
  const user = useSelector(state => state.auth.user)
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
  const countryName = country.find(c => c.code === location.country)?.name || "India";
  console.log("User for store",user)

  const handleSearching = () =>{
    
  }
  
  return (
    <>
      <div className="h-50 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-[4rem] relative">
        <div className="h-full bg-white/20 backdrop-blur-lg rounded-b-[4rem]">
          {/* Location Text */}
          <div className='relative top-2.5 left-6'>
            <p className="text-white flex items-center gap-2 text-lg">
              <FaLocationCrosshairs className="text-white" /> {location.city}
            </p>
            <p className="text-white text-4xl font-semibold">{countryName} , {location.country}</p>
          </div>

          {/* Avatar Positioned in Right Corner */}
          <Link to={user ? '/loggedUser' : '/login'}> <img
            src={user?.avatar || "https://res.cloudinary.com/dha7ofrer/image/upload/v1738293176/kgg4vvc27a1uf9ep6eef.jpg"} // Replace with actual image
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover absolute top-6 right-6"
          /></Link>

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
