import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/venue.png";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative h-[420px] overflow-hidden">
      <img
        src={heroImage}
        alt="Venue"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* White overlay */}
      <div className="absolute inset-0 bg-white/70"></div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold text-gray-900">
          Find Your Perfect Venue
        </h1>

        <p className="mt-4 text-xl text-gray-700">
          Book wedding halls, conference venues and event spaces.
        </p>

        <button
          onClick={() => navigate("/venues")}
          className="mt-8 rounded-xl bg-red-600 px-10 py-4 font-semibold text-white hover:bg-red-700"
        >
          Explore Venues
        </button>
      </div>
    </section>
  );
}

export default Hero;