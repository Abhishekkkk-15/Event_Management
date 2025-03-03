import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { ticketScanner } from "../REST_API/booking.js";

function QRScanner() {
  const [ticketStatus, setTicketStatus] = useState("");
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const codeReader = new BrowserMultiFormatReader();

      codeReader.decodeFromVideoDevice(undefined, videoRef.current, async (result, err) => {
        if (result) {
          try {
            const { data } = await ticketScanner({
              ticketId: result.getText(),
              eventId: "1f6f0360-be7e-4c18-bc94-4be95bb2167e",
            });
            console.log(data.message);
            setTicketStatus(data.message);
          } catch (error) {
            console.log(error.response?.data?.message || "Scan failed");
            setTicketStatus(error.response?.data?.message || "Scan failed");
          }
        }
      });

      scannerRef.current = codeReader;
    }, 2000); // 2-second delay before starting scanner

    return () => {
      clearTimeout(timeoutId);
      if (scannerRef.current) {
        scannerRef.current.reset();
      }
    };
  }, []);

  return (
    <div>
      <h3>Scan Ticket</h3>
      <video ref={videoRef} style={{ width: "100%", maxWidth: "400px" }}></video>
      <p>{ticketStatus}</p>
    </div>
  );
}

export default QRScanner;
