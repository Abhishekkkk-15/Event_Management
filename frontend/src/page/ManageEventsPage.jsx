import React, { useState, useEffect } from "react";
import UserEventCard from "../components/UserEventCard";
import { GET_LOGGED_USER_INFO } from "../graphql/query/user";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { setUserData } from "../store/slice/user.slice";
import { showError } from "../utils/toast";
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";
import { IoIosQrScanner } from "react-icons/io";
import QRCodeScanner from "../components/QRCodeScanner ";
import { QrReader } from "react-qr-reader";

function ManageEventsPage() {
  const userData = useSelector((state) => state.auth.userData);
  console.log("Redux UserData:", userData);

  const [events, setEvents] = useState([]);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const dispatch = useDispatch();
  const [fetchUserData, { data, loading, error }] =
    useLazyQuery(GET_LOGGED_USER_INFO);

  useEffect(() => {
    if (!userData) {
      console.log("Api calling");
      fetchUserData();
      // dispatch(setUserData(data));
    } else {
      setEvents(userData.user.events);
    }
  }, [userData, fetchUserData]);

  useEffect(() => {
    if (userData?.events) {
      setEvents(userData.events);
    } else if (data?.user?.events) {
      setEvents(data.user.events);
      dispatch(setUserData(data));
    }
  }, [userData, data]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center  backdrop-blur-sm">
        <img src={loadingSvg} alt="Loading..." />
      </div>
    );
  }
  if (error) {
    showError("Error", error.message);
  }

  if (isQrOpen) {
    return (
    <QRCodeScanner/>
    );
  }
  return (
    <div
      className="min-h-screen w-full bg-[#000000]"
      style={{ paddingBottom: "90px" }}
    >
      <div className="flex flex-col justify-center items-center text-[#FEFEFE] gap-2">
        <span
          className="font-bold w-full mt-10 text-[#FEFEFE] text-center text-[25px]"
          style={{ marginTop: "25px" }}
        >
          Event's
        </span>
        <div
          className="h-full w-full flex flex-col"
          style={{ padding: "10px" }}
        >
          {events?.map((e, idx) => (
            <UserEventCard data={e} key={idx} />
          ))}
        </div>
        <div
          className="fixed bottom-28 right-12 bg-[#F2F862] h-13 w-13 rounded-3xl flex items-center justify-center"
          onClick={() => setIsQrOpen(true)}
        >
          <IoIosQrScanner className="text-[#000000] " size={28} />
        </div>
      </div>
    </div>
  );
}

export default ManageEventsPage;
