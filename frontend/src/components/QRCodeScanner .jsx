import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { QrReader } from "react-qr-reader";
import { IoIosQrScanner, IoIosRefresh } from "react-icons/io";
import { ticketScanner } from "../REST_API/booking";
import { showError } from "../utils/toast";

const QRCodeScanner = ({ isQrOpen, setIsQrOpen, events }) => {
  const [scanResult, setScanResult] = useState(null);
  const selectEventRef = useRef("");
  const [selectedEvent, setSelectedEvent] = useState(selectEventRef.current);
  const lastScanned = useRef(null);
  const [seats, setSeats] = useState(0);
  const [success, setSuccess] = useState(true);

  const handleScanQrCode = async (ticketId) => {
    try {
      if (!ticketId) {
        
        return;
      }
      const { data } = await ticketScanner({
        ticketId,
        eventId: selectEventRef.current,
      });
      setScanResult(data.message);
      setSeats(data.tickets);
      setSuccess(data.success);
     
    } catch (error) {
      console.log("Error scanning ticket:", error);
      showError("error : ",error)
    }
  };

  return (
    <Dialog
      open={isQrOpen}
      onOpenChange={(open) => setIsQrOpen && setIsQrOpen(open)}
      className="bg-[#C1C1C1]"
    >
      <DialogTrigger asChild>
        <Button>
          <IoIosQrScanner size={20} className="text-[#000000] cursor-pointer" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center"
        style={{ padding: "20px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            <span className="text-lg font-semibold">Scan Qr Code</span>
          </DialogTitle>
        </DialogHeader>

        <div
          className="flex justify-center bg-white p-4 rounded-3xl items-center  "
          style={{ border: "2px solid #F2F826" }}
        >
          <QrReader
            constraints={{ facingMode: "environment" }}
            scanDelay={3000}
            onResult={async (result, error) => {
              if (result) {
                // Prevent duplicate API calls for the same QR code
                if (lastScanned.current === result.text) {
                  return;
                }
                lastScanned.current = result.text;

                await handleScanQrCode(result.text);

                // Reset after a delay so it can scan a new QR code
                setTimeout(() => {
                  lastScanned.current = null;
                }, 5000); // Adjust the delay as needed
              }
            }}
            className="h-60 w-60 rounded-3xl"
          />
        </div>

        {scanResult && (
          <div
            className={`mt-4 p-3 ${
              success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }  rounded-md text-center flex flex-col`}
          >
            <strong>Scanned Result:</strong> {scanResult}
            {seats != 0 ? <strong>No of Seats : {seats}</strong> : ""}
            {/* <strong>No of Seats :  {seats}</strong>  */}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Event
          </label>
          <select
            className="w-full px-3 py-2 border bg-[#C1C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedEvent}
            onChange={(e) => {
              selectEventRef.current = e.target.value;
              setSelectedEvent(selectEventRef.current);
            }}
          >
            <option value="" disabled>
              Choose an event...
            </option>
            {events.map((event, index) => (
              <option key={index} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between ">
          <Button
            onClick={() => {
              setSuccess(true)
              setScanResult("")
              setSeats(0)
            }}
            variant="secondary"
            className="cursor-pointer"
          >
            Refresh
            <IoIosRefresh />
          </Button>
          <Button
            onClick={() => setIsQrOpen && setIsQrOpen(false)}
            variant="secondary"
            className="cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeScanner;
