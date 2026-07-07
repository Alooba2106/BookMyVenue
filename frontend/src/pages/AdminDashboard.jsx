import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function AdminDashboard() {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [owners, setOwners] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");

    if (isAdmin !== "true") {
      alert("Please login as admin");
      navigate("/admin/login");
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/venues`)
      .then((res) => res.json())
      .then((data) => setVenues(data));

    fetch(`${import.meta.env.VITE_API_BASE_URL}/owners/pending`)
      .then((res) => res.json())
      .then((data) => setOwners(data));

    fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings`)
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, [navigate]);

  function approveOwner(id) {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/${id}/approve`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then(() => {
        setOwners((prevOwners) =>
          prevOwners.filter((owner) => owner.id !== id)
        );
      });
  }

  function handleLogout() {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Monitor venues, bookings and owner approvals.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white hover:bg-purple-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500">Total Venues</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              {venues.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500">Total Bookings</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              {bookings.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-500">Pending Owners</p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {owners.length}
            </h2>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Pending Owners
          </h2>

          {owners.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500">No pending owners.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {owners.map((owner) => (
                <div
                  key={owner.id}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {owner.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {owner.email}
                    </p>
                  </div>

                  <button
                    onClick={() => approveOwner(owner.id)}
                    className="rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Venues
          </h2>

          {venues.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500">No venues found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                >
                  {venue.image && (
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-40 object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {venue.name}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      {venue.location}
                    </p>

                    <p className="text-gray-600 text-sm mt-2">
                      Capacity: {venue.capacity}
                    </p>

                    <span
                      className={`inline-block mt-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        venue.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {venue.status ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Bookings
          </h2>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-500">No bookings found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Booking ID</th>
                    <th className="px-4 py-3 text-left">Venue ID</th>
                    <th className="px-4 py-3 text-left">User ID</th>
                    <th className="px-4 py-3 text-left">Event Date</th>
                    <th className="px-4 py-3 text-left">Guests</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">{booking.id}</td>
                      <td className="px-4 py-4">{booking.venue_id}</td>
                      <td className="px-4 py-4">{booking.user_id}</td>
                      <td className="px-4 py-4">{booking.event_date}</td>
                      <td className="px-4 py-4">{booking.guests}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            booking.booking_status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {booking.booking_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default AdminDashboard;