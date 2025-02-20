import React from "react";

function CardSkeleton() {
  return (
    <div className="relative h-[15rem] w-[26rem] max-w-[27rem] min-w-[25rem] rounded-3xl overflow-hidden animate-pulse bg-gray-200">
      {/* Image background (Skeleton) */}
      <div className="w-full h-full bg-gray-300"></div>

      {/* Text content with glass effect at the bottom */}
      <div className="absolute bottom-2 left-4 w-[92%] bg-transparent">
        <div className="backdrop-blur-lg rounded-4xl flex items-center justify-between h-20">
          {/* Text content */}
          <div className="relative left-4">
            <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
            <div className="h-3 w-40 bg-gray-300 rounded-md mt-2"></div>
          </div>

          {/* Arrow icon */}
          <div className="h-14 w-14 bg-gray-300 rounded-full relative right-3"></div>
        </div>
      </div>
    </div>
  );
}

export default CardSkeleton;
