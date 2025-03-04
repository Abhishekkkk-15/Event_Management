import { useState } from "react";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none"
      >
        <img
          src="https://via.placeholder.com/40" // Replace with actual user avatar
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">User Profile</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">User Booking</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Dashboard</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">About Page</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;
