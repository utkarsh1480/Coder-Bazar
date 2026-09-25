import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from '../pages/Home.jsx'
import Listing from '../pages/Listing.jsx'
import ListingDetails from "../pages/ListingDetails.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import CreateListing from "../pages/CreateListing.jsx";
import Favorites from "../pages/Favorites.jsx";
import Messages from "../pages/Messages.jsx";
import Profile from "../pages/Profile.jsx";
import EditListing from "../pages/EditListing.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element= {<Home/>} />
        <Route path="/listings" element={<Listing/>} />
        <Route path="/listings/:id" element={<ListingDetails/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route element={<ProtectedRoute/>}>
        <Route path="/profile" element={<Profile/>} />
        <Route path="/favorites" element={<Favorites/>} />
        <Route path="/messages" element={<Messages/>} />
        <Route path="/messages/:conversationId"element={<Messages />}/>
        <Route
          path="/create-listing"
          element={<CreateListing/>}
        />
        <Route
    path="/edit/listing/:id"  element={<EditListing />}/>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;