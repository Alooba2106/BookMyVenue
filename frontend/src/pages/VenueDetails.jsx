import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";


function VenueDetails() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    async function fetchVenue() {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venues/${id}`);
      const data = await response.json();
      setVenue(data);
    }

    fetchVenue();
  }, [id]);

  if (venue === null) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <img
        src={venue.image}
        alt={venue.name}
        className="w-full h-96 object-cover rounded-2xl mb-8"
      />

      <h1 className="text-4xl font-bold mb-4">{venue.name}</h1>

      <p className="text-gray-600 mb-2">📍 {venue.location}</p>
      <p className="text-gray-600 mb-2">🏷️ {venue.category}</p>
      <p className="text-gray-600 mb-2">👥 Capacity: {venue.capacity}</p>

      <p className="text-2xl font-bold text-blue-600 mb-4">₹{venue.price}</p>

      <span
        className={
          venue.status
            ? "inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6"
            : "inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6"
        }
      >
        {venue.status ? "Available" : "Unavailable"}
      </span>

      <ul className="mb-6">
        {venue.amenities?.split(",").map((item, index) => (
          <li key={index}>✓ {item.trim()}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Description</h2>
      <p className="text-gray-700 leading-7 mb-8">{venue.description}</p>

      <Link
        to={`/bookings/${venue.id}`}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Book Now
      </Link>
    </section>
  );
}

export default VenueDetails;