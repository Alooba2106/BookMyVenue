import { useEffect, useState } from "react";

function OwnerBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      const ownerId = localStorage.getItem("ownerId");

      const response = await fetch(
        `http://localhost:8000/owners/${ownerId}/bookings`
      );

      const data = await response.json();
      console.log(data);
      setBookings(data);
    }

    fetchBookings();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Owner Bookings
          </h1>
          <p className="text-gray-500 mt-2">
            View booking requests received for your venues.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Booking ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Venue</th>
                  <th className="px-4 py-3 text-left">Event Date</th>
                  <th className="px-4 py-3 text-left">Guests</th>
                  <th  className="px-4 py-3 text-left">Slot</th>
                  <th className="px-4 py-3 text-left">Advance</th>
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
                    <td className="px-4 py-4">{booking.customer_name}</td>
                    <td className="px-4 py-4">{booking.venue_name}</td>
                    <td className="px-4 py-4">{booking.event_date}</td>
                    <td className="px-4 py-4">{booking.guests}</td>
                    <td className="px-4 py-4">{booking.slot_name}</td>
                    <td className="px-4 py-4">₹{booking.advance_amount}</td>
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
      </div>
    </section>
  );
}

export default OwnerBookingsPage;