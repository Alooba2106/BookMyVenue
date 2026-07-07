import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OwnerVenuesPage() {
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOwnerVenues() {
      const ownerId = localStorage.getItem("ownerId");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/owners/${ownerId}/venues`
      );

      const data = await response.json();
      setVenues(data);
    }

    fetchOwnerVenues();
  }, []);

  async function handleDelete(venueId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue?"
    );

    if (!confirmDelete) return;

    const ownerId = localStorage.getItem("ownerId");

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/owners/${ownerId}/venues/${venueId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setVenues(venues.filter((venue) => venue.id !== venueId));
    } else {
      alert("Unable to delete venue");
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Venues
            </h1>
            <p className="text-gray-500 mt-2">
              Manage all venues listed by you.
            </p>
          </div>

          <button
            onClick={() => navigate("/owner/add-venue")}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 transition"
          >
            Add New Venue
          </button>
        </div>

        {venues.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-500 mb-4">
              No venues added yet.
            </p>

            <button
              onClick={() => navigate("/owner/add-venue")}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
            >
              Add Your First Venue
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
              >
                {venue.image && (
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {venue.name}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {venue.location}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-gray-600">
                    <p>Category: {venue.category}</p>
                    <p>Price: ₹{venue.price}</p>
                    <p>Capacity: {venue.capacity}</p>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() =>
                        navigate(`/owner/edit-venue/${venue.id}`)
                      }
                      className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 font-semibold text-white hover:bg-black transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(venue.id)}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/owner/venues/${venue.id}/slots`)
                    }
                    className="mt-3 w-full rounded-xl border border-red-600 px-4 py-2.5 font-semibold text-red-600 hover:bg-blue-50 transition"
                  >
                    Manage Slots
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default OwnerVenuesPage;