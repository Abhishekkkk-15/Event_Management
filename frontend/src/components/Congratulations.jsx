import React from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { X } from "lucide-react";

const Congratulations = ({ ticketId, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      className="fixed z-50 top-50  bg-white shadow-lg rounded-lg p-4 w-64 border"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-green-600 font-semibold text-lg">🎉 Success!</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-red-500">
          <X size={20} />
        </button>
      </div>
      <p className="text-sm text-gray-600">Your ticket has been booked successfully!</p>
      <div className="flex justify-center my-3">
        <QRCodeCanvas value={ticketId} size={80} />
      </div>
      <p className="text-xs text-gray-500 text-center">Scan to Verify ticket</p>
    </motion.div>
  );
};

export default Congratulations;
