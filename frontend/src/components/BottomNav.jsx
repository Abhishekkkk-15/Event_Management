import { Home, Search, Ticket, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const BottomNav = () => {
  let navigate = useNavigate();
  const location = useLocation()
  const [active, setActive] = useState(location.pathname || "/");
 
  return (
    <div
      className="fixed h-14 w-[80%]  bottom-4 left-1/2 transform -translate-x-1/2 bg-[#404040] rounded-full flex   items-center justify-between shadow-lg border border-yellow-300 "
      style={{ padding: "16px" }}
    >
      <button
        className="flex items-center justify-between  text-black bg-[#1C1C1C]  w-24 h-10"
        onClick={() => {
          setActive("/");
          navigate("/");
        }}
        style={{
          backgroundColor: active === "/" ? "#F2F862" : "transparent",
          borderRadius: "30px 30px 30px 30px",
          padding: "8px",
        }}
      >
        <Home
          size={20}
          className={`${active == "/" ? "text-black" : "text-white"}`}
        />{" "}
        {active === "/" && <span>Home</span>}
      </button>

      <button
        className="flex items-center justify-between p-2 bg-gray-800 text-white  w-24 h-10"
        onClick={() => {
          setActive("/search");
          navigate("/search");
        }}
        style={{
          backgroundColor: active === "/search" ? "#F2F862" : "transparent",
          borderRadius: "30px 30px 30px 30px",
          padding: "8px",
        }}
      >
        <Search
          size={20}
          className={`${active == "/search" ? "text-black" : "text-white"}`}
        />
        {active === "/search" && <span>Search</span>}
      </button>

      <button
        className="flex items-center justify-between  bg-gray-800 text-white w-24 h-10 "
        onClick={() => {
          setActive("/tickets");
          navigate("/tickets");
        }}
        style={{
          backgroundColor: active === "/tickets" ? "#F2F862" : "transparent",
          borderRadius: "30px 30px 30px 30px",
          padding: "8px",
        }}
      >
        <Ticket
          size={20}
          className={`${active == "/tickets" ? "text-black" : "text-white"}`}
        />
        {active === "/tickets" && <span>Tickets</span>}
      </button>
      <button
        className="flex items-center justify-between bg-gray-800 text-white   h-10"
        onClick={() => {
          setActive("/proflleSettings");
          navigate("/proflleSettings");
        }}
        style={{
          backgroundColor: active === "/proflleSettings" ? "#F2F862" : "transparent",
          padding: "8px",
          borderRadius: "30px 30px 30px 30px",
        }}
      >
        <User
          size={20}
          className={`${active == "/proflleSettings" ? "text-black" : "text-white"}`}
        />
        {active === "/proflleSettings" && <span style={{marginLeft:"10px"}} >Profile</span>}
      </button>
    </div>
  );
};

export default BottomNav;
