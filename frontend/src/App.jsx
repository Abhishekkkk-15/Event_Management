import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./store/slice/user.slice";
import { GET_AUTH_USER } from "./graphql/query/user";

import HomePage from "./page/HomePage";
import Auth from "./page/Auth";
import FileUpload from "./page/UserProfileUpdate";
import SignUp from "./page/SignUp";
import AddEvent from "./page/AddEvent";
import DetailScreen from "./page/DetailScreen";
import EventsPage from "./components/New";
import NotFoundPage from "./page/NotFoundPage";
import VerifyEmailPage from "./components/VerifyEmailPage";
import QRScanner from "./components/QRScanner";
import BottomNav from "./components/BottomNav";
import ProfileSettings from "./page/ProfileSettings";
import UserProfileUpdate from "./page/UserProfileUpdate";
import TicketPage from "./page/TicketPage";

function App() {
  const user = useSelector((state) => state.auth.user);
  const { data } = useQuery(GET_AUTH_USER);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(loginSuccess(data.getAuthuser));
    }
  }, [data, dispatch]);

  return (
    <div className="bg-[#000000] min-h-screen max-h-full" style={{ height: "100%" }}>
      <Router>
        <MainRoutes />
      </Router>
    </div>
  );
}

// Separate Routes Component
const MainRoutes = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);


  // Define routes where BottomNav should be hidden
  const hiddenRoutes = ["/", "/search", "/detailsScreen/*", "/userProfile", "/verifyEmail","/proflleSettings","/tickets"];

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/up" element={<FileUpload />} />
        <Route path="/proflleSettings" element={<ProfileSettings />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/addEvent" element={<AddEvent />} />
        <Route path="/detailsScreen/:id" element={<DetailScreen />} />
        <Route path="/app" element={<EventsPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/editProfile" element={<UserProfileUpdate />} />
        <Route path="/verifyEmail" element={ user?.isVerified ? <ProfileSettings />: <VerifyEmailPage />} />
        <Route path="/qr" element={<QRScanner />} />
        <Route path="/tickets" element={<TicketPage />} />
      </Routes>

      {/* Conditionally Render BottomNav */}
      {hiddenRoutes.includes(location.pathname) && <BottomNav />}
    </>
  );
};

export default App;
