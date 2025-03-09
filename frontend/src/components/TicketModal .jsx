import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { RxCross1 } from "react-icons/rx";
import { QRCodeCanvas } from 'qrcode.react'

const TicketModel = ({ data, setIsOpen }) => {
  const timestamp = Number(data?.event?.date);
  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Invalid Date";
    

  return (
    <div className="flex justify-center items-center h-[30rem] bg-gray-100 p-4" >
      <Card className="w-80 h-full bg-white shadow-xl rounded-lg border border-gray-300 "  style={{padding:"12px"}}>
        <div className="flex items-center text-center justify-center  ">
          <span className="text-[#000000] w-[90%] font-bold">Ticket</span>

          <div
            className="w-[10%] text-center cursor-pointer "
            onClick={() => setIsOpen(false)}
          >
            <RxCross1 size={20} className="text-[#000000] text-center" />
          </div>
        </div>
        <CardContent className="p-4 flex flex-col gap-3" >
          {/* Movie Info */}
          <div className="flex items-center justify-between gap-3 my-4">
            <div className="rounded-lg w-[40%] h-[20%] flex justify-center items-center ">
              <img
                src={`${data?.event?.eventImages[0].replace(
                  "/upload/",
                  "/upload/w_70,h_130/"
                )}`}
                alt="Movie Poster"
                className="rounded-lg w-[80%] h-18 object-cover"
              />
            </div>
            <div className="w-[74%] " style={{paddingBottom:"60px"}}>
              <span className=" font-bold text-[#000000] text-[22px] " >
                {data?.event?.title}
              </span>
              <p className="text-sm text-gray-600">{data.event?.loaction}</p>
              <p className="text-sm text-gray-600">
                {formattedDate} | {data.event?.startAt}
              </p>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="bg-gray-200 p-2 rounded-md h-[19%] flex items-center justify-center">
            <p className="text-sm font-medium text-gray-800">
              Tickets : <span className="font-bold">{data.tickets}</span>
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center my-4">
            <QRCodeCanvas value={data.id} />
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 border-t pt-2">
            This ticket must be scanned at the entry point. No refunds allowed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketModel;
