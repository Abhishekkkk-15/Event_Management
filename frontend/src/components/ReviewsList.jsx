import React, { useEffect, useState } from "react";
import AddReview from "./AddReview";
import ReviewCard from "./ReviewCard";
import { addReview } from "../REST_API/review";
import { useQuery } from "@apollo/client";
import { GET_ALL_REVIEWS } from "../graphql/query/event";
import { useSelector } from "react-redux";

const ReviewSection = ({eventId}) => {
  const [reviews, setReviews] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const {data,loading,error} = useQuery(GET_ALL_REVIEWS,{
    variables: {eventId}
})
 console.log(data?.getReview)
 console.log(user)
 useEffect(() => {
    if (data?.getReview) {
      setReviews(data?.getReview);
    }
  }, [data]);

  

  const handleAddReview = async (newReview) => {
    // const review = {
    //   user: { name: "You", avatar: "https://randomuser.me/api/portraits/men/10.jpg" }, // Replace with actual user data
    //   date: new Date().toISOString(),
    //   ...newReview,
    // };
    // setReviews([review, ...reviews]);
    const {data} = await addReview({...newReview, eventId})
    console.log(data.review)
    let newData = [{...data.review,user:{avatar: user.avatar, name: user.name},name:user.name}]
    console.log("New data" ,newData)
    setReviews((prev) => [...newData, ...prev]);
    console.log("REview",reviews)
  };

  return (
    <div className="space-y-6 w-[95%]">
      <h2 className="text-2xl font-semibold">Add a Review</h2>
      <AddReview onSubmit={handleAddReview} />
      <h2 className="text-2xl font-semibold">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
