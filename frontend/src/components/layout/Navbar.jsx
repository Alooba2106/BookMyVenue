import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.webp";

function Navbar() {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const userToken = localStorage.getItem("token");
  const ownerToken = localStorage.getItem("ownerToken");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerId");

    navigate("/");
    window.location.reload();
  }

 return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="BookMyVenue"
              className="w-12 h-12 rounded-2xl object-cover shadow-sm"
            />

            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Book<span className="text-red-600">My</span>Venue
            </h1>
          </Link>

          <div className="flex gap-6 items-center text-sm font-semibold text-gray-700">
            <Link to="/" className="hover:text-red-600 transition">
              Home
            </Link>

            {!ownerToken && (
              <Link to="/venues" className="hover:text-red-600 transition">
                Venues
              </Link>
            )}

            {userToken && (
              <Link to="/my-bookings" className="hover:text-red-600 transition">
                My Bookings
              </Link>
            )}

            {ownerToken && (
              <Link
                to="/owner/dashboard"
                className="hover:text-red-600 transition"
              >
                Owner Dashboard
              </Link>
            )}

            {!userToken && !ownerToken ? (
              <button
                onClick={() => setShowLoginPopup(true)}
                className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition shadow-sm"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-gray-900 text-white px-5 py-2 rounded-xl hover:bg-black transition shadow-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative">
            <button
              onClick={() => setShowLoginPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-center text-gray-900">
              Login to Continue
            </h2>

            <p className="text-center text-gray-500 mt-2 mb-6">
              Choose your account type
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  navigate("/login");
                }}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Login as User
              </button>

              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  navigate("/owner/login");
                }}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black transition"
              >
                Login as Owner
              </button>

              <button
                onClick={() => setShowLoginPopup(false)}
                className="w-full border border-gray-300 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
