import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";

const events = [
  {
    category: "Immunity",
    date: "2024-03-30",
    title: "Chatbots And Virtual Assistants",
    location: "482 Ridge Top Cir, Anchorage",
    image: "https://via.placeholder.com/300",
  },
  {
    category: "Skin Quality",
    date: "2023-11-08",
    title: "Modern Marketing Summit Sydney",
    location: "482 Ridge Top, USA Main City",
    image: "https://via.placeholder.com/300",
  },
  {
    category: "Concentration",
    date: "2023-11-21",
    title: "Registration For Opening Workshop",
    location: "129 Ave, Ketcham",
    image: "https://via.placeholder.com/300",
  },
];

const EventListingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center px-6">
        <h1 className="text-xl font-bold">Motivec</h1>
        <div className="flex gap-4">
          <Button variant="outline">Home</Button>
          <Button variant="outline">Events</Button>
          <Button variant="outline">Blog</Button>
          <Button className="bg-purple-600 text-white">Register</Button>
          <ShoppingCart className="w-6 h-6" />
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-64 bg-black text-white flex items-center justify-center">
        <h2 className="text-4xl font-bold">Events</h2>
      </div>

      {/* Event Listings */}
      <div className="container mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">
                {event.category}
              </span>
              <p className="text-gray-500 text-sm mt-2">{event.date}</p>
              <h3 className="text-lg font-semibold mt-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mt-1">📍 {event.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="bg-blue-900 text-white py-10 text-center">
        <h3 className="text-2xl font-bold">SUBSCRIBE TO OUR NEWSLETTER!</h3>
        <div className="mt-4 flex justify-center gap-2">
          <Input className="w-72" placeholder="Your email address" />
          <Button className="bg-purple-600 text-white">Subscribe</Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 p-6 text-center">
        <p>Copyright © 2024 Motivec. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default EventListingPage;
