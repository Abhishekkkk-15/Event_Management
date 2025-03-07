import { useState } from "react";
import { Switch } from "../components/ui/switch";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CiLogout, CiMail, CiUser } from "react-icons/ci";
import { BsCalendar4Event } from "react-icons/bs";
import { FcAbout } from "react-icons/fc";
import { IoTicketOutline } from "react-icons/io5";
import { IoIosContact } from "react-icons/io";
import { Link } from "react-router-dom";

const ProfileSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState(true);
  const [location, setLocation] = useState(false);

  return (
    <div className="min-h-screen w-ful bg-[#000000]">
      <div className="flex flex-col lg:flex-row md:flex-row justify-center items-center text-[#FEFEFE] gap-2 ">
        <span
          className="font-bold w-full mt-10 text-[#FEFEFE] text-center text-[25px]"
          style={{ marginTop: "25px" }}
        >
          Account Settings
        </span>
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <div className="h-10 w-[90%]">
            <p className="float-start font-bold text-[#FEFEFE] text-[20px] ">
              Profile
            </p>
          </div>
          <Link to="/editProfile" className="bg-[#181818] w-[90%] flex flex-row justify-between items-center rounded-2xl h-18" >
          <div
            className="bg-[#181818] w-[90%] flex flex-row justify-between items-center rounded-2xl h-18"
            style={{ padding: "10px" }}
          >
            <div className="text-[#FEFEFE] w-11">
              <CiUser size={28} className="text-[#FEFEFE] w-11" />
            </div>
            <span className="w-80 text-[20px]">Edit Profile</span>
          </div>
          </Link>
            <Link to='/verifyEmail' className="bg-[#181818] w-[90%] flex flex-row justify-between items-center rounded-2xl h-18">
          <div className="bg-[#181818] w-[90%] flex flex-row justify-between items-center rounded-2xl h-18">
            <div
              className="bg-[#181818] w-[90%] flex flex-row justify-between items-center rounded-2xl h-18 "
              style={{ padding: "10px" }}
            >
              <div className="text-[#FEFEFE] w-11">
                <CiMail size={28} className="text-[#FEFEFE] w-11" />
              </div>
              <span className="w-80 text-[20px]">Verify Email</span>
            </div>
          </div>
            </Link>
        </div>

        <div className="w-full flex flex-col justify-center items-center gap-2">
          <div className="h-10 w-[90%]">
            <p className="float-start font-bold text-[#FEFEFE] text-[20px] ">
              Bookings
            </p>
          </div>
          <div
            className="bg-[#181818] w-[90%] flex flex-row justify-between items-center rounded-2xl h-22  "
            style={{ padding: "10px" }}
          >
            <div className=" w-11">
              <BsCalendar4Event size={24} className=" w-11" />
            </div>
            <div>
              <span className="w-80 text-[16px]">Manage your Events</span>
              <p className="text-[14px] text-[#C1C1C1] ">
                Manage your own events and Upload new events
              </p>
            </div>
          </div>
          <div
            className="bg-[#181818] w-[90%] flex flex-row justify-between items-center rounded-2xl h-22 "
            style={{ padding: "10px" }}
          >
            <div className=" w-11">
              <IoTicketOutline size={28} className=" w-11" />
            </div>
            <div className="">
              <span className="w-80  text-[20px]">Mickets</span>
              <p className="text-[14px] text-[#C1C1C1] ">
                Manage your own events and Upload new events
              </p>
            </div>
          </div>
          <div
            className="bg-[#181818] w-[90%] flex flex-row justify-between items-center rounded-2xl h-18"
            style={{ padding: "10px" }}
          >
            <div className="text-[#FEFEFE] w-11">
              <CiLogout size={28} className="text-[#FEFEFE] w-11" />
            </div>
            <span className="w-80 text-[20px]">Logout</span>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center gap-2">
          <div className="h-10 w-[90%]">
            <p className="float-start font-bold text-[#FEFEFE] text-[20px] ">
              
            </p>
          </div>
          <div
            className="bg-[#181818] w-[90%] flex flex-row justify-between items-center rounded-2xl h-18"
            style={{ padding: "10px" }}
          >
            <div className="text-[#FEFEFE] w-11">
              <IoIosContact size={28} className="text-[#FEFEFE] w-11" />
            </div>
            <span className="w-80 text-[20px]">Contact us</span>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <div
              className="bg-[#181818] w-[90%] flex flex-row justify-between items-center rounded-2xl h-18 "
              style={{ padding: "10px" }}
            >
              <div className="text-[#FEFEFE] w-11">
                <FcAbout  size={28} className="text-[#FEFEFE] w-11" />
              </div>
              <span className="w-80 text-[20px]">About us</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
