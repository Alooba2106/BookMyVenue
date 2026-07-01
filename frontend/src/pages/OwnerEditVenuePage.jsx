import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function OwnerEditVenuePage() {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      const response = await fetch(`http://localhost:8000/venues/${venueId}`);
      const data = await response.json();

      setName(data.name || "");
      setLocation(data.location || "");
      setCategory(data.category || "");
      setPrice(data.price || "");
      setCapacity(data.capacity || "");
      setAmenities(data.amenities || "");
      setImage(data.image || "");
      setDescription(data.description || "");
    }

    fetchVenue();
  }, [venueId]);

  async function handleSubmit(event) {
    event.preventDefault();

    const ownerId = localStorage.getItem("ownerId");

    const response = await fetch(
      `http://localhost:8000/owners/${ownerId}/venues/${venueId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner_id: Number(ownerId),
          name,
          location,
          category,
          amenities,
          price: Number(price),
          capacity: Number(capacity),
          status: true,
          image,
          description,
        }),
      }
    );

    if (response.ok) {
      alert("Venue updated successfully");
      navigate("/owner/venues");
    } else {
      alert("Failed to update venue");
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Venue
          </h1>
          <p className="text-gray-500 mt-2">
            Update venue details, amenities and image.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Venue Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Wedding Hall">Wedding Hall</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Conference">Conference</option>
              <option value="Exhibition">Exhibition</option>
              <option value="Team Meetup">Team Meetup</option>
            </select>

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              placeholder="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Amenities"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              className="md:col-span-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {image && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Image Preview
              </p>
              <img
                src={image}
                alt="Venue preview"
                className="h-56 w-full object-cover rounded-2xl border"
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-black-700 transition"
            >
              Update Venue
            </button>

            <button
              type="button"
              onClick={() => navigate("/owner/venues")}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default OwnerEditVenuePage;