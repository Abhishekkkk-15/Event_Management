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

function Cards() {
  const [queryToFetch, setQueryToFetch] = useState("");
  const [categoryDataToFetch, setCategoryDataToFetch] = useState("");
  const [events, setEvents] = useState([]);
  const observerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if there's more data

  const { loading, error, data } = useQuery(GET_EVENTS, {
    variables: {
      query: queryToFetch || "",
      category: categoryDataToFetch,
      limit: 3,
      page,
    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data) {
      if (data.events.length === 0) {
        setHasMore(false);
        return;
      }
      setEvents((prev) => [...prev, ...data.events]);
    }
  }, [data]);

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
              setQueryToFetch("");
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
            <div  className="w-[50px] h-[50px] flex justify-center items-center backdrop-blur-sm">

            <img src={loadingSvg} alt="Loading..." className="h-[10px]" />
            </div>
          </div>
        )}

      {hasMore && <div ref={observerRef} className="h-10 w-full"></div>}
    </div>
  );
}

export default Cards;
