import React, { useEffect } from "react";
import HomePage from "./page/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./page/Auth";
import FileUpload from "./page/FileUpload";
import SignUp from "./page/SignUp";
import { useQuery ,gql} from "@apollo/client";
import { useDispatch ,useSelector} from "react-redux";
import { loginSuccess } from "./store/slice/user.slice";
import AddEvent from "./page/AddEvent";
import DetailScreen from "./page/DetailScreen";
import TicketBooking from "./components/TicketBooking";
import EventsPage from "./components/New";
import NotFoundPage from "./page/NotFoundPage";
import EditUserProfile from "./components/UserProfile";
import Account1 from "./free/AddComponent";
import UserProfile from "./page/UserProfile";
import { GET_AUTH_USER } from "./graphql/query/user";

function App() {
  const user = useSelector(state => state.auth.user)
  const { loading, error, data } = useQuery(GET_AUTH_USER);
  const dispatch = useDispatch();
  
  useEffect(()=>{
    if(data) {
      dispatch(loginSuccess(data.getAuthuser))
    }
  })
 
  return (
    <div className="bg-neutral-200 min-h-screen max-h-full" style={{height:"100%"}}>
      <Router>
        <Routes>
          <Route path="/" element={ <HomePage />} />
          <Route path="/login" element={user ? <HomePage /> : <Auth />} />
          <Route path="/up" element={<FileUpload />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/addEvent" element={<AddEvent />} />
          <Route path="/detailsScreen/:id" element={<DetailScreen />} />
          <Route path="/detailsScreen/bookticket" element={<TicketBooking />} />
          <Route path="/app" element={<EventsPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/e" element={<EditUserProfile />} />
          <Route path="/loggedUser" element={<UserProfile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
