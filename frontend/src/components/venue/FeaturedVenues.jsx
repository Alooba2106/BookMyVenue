import { useEffect, useState } from "react";
import VenueCard from "./VenueCard";

function FeaturedVenues() {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    async function fetchVenues() {
      const response = await fetch("http://localhost:8000/venues");
      const data = await response.json();
      setVenues(data.slice(0, 6));
    }

    fetchVenues();
  }, []);

  return (
      <section className="max-w-7xl mx-auto px-6 py-6">
      <h2 className="text-xl font-bold text-center mb-6">
        Featured Venues
      </h2>

      {venues.length > 0 ? (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No venues found</p>
      )}
    </section>
  );
}

export default FeaturedVenues;