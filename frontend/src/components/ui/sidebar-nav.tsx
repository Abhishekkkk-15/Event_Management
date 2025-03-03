import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils"
// Ensure this utility exists in your project
import { FaTachometerAlt, FaCalendarAlt, FaMoneyBillWave, FaQrcode, FaSignOutAlt } from "react-icons/fa";

const sidebarLinks = [
  { name: "Dashboard", to: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "My Events", to: "/events", icon: <FaCalendarAlt /> },
  { name: "Earnings", to: "/earnings", icon: <FaMoneyBillWave /> },
  { name: "QR Scanner", to: "/qr-scanner", icon: <FaQrcode /> },
  { name: "Logout", to: "#", icon: <FaSignOutAlt />, className: "text-red-500" },
];

export function SidebarNav({ active, onNavClick ,items}) {
  console.log(items)
  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-lg p-4">
      <nav>
        <ul className="space-y-2">
          {items.map((link,idx) => (
            <div key={idx}>
            <li key={link.name}>
              <Link
                to={link.to}
                onClick={ link.onClick}
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
            </div>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
