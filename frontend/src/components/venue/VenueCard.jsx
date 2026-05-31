function VenueCard({ venue }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      <img
        src={venue.image}
        alt={venue.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-xl font-semibold">
          {venue.name}
        </h3>

        <p className="text-gray-600">
          {venue.location}
        </p>

        <p className="text-blue-600 font-bold mt-2">
          ₹{venue.price}
        </p>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
          View Details
        </button>
      </div>

    </div>
  );
}

export default VenueCard;