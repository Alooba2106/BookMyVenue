import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    if (searchTerm.trim() === "") {
      navigate("/venues");
      return;
    }

    navigate(`/venues?search=${searchTerm}`);
  }

  return (
    <section className="relative bg-gradient-to-r from-red-50 via-pink-50 to-red-50 py-10 overflow-hidden">
      <div className="mx-auto flex justify-center">
        
         <div className="flex items-center gap-3 w-[600px]">
           <input
  type="text"
  placeholder="Search venues or city..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="
    flex-1
    bg-white
    border
    border-gray-300
    rounded-xl
    px-4
    py-3
    text-gray-900
    placeholder:text-gray-500
    focus:outline-none
    focus:ring-2
    focus:ring-red-500
  "
/>

          <button
            onClick={handleSearch}
            className="rounded-xl bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

export default SearchSection;