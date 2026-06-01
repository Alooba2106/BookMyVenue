import { Link } from "react-router-dom";

function VenueCard({ venue }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={venue.image}
        alt={venue.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-5">
        <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>

        <p className="text-gray-600 mb-1">{venue.location}</p>

        <p className="text-gray-600 mb-1">
          Capacity: {venue.capacity}
        </p>

      <p className="text-2xl font-bold text-blue-600 mb-3">
        ₹{venue.price}
      </p>

        <span
      className={ venue.status?.toLowerCase() === "available"
      ? "inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full mb-4"
      : "inline-block bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full mb-4"
  }
>
  {venue.status||"Not Available"}
</span>

        <Link to={`/venues/${venue.id}`}
        className="block text-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
             View Details
        </Link>
      </div>
    </div>
  );
}

export default VenueCard;