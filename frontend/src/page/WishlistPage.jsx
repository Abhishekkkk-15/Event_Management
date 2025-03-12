import React, { useEffect, useState } from "react";
import SmallCard from "../components/SmallCard";
import { useLazyQuery } from "@apollo/client";
import { GET_LOGGED_USER_INFO } from "../graphql/query/user";
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";
import { showError } from "../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../store/slice/user.slice";
import WishListCard from "../components/WishListCard";

function WishlistPage() {
  const userData = useSelector((state) => state.auth.userData);

  //   const [userBookings, setUserWishlist] = useState([]);
  const [userWishlist, setUserWishlist] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const dispatch = useDispatch();

  // Lazy query to fetch user data only when needed
  const [fetchUserData, { data, loading, error }] =
    useLazyQuery(GET_LOGGED_USER_INFO);

  useEffect(() => {
    // Fetch from backend only if userData is missing
    if (!userData) {
      console.log("Calling Api");
      fetchUserData();
    } else {
      console.log("Data from Redux : ", userData.user.wishList);

      setUserWishlist(userData?.user?.wishList);
    }
  }, []);

  useEffect(() => {
    if (data?.user?.bookings) {
      dispatch(setUserData(data)); // Update Redux store
      setUserWishlist([...data.user.wishList]); // Update local state
      // console.log([...data.user.bookings])
    }
  }, [data, dispatch]);

  const removeItem = (index) => {
    const newArray = [...userWishlist]; // Create a copy to avoid mutating state
    newArray.splice(index, 1); // Remove 1 item at the given index
    setUserWishlist(newArray); // Update state
  };

  // Function to check if an event is expired
  const isExpired = (date, filter) => {
    if (!date) return false;
    const timestamp = Number(date);
    if (filter === "All") return true;
    if (filter === "Expired") return timestamp < Date.now();
    if (filter === "Not-Expired") return !(timestamp < Date.now());
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white/30 backdrop-blur-sm">
        <img src={loadingSvg} alt="Loading..." />
      </div>
    );
  }

  if (error) {
    console.error("Error:", error.message);
    showError(error.message);
  }

  const categories = [
    { name: "All" },
    { name: "Expired" },
    { name: "Not-Expired" },
  ];

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
          WishList
        </span>
        {/* Category Filters */}
        <div className="flex flex-row flex-wrap justify-start gap-4 p-4 h-14 items-center">
          {categories.map((c, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center text-[12px] h-12 w-28 rounded-3xl ${
                filterType === c.name ? "bg-[#F2F862]" : "bg-gray-200"
              } shadow-md hover:bg-gray-100 cursor-pointer transition duration-300 ease-in-out`}
              onClick={() => setFilterType(c.name)}
            >
              <span className="text-[#000000]">{c.name}</span>
            </div>
          ))}
        </div>
        {/* Booking List */}
        <div
          className="w-full flex flex-col justify-center items-center gap-3"
          style={{ padding: "10px" }}
        >
          {userWishlist
            ?.filter((data) => isExpired(data.event?.date, filterType))
            .map((data, idx) => (
              <WishListCard
                data={data}
                key={idx}
                idx={idx}
                onDelete={removeItem}
              />
            ))}
        </div>
        {userWishlist?.length <= 0 && (
          <div className="h-full w-full flex items-center justify-center" style={{marginTop:"60px"}} >
            <img src="/empty-box.png" />
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
