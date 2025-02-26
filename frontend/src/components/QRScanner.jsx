import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ticketScanner } from "../REST_API/booking.js";

function QRScanner() {
  const [ticketStatus, setTicketStatus] = useState("");
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      async (decodedText) => {
        try {
          const { data } = await ticketScanner({
            ticketId: decodedText,
            eventId: "1f6f0360-be7e-4c18-bc94-4be95bb2167e",
          });
          console.log(data.message);
          setTicketStatus(data.message);
        } catch (error) {
          console.log(error.response?.data?.message || "Scan failed");
          setTicketStatus(error.response?.data?.message || "Scan failed");
        }
      },
      (errorMessage) => console.log("QR Scan Error:", errorMessage)
    );

    scannerRef.current = scanner;

    return () => {
      scannerRef.current.clear();
    };
  }, []);

  return (
    <div>
      <h3>Scan Ticket</h3>
      <div id="qr-reader"></div>
      <p>{ticketStatus}</p>
    </div>
  );
}

export default QRScanner;
