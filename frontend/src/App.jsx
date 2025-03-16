import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import NotFoundPage from "./page/NotFoundPage";
import VerifyEmailPage from "./components/VerifyEmailPage";
import BottomNav from "./components/BottomNav";
import ProfileSettings from "./page/ProfileSettings";
import UserProfileUpdate from "./page/UserProfileUpdate";
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";
import TicketPage from "./page/TicketPage";
import ManageEventsPage from "./page/ManageEventsPage";
import AboutUsPage from "./page/AboutUsPage";
import WishlistPage from "./page/WishlistPage";
import ForgetPasswordPage from "./page/ForgetPasswordPage";

function App() {
  const user = useSelector((state) => state.auth.user);
  const { data, loading } = useQuery(GET_AUTH_USER);
  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      dispatch(loginSuccess(data.getAuthuser));
    }
  }, [data, dispatch]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#000000] backdrop-blur-sm">
        <img src={loadingSvg} alt="Loading..." />
      </div>
    );
  }

  return (
    <div
      className="bg-[#000000] min-h-screen max-h-full"
      style={{ height: "100%" }}
    >
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
  const hiddenRoutes = [
    "/",
    "/search",
    "/detailsScreen/*",
    "/userProfile",
    "/verifyEmail",
    "/proflleSettings",
    "/tickets",
    "/aboutUs",
    "/Events",
    "/wishlist",
    "/editProfile"
  ];

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Auth/>} />
        <Route path="/login" element={<Auth />} />
        <Route path="/up" element={<FileUpload />} />
        <Route
          path="/proflleSettings"
          element={user ? <ProfileSettings /> : <Auth />}
        />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/addEvent" element={user ? <AddEvent /> : <Auth/>} />
        <Route path="/detailsScreen/:id" element={ user ?  <DetailScreen /> : <Auth/>} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/editProfile" element={ user ? <UserProfileUpdate /> : <Auth/>} />
        <Route
          path="/verifyEmail"
          element={user?.isVerified ? <ProfileSettings /> : <VerifyEmailPage />}
        />

        <Route path="/tickets" element={ user ? <TicketPage /> : <Auth/>} />
        <Route path="/Events" element={ user ? <ManageEventsPage /> : <Auth/>} />
        <Route path="/aboutUs" element={<AboutUsPage />} />
        <Route path="/wishlist" element={ user ? <WishlistPage /> : <Auth/>} />
        <Route path="/forgetpassword/:token" element={<ForgetPasswordPage />} />
      </Routes>

      {/* Conditionally Render BottomNav */}
      {hiddenRoutes.includes(location.pathname) && <BottomNav />}
    </>
  );
};

export default App;
