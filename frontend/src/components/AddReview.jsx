import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";


const AddReview = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(null);

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <Card className="w-full bg-[#404040] shadow-md rounded-2xl " style={{ padding: "10px", backgroundColor: "#404040" }}>
      <CardContent className="flex flex-col gap-4">
        {/* Star Rating Input */}
        <div className="flex items-center gap-2"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={28}
              className={`cursor-pointer transition ${
                (hoveredStar !== null ? i <= hoveredStar : i < rating) ? "text-yellow-500" : "text-[#FEFEFE]"
              }`}
              fill={(hoveredStar !== null ? i <= hoveredStar : i < rating) ? "currentColor" : "none"}
              stroke="currentColor"
              onMouseEnter={() => setHoveredStar(i)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>

        {/* Comment Input */}
        <Textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className=" text-[#FEFEFE] bg-[#404040] border-none"
          style={{ backgroundColor: "#404040", color: "#FEFEFE" , border: "none"}}
        />

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full">
          Submit Review
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddReview;
