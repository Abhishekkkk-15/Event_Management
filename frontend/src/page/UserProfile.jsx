import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_USER_MUTATION, LOGOUT_USER } from "../graphql/mutation/user.js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slice/user.slice.js";
import { Link, useNavigate } from "react-router-dom";
import { GET_LOGGED_USER_INFO } from "../graphql/query/user.js";
import UserBookings from "../components/UserBookings.jsx";
import { DELETE_EVENT } from "../graphql/mutation/event.js";
import QRScanner from "../components/QRScanner.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { SidebarNav } from "../components/ui/sidebar-nav";
import { showError, showInfo, showSuccess } from "../utils/toast.js";
import { CiEdit } from "react-icons/ci";
import { FaRegMoneyBillAlt, FaTachometerAlt,FaMoneyBillWave ,FaQrcode ,FaCalendarAlt, FaTicketAlt, FaSignOutAlt } from "react-icons/fa";
import { logoutUser } from "../REST_API/user.js";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [navigation, setNavigation] = useState("Dashboard");
  const { data, loading, error } = useQuery(GET_LOGGED_USER_INFO);
  const [updateProfile] = useMutation(UPDATE_USER_MUTATION);
  const [deleteEvent] = useMutation(DELETE_EVENT);
 
  const logout = async () => {
    try {
      console.log("it wokrgs");
      await logoutUser();
      console.log("it wokrgs");
      dispatch(loginSuccess(null));
      navigate("/login");
    } catch (error) {
      showError("Error while logging out");
    } }

  const user = data?.user;
  const userBookings = user?.bookings;



  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent({ variables: { eventID: id } });
      showSuccess("Event Deleted Successfully!");
    } catch (error) {
      showError("Error while deleting event");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data...</p>;

  return (
    <div className="flex min-h-screen">
      <SidebarNav
        items={[
          { name: "Dashboard", onClick: () => setNavigation("Dashboard"),to: "/dashboard", icon: <FaTachometerAlt /> },
          { name: "My Events", onClick: () => setNavigation("MyEvents") , to: "/events",icon: <FaCalendarAlt />},
          { name: "Earnings", onClick: () => setNavigation("Earnings"),to: "/earnings",icon: <FaMoneyBillWave /> },
          { name: "QR Scanner", onClick: () => setNavigation("qrScanner"), to: "/qr-scanner" ,icon: <FaQrcode />},
          {
            name: "Logout",
            onClick: () => logout(),
            className: "text-red-500",
            icon: <FaSignOutAlt />,
          },
        ]}
      />

      <main className="flex-1 p-6">
        <Card>
          <CardHeader className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user?.avatar || "/default-avatar.png"} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Link to="/updateUserProfile">
            <Button className="ml-auto" variant="outline">
              <CiEdit className="text-xl" />
            </Button>
            </Link>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="flex items-center gap-4">
              <FaRegMoneyBillAlt className="text-3xl text-primary" />
              <div>
                <p className="text-xl font-semibold">₹{user?.totalEarnings || 0}</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <FaCalendarAlt className="text-3xl text-blue-600" />
              <div>
                <p className="text-xl font-semibold">{user?.events?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <FaTicketAlt className="text-3xl text-green-600" />
              <div>
                <p className="text-xl font-semibold">{user?.events?.reduce((acc, e) => acc + e.bookedSlots, 0) || 0}</p>
                <p className="text-sm text-muted-foreground">Tickets Sold</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {navigation === "Dashboard" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Events</CardTitle>
            </CardHeader>
            <CardContent>
              {user?.events?.length === 0 ? (
                <p className="text-muted-foreground">No events posted yet.</p>
              ) : (
                user.events.map((event) => (
                  <div key={event.id} className="flex justify-between border-b py-2">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">Slots Available: {event.maxSlots - event.bookedSlots}</p>
                      <Button variant="destructive" onClick={() => handleDeleteEvent(event.id)} size="sm">
                        Delete Event
                      </Button>
                    </div>
                    <p className="font-medium">₹{event.price}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {navigation === "MyEvents" && <UserBookings userBookings={userBookings} />}
        {navigation === "qrScanner" && <QRScanner />}
      </main>
    </div>
  );
};

export default UserProfile;
