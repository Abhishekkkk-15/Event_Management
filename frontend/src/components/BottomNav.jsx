import { Home, Search, Ticket, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdEventNote } from "react-icons/md";

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
          setActive("/Events");
          navigate("/Events");
        }}
        style={{
          backgroundColor: active === "/Events" ? "#F2F862" : "transparent",
          borderRadius: "30px 30px 30px 30px",
          padding: "8px",
        }}
      >
        <MdEventNote 
          size={20}
          className={`${active == "/Events" ? "text-black" : "text-white"}`}
        />
        {active === "/Events" && <span>Manage</span>}
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
