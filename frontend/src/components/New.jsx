import React from "react";
import { FaHome, FaUserFriends, FaComments, FaHeart, FaCog, FaMoneyBill, FaSignOutAlt } from "react-icons/fa";
// import { Input } from "@/components/ui/input";

const categories = ["All", "Glam party", "On the water", "Party bus", "Classes", "Quests", "Hot party", "At home"];
const events = [
  { title: "Fashion Party", image: "https://source.unsplash.com/300x200/?fashion,party", author: "Jessica Cooper" },
  { title: "Make up master class", image: "https://source.unsplash.com/300x200/?makeup,class", author: "" },
  { title: "Party with parents", image: "https://source.unsplash.com/300x200/?family,party", author: "Adam Goldberg" },
  { title: "A party in the style of the 30s", image: "https://source.unsplash.com/300x200/?vintage,party", author: "" },
  { title: "Party for two", image: "https://source.unsplash.com/300x200/?couple,party", author: "" },
];

const Sidebar = () => (
  <aside className="w-60 bg-white p-4 flex flex-col gap-4 shadow-md min-h-screen">
    <div className="text-xl font-bold text-pink-600">bach.com</div>
    <nav className="flex flex-col gap-4">
      {[{icon: FaHome, label: "Home"}, {icon: FaUserFriends, label: "Friends"}, {icon: FaComments, label: "Chats"}, {icon: FaHeart, label: "Favorites"}, {icon: FaCog, label: "Settings"}, {icon: FaMoneyBill, label: "Expenses"}, {icon: FaSignOutAlt, label: "Log out"}].map(({icon: Icon, label}) => (
        <button key={label} className="flex items-center gap-3 text-gray-700 hover:text-pink-600">
          <Icon size={20} /> {label}
        </button>
      ))}
    </nav>
  </aside>
);

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const EventCard = ({ title, image, author }) => (
  <Card>
    <img src={image} alt={title} className="w-full h-40 object-cover" />
    <CardContent>
      <h3 className="font-bold text-lg">{title}</h3>
      {author && <p className="text-sm text-gray-500">Ph: {author}</p>}
    </CardContent>
  </Card>
);

const Header = () => (
  <header className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Spend your day the way you want</h1>
    {/* <Input className="w-80" placeholder="Search an event" /> */}
  </header>
);

const CategoryFilters = () => (
  <div className="flex gap-4 mb-6 overflow-x-auto">
    {categories.map(category => (
      <button key={category} className="px-4 py-2 bg-pink-500 text-white rounded-full">{category}</button>
    ))}
  </div>
);

export default function EventsPage() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <CategoryFilters />
        <div className="grid grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>
      </main>
    </div>
  );
}
