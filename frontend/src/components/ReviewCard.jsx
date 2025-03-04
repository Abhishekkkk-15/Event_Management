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
    <Card className="w-full mt-1 p-6 bg-white shadow-lg rounded-2xl transition-transform transform hover:scale-105 duration-300">
      <CardContent className="flex flex-col gap-4" style={{ padding: "10px" }}>
        {/* User Info */}
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-gray-200 shadow-sm ">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-gray-300 text-gray-600 font-semibold">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{formattedDate(createdAt)}</p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-yellow-500">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < rating ? "fill-current" : "stroke-current text-gray-300"}`}
            />
          ))}
        </div>

        {/* Comment */}
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          {comment.length > 150 ? comment.substring(0, 150) + "..." : comment}
        </p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
