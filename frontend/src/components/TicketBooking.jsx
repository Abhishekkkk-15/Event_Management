import React, { useState } from "react";

const TicketBooking = ({ price, maxSlots, onBook }) => {
  const [ticketCount, setTicketCount] = useState(1);

  const increaseCount = () => {
    if (ticketCount < maxSlots) setTicketCount(ticketCount + 1);
  };

  const decreaseCount = () => {
    if (ticketCount > 1) setTicketCount(ticketCount - 1);
  };

  return (
    <div className="fixed bottom-10 flex flex-col w-[95%] bg-white p-4 rounded-3xl shadow-lg">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">Select Tickets</span>
        <span className="text-xl font-medium">₹ {price} per ticket</span>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={decreaseCount}
            className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-2xl"
          >
            -
          </button>
          <span className="text-xl font-semibold">{ticketCount}</span>
          <button
            onClick={increaseCount}
            className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-2xl"
          >
            +
          </button>
        </div>

        <span className="text-lg font-semibold">
          Total: ₹ {ticketCount * price}
        </span>
      </div>

      <button
        onClick={() => onBook(ticketCount)}
        className="mt-4 w-full h-14 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl text-white text-xl font-semibold"
      >
        Book Now
      </button>
    </div>
  );
};

export default TicketBooking;
