import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Venues from "../pages/Venues";
import VenueDetails from "../pages/VenueDetails";
import NotFound from "../pages/NotFound";
import BookingForm from "../pages/BookingForm";
import Login from "../pages/Login";
import AdminLogin from "../pages/AdminLogin";
import OwnerLogin from "../pages/OwnerLogin";
import OwnerRegister from "../pages/OwnerRegister";
import AdminDashboard from "../pages/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venues" element={<Venues />} />
      <Route path="/venues/:id" element={<VenueDetails />} />
       <Route path="/bookings/:id" element={<BookingForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin/>}/>
      <Route path="/owner/login" element={<OwnerLogin/>}/>
      <Route path="/owner/register" element={<OwnerRegister/>}/>
      <Route path="/admin" element={<AdminDashboard/>}/>
      <Route path="*" element={<NotFound />} />
     
    </Routes>
  );
}

export default AppRoutes;