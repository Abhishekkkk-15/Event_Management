import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_USER_MUTATION,LOGOUT_USER } from "../graphql/mutation/user.js";
import { CiEdit } from "react-icons/ci";
import { FaRegMoneyBillAlt, FaCalendarAlt, FaTicketAlt, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { showError, showInfo, showSuccess } from "../utils/toast.js";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logoutUser } from "../store/slice/user.slice.js";
import { useNavigate } from "react-router-dom";
import { GET_LOGGED_USER_INFO } from "../graphql/query/user.js";
import UserBookings from "../components/UserBookings.jsx";
import { DELETE_EVENT } from "../graphql/mutation/event.js";
import QRScanner from "../components/QRScanner.jsx";

const UserProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [navigation,setNavigation] = useState('Dashboard')
  const {data,loading,error}= useQuery(GET_LOGGED_USER_INFO)
  const [updateProfile] = useMutation(UPDATE_USER_MUTATION);
  const [deleteEvent] = useMutation(DELETE_EVENT)
  const [logout,{data:logoutData,loading:logoutLoading,error:errorLogout}] = useMutation(LOGOUT_USER,{
    onCompleted: () => {
      
      showInfo(data)
      dispatch(logoutUser);
      dispatch(loginSuccess(''))       
        navigate('/')       
     
    },
    onError: (err) => {
      console.error("Logout failed:", err.message);
    },
  });

  let user;
  let userBookings

  if(data){
    user = data.user  
    userBookings = data?.user?.bookings
  }

  
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  const formatDate = (date) => {
    return date
      ? new Date(Number(date)).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Invalid Date";
  };

  const handleEditClick = () => {
    setUserData({
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile({ variables: { ...userData } });
      setIsEditing(false);
      showInfo("Profile updated successfully!");
    } catch (error) {
      showInfo(error.message);
    }
  };

  const handleDeleteEvent = async (id) =>{
   try {
    await deleteEvent({variables: {eventID:id}})
    showSuccess("Event Deleted Successfully!")
   } catch (error) {
    showError("Error while deleting Post")
   }
  }

  if (user) console.log(user);
  if(logoutLoading) return <p>LogingOut user...</p>;
  if(error) return <p>Error while logging out user...</p>;
  if(loading) return <p>Loading...</p>;

  
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-lg min-h-screen">
        <div className="flex items-center gap-4">
          <FaUserCircle className="text-4xl text-gray-700" />
          <h2 className="text-xl font-semibold">{user?.name}</h2>
        </div>
        <nav className="mt-6">
          <ul className="space-y-4">
            <li className="text-gray-600 font-medium cursor-pointer hover:text-purple-600" onClick={() => setNavigation("Dashboard")}>Dashboard</li>
            <li className="text-gray-600 font-medium cursor-pointer hover:text-purple-600" onClick={() => setNavigation("MyEvents")}>My Events</li>
            <li className="text-gray-600 font-medium cursor-pointer hover:text-purple-600" onClick={() => setNavigation("Earnings")}>Earnings</li>
            <li className="text-gray-600 font-medium cursor-pointer hover:text-purple-600" onClick={() => setNavigation("qrScanner")}>QR Scanner</li>
            <li className="text-red-500 font-medium cursor-pointer hover:text-red-600 flex items-center gap-2" onClick={()=> logout()}>
              <FaSignOutAlt/> Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Profile Overview */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-6">
          <img src={user?.avatar || "/default-avatar.png"} alt="Profile" className="w-24 h-24 rounded-full border" />
          <div>
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <button onClick={handleEditClick} className="ml-auto p-2 bg-gray-200 rounded-full">
            <CiEdit className="text-xl" />
          </button>
        </div>

        {/* Event Analytics */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-purple-100 p-6 rounded-lg flex items-center gap-4 shadow">
            <FaRegMoneyBillAlt className="text-3xl text-purple-700" />
            <div>
              <p className="text-xl font-semibold">₹{user?.totalEarnings || 0}</p>
              <p className="text-gray-500 text-sm">Total Earnings</p>
            </div>
          </div>
          <div className="bg-blue-100 p-6 rounded-lg flex items-center gap-4 shadow">
            <FaCalendarAlt className="text-3xl text-blue-700" />
            <div>
              <p className="text-xl font-semibold">{user?.events?.length}</p>
              <p className="text-gray-500 text-sm">Total Events</p>
            </div>
          </div>
          <div className="bg-green-100 p-6 rounded-lg flex items-center gap-4 shadow">
            <FaTicketAlt className="text-3xl text-green-700" />
            <div>
              <p className="text-xl font-semibold">{user?.events?.reduce((acc, e) => acc + e.bookedSlots, 0)}</p>
              <p className="text-gray-500 text-sm">Tickets Sold</p>
            </div>
          </div>
        </div>

        {/* Events List */}
        {navigation == 'Dashboard' && <div className="bg-white p-6 mt-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Your Events</h3>
          {user?.events?.length === 0 ? (
            <p className="text-gray-500">No events posted yet.</p>
          ) : (
            user?.events?.map((event) => (
              <div key={event.id} className="p-4 border-b flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">{event.title}</h4>
                  <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                  <p className="text-sm text-gray-500">Slots Available: {event.maxSlots - event.bookedSlots}</p>
                  <button className="text-sm text-gray-500" onClick={()=>handleDeleteEvent(event?.id)}>Delete Event</button>
                </div>
                <p className="text-gray-700 font-medium">₹{event.price}</p>
              </div>
            ))
          )}
        </div>  } 
        {
          navigation == 'MyEvents' && <UserBookings userBookings={userBookings}/>
        }
        {/* {
          navigation == "qrScanner" && <QRScanner/>
        } */}
      </main>
    </div>
  );
};

export default UserProfile;
