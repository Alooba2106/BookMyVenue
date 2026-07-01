import { useNavigate } from "react-router-dom";

function CategorySection() {
  const navigate = useNavigate();

  const categories = [
    "Wedding Hall",
    "Birthday Party",
    "Conference",
    "Exhibition",
    "Team Meetup",
  ];

  function handleCategoryClick(category) {
    navigate(`/venues?category=${encodeURIComponent(category)}`);
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-4">
      <h2 className="text-xl font-semibold text-center mb-5">
        Browse by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-800 shadow-sm hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition"
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;