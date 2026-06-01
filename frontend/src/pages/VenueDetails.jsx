import {Link, useParams } from "react-router-dom";
import {venues} from "../data/venues";

function VenueDetails(){
 const { id } = useParams();
 const venue = venues.find((venue)=>venue.id == Number(id));

  if (!venue) {
    return <h2 className="text-center text-2xl mt-10">Venue not found</h2>;
  }

 return(
   <section className="max-w-6xl mx-auto px-6 py-10">
      <img
        src={venue.image}
        alt={venue.name}
        className="w-full h-96 object-cover rounded-2xl mb-8"
      />

      <h1 className="text-4xl font-bold mb-4">{venue.name}</h1>

      <p className="text-gray-600 mb-2">📍 {venue.location}</p>
      <p className="text-gray-600 mb-2">👥 Capacity: {venue.capacity}</p>

      <p className="text-2xl font-bold text-blue-600 mb-4">
        ₹{venue.price}
      </p>
     <span
        className={
          venue.status?.toLowerCase() === "available"
            ? "inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6"
            : "inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6"
        }
      >
        {venue.status || "Not Available"}
      </span>
       <h2 className="text-2xl font-semibold mt-6 mb-3">Description</h2>
      <p className="text-gray-700 leading-7 mb-6">{venue.description}</p>

      <h2 className="text-2xl font-semibold mb-3">Amenities</h2>
      <ul className="list-disc list-inside text-gray-700 mb-8">
        {venue.amenities.map((amenity) => (
          <li key={amenity}>{amenity}</li>
        ))}
      </ul>

  <Link to={`/bookings/${venue.id}`} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
        Book Now
      </Link>
    </section>
  );
}

export default VenueDetails;