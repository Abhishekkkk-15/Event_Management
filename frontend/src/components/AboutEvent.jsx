import React, { useState, useEffect } from "react";

const EventDetail = ({ description, bookings }) => {
  const [avatars, setAvatars] = useState(null);

  useEffect(() => {
   setTimeout(() => {
  
      setAvatars(bookings);
      console.log(avatars)

   }, 3000);
   
  }, []);

  // if(usersAvatar) console.log(usersAvatar[0]?.user?.avatar)

  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="flex flex-col items-center h-full 4 gap-2">
      {/* Description Section */}
      <div
        className=" rounded-3xl w-[95%] flex flex-col"
        style={{ padding: "15px" }}
      >
        <h4 className="text-lg font-semibold">About Event</h4>

        {/* Description */}
        <div className="text-gray-700 mt-3">
          {isExpanded ? description : `${description?.slice(0, 100)}...`}{" "}
          <span
            className="text-blue-500 mt-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Read Less" : "Read More"}
          </span>
          {/* Display only the first 100 characters initially */}
        </div>

        {/* Read More Button */}
      </div>

      {/* User Avatars Section */}
      <div className="flex items-center ">
        <div className="relative right-98">
          {avatars > 0 && (
            <div className="flex flex-row">
              <div className="" style={{ border: "4px solid white" }}>
                <img
                  src={avatars[0]?.user?.avatar}
                  alt={`User ${avatars[0]?.user?.__typename}`}
                  className="w-10 h-10 rounded-full object-cover border-[20px] border-black"
                />
              </div>
              <div className="relative right-4" style={{ border: "4px solid white", borderRadius:"100%"}}>
                <img
                  src={avatars[1]?.user?.avatar}
                  alt={`User ${avatars[0]?.user?.__typename}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <div className="relative right-8" style={{ border: "4px solid white", borderRadius:"100%"}}>
                <img
                  src={avatars[3]?.user?.avatar}
                  alt={`User ${avatars[0]?.user?.__typename}`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
              </div>
              <div className="relative right-12 " style={{ border: "4px solid white", borderRadius:"100%"}}>
                <img
                  src={avatars[4]?.user?.avatar}
                  alt={`User ${avatars[0]?.user?.__typename}`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
              </div>
            </div>
          )}
          {/* If it's the last avatar, show the total number of users */}
          {/* {index === 4 && event?.bookings?.user?.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs rounded-full">
                +{event?.bookings?.user?.length - 5}
              </div>
            )} */}
        </div>

        {/* Show the total number of users who booked the event */}
        {/* {event?.bookings?.user?.length > 1 && (
          <span className="text-gray-700 ml-2">
            +{event?.bookings?.user?.length} Users
          </span>
        )} */}
      </div>
    </div>
  );
};

export default EventDetail;
