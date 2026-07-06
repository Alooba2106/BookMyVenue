import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyBookings() {
      const token = localStorage.getItem("token");

      if (!token || token === "null" || token === "undefined") {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:8000/my-bookings", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);

        alert(errorMessage || "Failed to load bookings");
        navigate("/login");
        return;
      }
      console.log(data);
      setBookings(data);
    }

    fetchMyBookings();
  }, [navigate]);

  async function handleCancel(bookingId) {
    const token = localStorage.getItem("token");

    if (!token || token === "null" || token === "undefined") {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const response = await fetch(
      `http://localhost:8000/bookings/${bookingId}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log(data);

      const errorMessage =
        typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail);

      alert(errorMessage || "Cancellation failed");
      return;
    }

    alert(data.message || "Booking cancelled successfully");

    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.booking_id === bookingId
          ? { ...booking, booking_status: "cancelled" }
          : booking
      )
    );
  }


  return (
  <section className="min-h-screen bg-gray-50 px-6 py-10">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Bookings
        </h1>

        <p className="text-gray-500 mt-2">
          View and manage your venue bookings.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <p className="text-gray-500">
            No bookings found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {booking.venue_name}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    📅 {booking.event_date}
                  </p>

                  <p className="text-gray-600">
                    ⏰ {booking.slot_name} (
                    {booking.start_time} - {booking.end_time})
                  </p>

                  <p className="text-gray-600">
                    👥 Guests: {booking.guests}
                  </p>

                  <p className="text-gray-600">
                    💰 Advance Amount: ₹{booking.advance_amount}
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      booking.booking_status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {booking.booking_status}
                  </span>

                  {booking.booking_status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(booking.booking_id)}
                      className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 transition"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);}
  
export default MyBookings;