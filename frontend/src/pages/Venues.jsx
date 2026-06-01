import { useState } from "react";
import { venues } from "../data/venues";
import VenueCard from "../components/venue/VenueCard";

function Venues(){

  const [searchTerm,setSearchTerm] = useState("");
  const filteredVenues = venues.filter((venue)=>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())||
    venue.location.toLowerCase().includes(searchTerm.toLowerCase()));

    return(
       <section className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Explore Venues</h1>

      <input
        type="text"
        placeholder="Search venues..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-8 
focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
       {filteredVenues.length>0?(
        <div className="grid md:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
       ) : (
        <p className="text-gray-500">No venues found</p>
       )}
       
      </section>
    );


}



export default Venues;