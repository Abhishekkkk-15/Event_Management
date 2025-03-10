import React, { useState, useEffect, useRef } from "react";
import { CiMusicNote1 } from "react-icons/ci";
import { MdOutlineSportsBaseball } from "react-icons/md";
import { TiThSmallOutline } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io";
import Card from "./NewCard";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import CardSkeleton from "../Skeleton/Card";
import { GET_EVENTS } from "../graphql/query/event";
import { showSuccess } from "../utils/toast";
import { Avatar, AvatarImage } from "./ui/avatar";
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";
import { CiSearch } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
import { country } from "../country.js";
import { VscSettings } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { FilterDialog } from "./Filter.jsx";
import EmailVerificationBanner from "./EmailVerificationBanner.jsx";

function Cards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryDataToFetch, setCategoryDataToFetch] = useState("");
  const [events, setEvents] = useState([]);
  const observerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  const [location, setLocation] = useState({ country: "", city: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState(0);
  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("it's getting called");
      setDebouncedSearch(searchTerm);
    
    }, 500);

    return () => {
      clearTimeout(handler); 
    };
  }, [searchTerm]);

  const countryName =
    country.find((c) => c.code === location.country)?.name || "India";
  console.log("User from store", user);

  const { loading, error, data, refetch } = useQuery(GET_EVENTS, {
    variables: {
      query: debouncedSearch || "",
      category: categoryDataToFetch,
      limit: 4,
      page,
      price: parseFloat(priceRange),
    },
    fetchPolicy: "cache-and-network",
  });

  const filterFuntion = (category, price) => {
    if (category == null || price == null) return;
    const validPrice = isNaN(parseFloat(price)) ? 0 : parseFloat(price);
    setPriceRange(validPrice);
    console.log(parseFloat(price));
    if (category == "All") {
      setCategoryDataToFetch("");
    } else {
      setCategoryDataToFetch(category);
    }
    setPriceRange(parseFloat(price));
    setPage(1);
    setEvents([]);
    refetch({
      category: category,
      price: parseFloat(price),
      limit: 4
    });
  };

  // Refetch data when search term changes
  useEffect(() => {
    if (debouncedSearch.trim() !== "") {
      setPage(1); // Reset pagination
      setEvents([]); // Clear previous events
      refetch();
    } else {
      // When search input is cleared, fetch all events again
      setPage(1);
      setEvents([]); // Reset events to avoid duplicates
      refetch();
    }
  }, [debouncedSearch, refetch]);

  useEffect(() => {
    if (data) {
      if (data.events.length === 0) {
        setHasMore(false);
        return;
      }
      console.log("Setting new data");
      setEvents((prev) => [...prev, ...data.events]);
    }
  }, [data,loading]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, hasMore]);

  if (error) console.log(error);

  const category = [
    { img: "../../Public/CMusic.png", name: "All" },
    { img: "../../Public/CMusic.png", name: "Music" },
    { img: "", name: "Sports" },
  ];

  return (
    <>
      <>
        <div
          className="h-32 w-full flex flex-col items-center justify-between gap-4"
          style={{ padding: "14px" }}
        >
          <div className="flex flex-row items-center justify-between w-full ">
            <Avatar className=" h-12 w-12 ">
              <AvatarImage src={user?.avatar} />
            </Avatar>

            <div className="flex items-center flex-col ">
              {/* <FaLocationCrosshairs className="text-white" size={22} /> */}
              <span className="text-[#C1C1C1] text-[12px]">Welcome back</span>
              <span className="text-[#FEFEFE] text-[16px]">{user?.name}</span>
            </div>
            <div className="bg-white/20 h-12 w-12 flex justify-center items-center rounded-full">
              <FaRegHeart className="text-[#F2F862]" size={22} />
            </div>
          </div>

          {/* Search Bar - Positioned at Bottom Center */}
          <div className="flex items-center justify-between w-full">
            <div
              className="  h-10 w-[80%] bg-white/20 rounded-3xl flex items-center justify-between px-4 shadow-lg text-[#FEFEFE]"
              style={{ border: "1px solid #C1C1C1" }}
            >
              <CiSearch
                className="text-[#FEFEFE] text-2xl  mr-9"
                style={{ marginLeft: "8px" }}
              />
              <input
                type="text"
                className="bg-white/20 h-full w-full outline-none  placeholder:text-[#FEFEFE]"
                placeholder=" Discover"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div
              className="bg-white/20 h-12 w-12 flex justify-center items-center rounded-full"
              style={{ border: "1px solid #C1C1C1" }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FilterDialog filterFn={filterFuntion} />
            </div>
          </div>
        </div>
      </>
<EmailVerificationBanner/>
      <div className="h-full bg-[#000000] mt-10">
        <div
          className="flex flex-row flex-wrap  justify-start gap-4 p-4 h-14 items-center"
          style={{ margin: "0 5px 0 10px" }}
        >
          {category.map((c, idx) => (
            <div
              key={idx}
              className="flex items-center justify-evenly text-[12px]  h-12 w-28 rounded-3xl bg-[#F2F862] gap-2 shadow-md hover:bg-gray-100 cursor-pointer transition duration-300 ease-in-out"
              onClick={() => {
                setEvents([]); // Reset events on category change
                setPage(1);
                setHasMore(true);
                setCategoryDataToFetch(c.name === "All" ? "" : c.name);
              }}
            >
              <Avatar className=" h-9 w-9">
                <AvatarImage src={c.img} />
              </Avatar>
              <span>{c.name}</span>
            </div>
          ))}
        </div>

        {/* <Link
        to="/addEvent"
        className="fixed bottom-19 right-14 h-12 w-12 flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 z-50"
      >
        <IoMdAdd className="h-10 w-5" />
      </Link> */}

        <div
          className="flex justify-center items-center flex-col gap-3 lg:grid lg:grid-cols-3"
          style={{ paddingBottom: "10px" }}
        >
          {events.map((event, index) => (
            <Card data={event} key={index} />
          ))}
        </div>
        {loading && (
          <div className="w-full h-[full flex justify-center items-center backdrop-blur-sm">
            <div className="w-[50px] h-[50px] flex justify-center items-center backdrop-blur-sm">
              <img src={loadingSvg} alt="Loading..." className="h-[10px]" />
            </div>
          </div>
        )}

        {hasMore && <div ref={observerRef} className="h-10 w-full"></div>}
      </div>
    </>
  );
}

export default Cards;
