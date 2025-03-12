import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { RxCross1 } from "react-icons/rx";
import { QRCodeCanvas } from "qrcode.react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { GoArrowUpRight, GoHeart, GoLocation } from "react-icons/go";
import { IoQrCodeOutline } from "react-icons/io5";

const TicketDialog = ({ open, setIsOpen, data, isExpired }) => {
  const timestamp = Number(data?.event?.date);
  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Invalid Date";
console.log("Data",data)
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div
          className={`relative top-0 right-0 ${
            isExpired ? "bg-white/20" : "bg-black/20"
          } bg-black/20 rounded-full h-[50px] w-[50px] flex justify-center items-center ${
            isExpired ? "text-[#F1F1F1]" : "text-[#000000]"
          } flex-col font-bold text-sm cursor-pointer`}
          // onClick={() => setIsOpen(!isOpen)}
        >
          <IoQrCodeOutline  size={20} />
        </div>
      </DialogTrigger>
      <DialogContent
        className="max-w-md w-full p-5"
        style={{ padding: "10px" }}
      >
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-lg font-bold">Ticket</DialogTitle>
        </DialogHeader>

        <Card className="bg-white shadow-lg rounded-lg border border-gray-300">
          <CardContent className="p-4 flex flex-col gap-3">
            {/* Movie Info */}
            <div className="flex items-center justify-between gap-3 my-2">
              <div className="rounded-lg w-[40%] h-[20%] flex justify-center items-center">
                <img
                  src={`${data?.event?.eventImages[0].replace(
                    "/upload/",
                    "/upload/w_70,h_130/"
                  )}`}
                  alt="Movie Poster"
                  className="rounded-lg w-[80%] h-18 object-cover"
                />
              </div>
              <div className="w-[74%]">
                <span className="font-bold text-[#000000] text-[22px]">
                  {data?.event?.title}
                </span>
                <p className="text-sm text-gray-600">{data.event?.loaction}</p>
                <p className="text-sm text-gray-600">
                  {formattedDate} | {data.event?.startAt}
                </p>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="bg-gray-200 p-2 rounded-md flex items-center justify-center">
              <p className="text-sm font-medium text-gray-800">
                Tickets: <span className="font-bold">{data.tickets}</span>
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center my-4">
              <QRCodeCanvas value={data.id} />
            </div>

            {/* Footer */}
            <p className="text-xs text-center text-gray-500 border-t pt-2">
              This ticket must be scanned at the entry point. No refunds
              allowed.
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDialog;
