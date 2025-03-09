import React, { useEffect, useState, useRef } from "react";
import AddReview from "./AddReview";
import ReviewCard from "./ReviewCard";
import { addReview } from "../REST_API/review";
import { useQuery } from "@apollo/client";
import { GET_ALL_REVIEWS } from "../graphql/query/event";
import { useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";


const ReviewSection = ({ eventId }) => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 2; // Number of reviews per page
  const observerRef = useRef(null);
  const reviewContainerRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const { data, loading, error, fetchMore } = useQuery(GET_ALL_REVIEWS, {
    variables: { eventId, page, limit },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data?.getReview) {
      setReviews((prev) => [...prev, ...data.getReview]);
    }
  }, [data]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreReviews();
        }
      },
      { threshold: 1 }
    );
    
    if (observerRef.current && document.getElementById("load-more")) {
      observerRef.current.observe(document.getElementById("load-more"));
    }

    return () => observerRef.current?.disconnect();
  }, []);

  const loadMoreReviews = () => {
    fetchMore({
      variables: { eventId, page: page + 1, limit },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.getReview.length === 0) return prev;
        setPage((prevPage) => prevPage + 1);
        return {
          getReview: [...prev.getReview, ...fetchMoreResult.getReview],
        };
      },
    });
  };

  const handleAddReview = async (newReview) => {
    const { data } = await addReview({ ...newReview, eventId });
    let newData = [
      { ...data.review, user: { avatar: user.avatar, name: user.name }, name: user.name },
    ];
    setReviews((prev) => [...newData, ...prev]);
  };

  return (
    <div className="space-y-6 w-[100%]  h-[500px]  bottom-0 right-0 shadow-lg p-4 overflow-hidden flex flex-col  ">
      {/* <h2 className="text-2xl font-semibold">Add a Review</h2> */}
      
      <AddReview onSubmit={handleAddReview} />

    
      {/* <h2 className="text-2xl font-semibold">Reviews</h2> */}
      
      <div 
        ref={reviewContainerRef} 
        className="overflow-y-auto flex-1"
        style={{ maxHeight: "400px" }}
      > 
        {reviews.map((review, index) => (
          <div className="mt-2  " key={index} style={{marginTop: "10px"}}>

            <ReviewCard  {...review} />
          </div>
        ))}
        <div id="load-more" className="h-10" />
         {loading && (
                  <div className="w-full h-[full flex justify-center items-center backdrop-blur-sm">
                    <div  className="w-[50px] h-[50px] flex justify-center items-center backdrop-blur-sm">
        
                    <img src={loadingSvg} alt="Loading..." className="h-[10px]" />
                    </div>
                  </div>
                )}
      </div>
      
      
    </div>
  );
};

export default ReviewSection;
