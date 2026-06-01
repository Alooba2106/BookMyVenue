import VenueCard from "./VenueCard";
import { venues } from "../../data/venues";


function FeaturedVenues() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      <h2 className="text-3xl font-bold text-center mb-10">
        Featured Venues
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
          />
        ))}
      </div>

    </section>
  );
}

export default FeaturedVenues;