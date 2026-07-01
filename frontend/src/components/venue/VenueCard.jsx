import { Link } from "react-router-dom";

function VenueCard({ venue }) {
  return (
    <Link to={`/venues/${venue.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden transition">
        <div className="relative">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-64 object-cover rounded-2xl group-hover:brightness-90 transition"
          />

          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
              venue.status
                ? "bg-white text-green-700"
                : "bg-white text-red-700"
            }`}
          >
            {venue.status ? "Available" : "Booked"}
          </span>
        </div>

        <div className="pt-4">
          <div className="flex justify-between items-start gap-3">
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {venue.name}
            </h2>

            <p className="text-sm text-gray-700 whitespace-nowrap">
              ⭐ 4.8
            </p>
          </div>

          <p className="mt-1 text-gray-500 text-sm">
            {venue.location}
          </p>

          <p className="mt-1 text-gray-500 text-sm">
            Capacity: {venue.capacity}
          </p>

         
        </div>
      </div>
    </Link>
  );
}

export default VenueCard;