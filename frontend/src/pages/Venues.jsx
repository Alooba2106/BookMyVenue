import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VenueCard from "../components/venue/VenueCard";



function Venues() {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchTerm(searchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    async function fetchVenues() {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venues`);
      const data = await response.json();
      setVenues(data);
    }

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue) => {
    const search = searchTerm.toLowerCase();

    return (
      venue.name.toLowerCase().includes(search) ||
      venue.location.toLowerCase().includes(search) ||
      venue.category?.toLowerCase().includes(search)
    );
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Explore Venues</h1>

      <input
        type="text"
        placeholder="Search venues..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {filteredVenues.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-6">No venues found</p>
      )}
    </section>
  );
}

export default Venues;