
import Hero from "../components/common/Hero";
import FeaturedVenues from "../components/venue/FeaturedVenues";
import CategorySection from "../components/venue/CategorySection";
import SearchSection from "../components/venue/SearchSection";

function Home() {
  return (
    <>
    
    
  <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-pink-50">
    <Hero />
  

    {/* Decorative Circle Top Left */}
    <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-100 rounded-full opacity-40"></div>

    {/* Decorative Circle Bottom Right */}
    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-100 rounded-full opacity-30"></div>

    {/* Diagonal Shape */}
    <div className="absolute top-0 right-0 w-1/2 h-full bg-red-50 rotate-[-12deg] origin-top-right opacity-40"></div>
  </div>
      <SearchSection />
  <CategorySection />
  <FeaturedVenues />
</>
     
    
      
  
  );
}

export default Home;