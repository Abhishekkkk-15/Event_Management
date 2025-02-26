import React from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";


const ReviewCard = ({ user, date, comment, rating,createdAt }) => {
    const formattedDate = (date) => {
         const finalDate=  date ? new Date(Number(date)).toLocaleDateString("en-US", { 
            year: "numeric", month: "short", day: "numeric" 
          }) 
        : "Invalid Date";
    console.log(finalDate)
    return finalDate
    }
  return (
    <Card className="w-full p-4 bg-white shadow-md rounded-2xl">
      <CardContent className="flex flex-col gap-3">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">{formattedDate(createdAt)}</p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-yellow-500">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} fill={i < rating ? "currentColor" : "none"} stroke="currentColor" />
          ))}
        </div>

        {/* Comment */}
        <p className="text-gray-700">{comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
