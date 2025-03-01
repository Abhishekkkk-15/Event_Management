import React, { useState, useEffect, useRef } from "react";
import { CiMusicNote1 } from "react-icons/ci";
import { MdOutlineSportsBaseball } from "react-icons/md";
import { TiThSmallOutline } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io";
import Card from "./Card";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import CardSkeleton from "../Skeleton/Card";
import { GET_EVENTS } from "../graphql/query/event";
import { showSuccess } from "../utils/toast";



function Cards() {
  const [queryToFetch, setQueryToFetch] = useState("");
  const [categoryDataToFetch, setCategoryDataToFetch] = useState("");
  const [events, setEvents] = useState([]);
  const observerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if there's more data

  const { loading, error, data } = useQuery(GET_EVENTS, {
    variables: { query: queryToFetch || "", category: categoryDataToFetch ,limit: 3, page },
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
    { symbol: <TiThSmallOutline className="text-white bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full" />, name: "All" },
    { symbol: <CiMusicNote1 className="text-purple-500" />, name: "Music" },
    { symbol: <MdOutlineSportsBaseball className="text-yellow-500" />, name: "Sports" },
  ];

  return (
    <div className="h-full">
      <div className="flex flex-row flex-wrap justify-start gap-4 p-4 h-14 items-center" style={{margin:"0 5px 0 10px"}}>
        {category.map((c, idx) => (
          <div
            key={idx}
            className="flex justify-center text-[12px] items-center h-10 w-28 rounded-2xl bg-white gap-2 shadow-md hover:bg-gray-100 cursor-pointer transition duration-300 ease-in-out"
            onClick={() => {
              setEvents([]); // Reset events on category change
              setPage(1);
              setHasMore(true);
              setCategoryDataToFetch(c.name === "All" ? "" : c.name);
              setQueryToFetch('')
            }}
          >
            {c.symbol} {c.name}
          </div>
        ))}
      </div>

      <Link
        to="/addEvent"
        className="fixed bottom-19 right-14 h-12 w-12 flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 z-50"
      >
        <IoMdAdd className="h-10 w-5" />
      </Link>

      <div className="flex justify-center items-center flex-col gap-3 lg:grid lg:grid-cols-3" style={{ marginBottom: "10px" }}>
        {events.map((event, index) => <Card data={event} key={index} />)}
        {loading && <CardSkeleton />}
      </div>

      {hasMore && <div ref={observerRef} className="h-10 w-full"></div>}
    </div>
  );
}

export default Cards;
