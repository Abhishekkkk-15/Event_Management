import { Home, Search, Ticket, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BottomNav = () => {
  const [active, setActive] = useState("home");
  let navigate = useNavigate();

  return (
    <div
      className="fixed h-14 w-[80%]  bottom-4 left-1/2 transform -translate-x-1/2 bg-[#404040] rounded-full flex   items-center justify-between shadow-lg border border-yellow-300 "
      style={{ padding: "16px" }}
    >
      <button
        className="flex items-center justify-between  text-black bg-[#1C1C1C]  w-24 h-10"
        onClick={() => {
          setActive("home");
          navigate("/");
        }}
        style={{
          backgroundColor: active === "home" ? "#F2F862" : "transparent",
          borderRadius: "30px 30px 30px 30px",
          padding: "8px",
        }}
      >
        <Home
          size={20}
          className={`${active == "home" ? "text-black" : "text-white"}`}
        />{" "}
        {active === "home" && <span>Home</span>}
      </button>

      <button
        className="flex items-center justify-between p-2 bg-gray-800 text-white  w-24 h-10"
        onClick={() => {
          setActive("search");
          navigate("/search");
        }}
        style={{
          backgroundColor: active === "search" ? "#F2F862" : "transparent",
          borderRadius: "30px 30px 30px 30px",
          padding: "8px",
        }}
      >
        <Search
          size={20}
          className={`${active == "search" ? "text-black" : "text-white"}`}
        />
        {active === "search" && <span>Search</span>}
      </button>

      <button
        className="flex items-center justify-between  bg-gray-800 text-white w-24 h-10 "
        onClick={() => {
          setActive("ticket");
          navigate("/");
        }}
        style={{
          backgroundColor: active === "ticket" ? "#F2F862" : "transparent",
          borderRadius: "30px 30px 30px 30px",
          padding: "8px",
        }}
      >
        <Ticket
          size={20}
          className={`${active == "ticket" ? "text-black" : "text-white"}`}
        />
        {active === "ticket" && <span>Tickets</span>}
      </button>
      <button
        className="flex items-center justify-between bg-gray-800 text-white   h-10"
        onClick={() => {
          setActive("profile");
          navigate("/proflleSettings");
        }}
        style={{
          backgroundColor: active === "profile" ? "#F2F862" : "transparent",
          padding: "8px",
          borderRadius: "30px 30px 30px 30px",
        }}
      >
        <User
          size={20}
          className={`${active == "profile" ? "text-black" : "text-white"}`}
        />
        {active === "profile" && <span style={{marginLeft:"10px"}} >Profile</span>}
      </button>
    </div>
  );
};

export default BottomNav;
