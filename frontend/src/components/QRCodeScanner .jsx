import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import {QrReader} from "react-qr-reader";

const QRCodeScanner = ({ isQrOpen, setIsQrOpen }) => {
  const [scanResult, setScanResult] = useState(null);

  return (
     <div className="h-[44rem] w-[100%] flex items-center justify-center bg-white/20">
           <div className="w-[20%] h-[20%] rounded-3xl" > 
             <QrReader
               delay={3000}
               onResult={(result, error) => {
                 if (result) {
                   setScanResult(result.text);
                   console.log(result.text);
                 }
                 if (error) {
                   console.error("QR Scanner Error:", error);
                 }
               }}
              
             />
           </div>
         </div>
  );
};

export default QRCodeScanner;
