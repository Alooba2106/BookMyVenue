import { useEffect, useState } from "react";

function AdminDashboard() {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/venues")
      .then((res) => res.json())
      .then((data) => setVenues(data));
    fetch("http://127.0.0.1:8000/owners/pending")
        .then((res) => res.json())
        .then((data) => setOwners(data));

    fetch("http://127.0.0.1:8000/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);
function approveOwner(id) {
  fetch(`http://127.0.0.1:8000/owners/${id}/approve`, {
    method: "PUT",
  })
    .then((res) => res.json())
    .then(() => {
      setOwners(
        owners.filter((owner) => owner.id !== id)
      );
    });
}
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2 className="text-blue-600 text-xl font-semibold">Venues</h2>
        {venues.map((venue) => (
          <div key={venue.id}>
            <h3>{venue.name}</h3>
            <p>Location: {venue.location}</p>
            <p>Capacity: {venue.capacity}</p>
            <p>Status: {venue.status ? "Available" : "Unavailable"}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-green-600 text-xl font-semibold">Bookings</h2>
        {bookings.map((booking) => (
          <div key={booking.id}>
            <p>Booking ID: {booking.id}</p>
            <p>Venue ID: {booking.venue_id}</p>
            <p>User ID: {booking.user_id}</p>
            <p>Event Date: {booking.event_date}</p>
            <p>Guests: {booking.guests}</p>
            <p>Status: {booking.booking_status}</p>
          </div>
        ))}
      </section>
      <section>
  <h2 className="text-red-600 text-xl font-semibold">Pending Owners</h2>

  {owners.map((owner) => (
    <div key={owner.id}>
      <p>{owner.name}</p>
      <p>{owner.email}</p>

      <button
        onClick={() => approveOwner(owner.id)}
      >
        Approve
      </button>
    </div>
  ))}
</section>
    </div>
  );
}

export default AdminDashboard;