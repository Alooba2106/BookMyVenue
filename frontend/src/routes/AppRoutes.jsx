import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Venues from "../pages/Venues";
import VenueDetails from "../pages/VenueDetails";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venues" element={<Venues />} />
      <Route path="/venues/:id" element={<VenueDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;