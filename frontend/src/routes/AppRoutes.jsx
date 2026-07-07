import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Venues from "../pages/Venues";
import VenueDetails from "../pages/VenueDetails";
import UserRegister from "../pages/UserRegister";
import BookingForm from "../pages/BookingForm";
import AdminLogin from "../pages/AdminLogin";
import OwnerLogin from "../pages/OwnerLogin";
import OwnerRegister from "../pages/OwnerRegister";
import AdminDashboard from "../pages/AdminDashboard";
import OwnerDashboard from "../pages/OwnerDashboard";
import OwnerVenuesPage from "../pages/OwnerVenuesPage";
import OwnerAddVenuePage from "../pages/OwnerAddVenuePage";
import OwnerEditVenuePage from "../pages/OwnerEditVenuePage";
import OwnerBookingsPage from "../pages/OwnerBookingsPage";
import UserLogin from "../pages/UserLogin";
import MyBookings from "../pages/MyBookings";
import BookingSuccess from "../pages/BookingSuccess";
import ManageSlotsPage from "../pages/ManageSlotsPage";
import Footer from "./components/Footer";
import NotFound from "../pages/NotFound";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venues" element={<Venues />} />
      <Route path="/venues/:id" element={<VenueDetails />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/admin/login" element={<AdminLogin/>}/>
      <Route path="/owner/login" element={<OwnerLogin/>}/>
      <Route path="/owner/register" element={<OwnerRegister/>}/>
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
      <Route path="/owner/venues" element={<OwnerVenuesPage />} />
      <Route path="/owner/add-venue" element={<OwnerAddVenuePage />} />
      <Route path="/owner/edit-venue/:venueId" element={<OwnerEditVenuePage />} />
      <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
      <Route path="/bookings/:venueId" element={<BookingForm />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/owner/venues/:venueId/slots" element={<ManageSlotsPage />}/>
      <Route path="/my-bookings" element={<MyBookings />} />
       <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;