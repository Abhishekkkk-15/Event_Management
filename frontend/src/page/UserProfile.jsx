import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { GET_LOGGED_USER_INFO } from "../graphql/query/user";
import { QRCodeCanvas } from "qrcode.react";

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const { loading, error, data } = useQuery(GET_LOGGED_USER_INFO, {
    variables: { userId: user?.id },
  });

  if (loading) return <p className="text-center text-lg text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-500">Error fetching tickets</p>;

  const tickets = data?.user?.bookings || [];

  return (
    <div className="flex flex-col items-center w-full p-6 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      {/* User Profile Section */}
      <div className=" rounded-xl p-6 flex flex-col items-center text-center  ">
        {/* Avatar */}
        <img
          src={user?.avatar}
          alt="User Avatar"
          className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md object-cover"
        />
        <h2 className="text-3xl font-semibold mt-3 text-gray-900">{user?.name}</h2>
        <p className="text-gray-600 text-lg">{user?.email}</p>

        {/* Edit Profile Button */}
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 hover:bg-blue-700 shadow-md">
          Edit Profile
        </button>
      </div>

      {/* Tickets Section */}
      <div className="w-[90%] max-w-3xl mt-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Tickets</h3>
        <div className="flex flex-col gap-5">
          {tickets.length > 0 ? (
            tickets.map((ticket) => {
              const isExpired = new Date(Number(ticket.event.date)) < new Date();

              return (
                <div
                  key={ticket.id}
                  className={`relative w-full bg-white shadow-md rounded-lg p-5 flex flex-col border border-gray-300 transition-all ${
                    isExpired ? "opacity-70 blur-[0.5px]" : ""
                  }`}
                >
                  {/* Ticket Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{ticket.event.title}</h4>
                      <p className="text-gray-500 text-sm">{ticket.event.location}</p>
                      <p className="text-gray-600 text-sm">
                        {new Date(Number(ticket.event.date)).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {/* QR Code */}
                    <QRCodeCanvas value={ticket.id} size={70} />
                  </div>

                  {/* Dashed Separator */}
                  <div className="w-full border-dashed border-t-2 border-gray-400 my-4"></div>

                  {/* Ticket Footer */}
                  <p className="text-gray-700 text-sm">
                    Ticket ID: <span className="font-semibold">{ticket.id}</span>
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">No tickets booked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
