import VenueCard from "./VenueCard";

const venues = [
  {
    id: 1,
    name: "Grand Auditorium",
    location: "Trivandrum",
    price: 25000,
    image: "https://picsum.photos/400/250?1"
  },
  {
    id: 2,
    name: "Royal Convention Center",
    location: "Kochi",
    price: 40000,
    image: "https://picsum.photos/400/250?2"
  },
  {
    id: 3,
    name: "City Event Hall",
    location: "Calicut",
    price: 18000,
    image: "https://picsum.photos/400/250?3"
  }
];

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