import React from "react";
import { motion } from "framer-motion";

const TicketModal = ({ isOpen, onClose, ticketCount, setTicketCount, event, handleBookEvent, mutationLoading, isBooked, ticketId, setIsBooked, user }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-md relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          ✕
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Select Your Tickets
        </h2>

        {/* Ticket Selector */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">
            Number of Tickets:
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-purple-500"
            value={ticketCount}
            onChange={(e) => setTicketCount(Number(e.target.value))}
          >
            {[...Array(event?.maxSlots || 10)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Total Price */}
        <div className="text-lg font-medium text-gray-700 mb-4">
          Total Amount: <span className="text-purple-600 font-semibold">₹{ticketCount * event.price}</span>
        </div>

        {/* Success Message (if booked) */}
        {isBooked && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Congratulations eventId={ticketId} onClose={() => setIsBooked(false)} />
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg transition hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 bg-purple-600 text-white rounded-lg transition hover:bg-purple-700 flex items-center justify-center"
            onClick={() => handleBookEvent(event.id, user.email, ticketCount)}
            disabled={mutationLoading}
          >
            {mutationLoading ? "Booking..." : "Confirm"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TicketModal;
