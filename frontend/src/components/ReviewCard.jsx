import React from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const ReviewCard = ({ user, createdAt, comment, rating }) => {
  const formattedDate = (timestamp) => {
    return timestamp
      ? new Date(Number(timestamp)).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Invalid Date";
  };

  return (
    <Card className="w-full mt-1 p-6 h-[100%] bg-[#404040] shadow-lg rounded-2xl transition-transform transform hover:scale-105 duration-300 ">
      <CardContent className="flex flex-col gap-4 h-full" style={{ padding: "10px" }}>
        {/* User Info */}
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2  shadow-sm ">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-[#404040] text-gray-600 font-semibold">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-[#FEFEFE]">{user?.name}</p>
            <p className="text-sm text-[#FEFEFE]">{formattedDate(createdAt)}</p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-yellow-500 w-full  h-full">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < rating ? "fill-current" : "stroke-current text-gray-300"}`}
            />
          ))}
        </div>

        {/* Comment */}
        <p className="text-[#FEFEFE] leading-relaxed w-full text-sm md:text-base overflow-clip h-full ">
          {comment.length > 150 ? comment.substring(0, 150) + "..." : comment}
        </p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
