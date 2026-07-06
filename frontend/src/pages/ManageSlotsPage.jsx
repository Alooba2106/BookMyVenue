import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ManageSlotsPage() {
  const { venueId } = useParams();

  const [slots, setSlots] = useState([]);
  const [slotName, setSlotName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  async function fetchSlots() {
    const response = await fetch(`http://localhost:8000/venues/${venueId}/slots`);
    const data = await response.json();
    setSlots(data);
  }

  useEffect(() => {
    fetchSlots();
  }, [venueId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!slotName.trim() || !startTime || !endTime) {
      alert("All fields are required");
      return;
    }

    if (startTime >= endTime) {
      alert("Start time must be before end time");
      return;
    }

    const newSlot = {
      venue_id: Number(venueId),
      slot_name: slotName.trim(),
      start_time: startTime,
      end_time: endTime,
    };

    const response = await fetch("http://localhost:8000/slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSlot),
    });

    if (response.ok) {
      alert("Slot added successfully");
      setSlotName("");
      setStartTime("");
      setEndTime("");
      fetchSlots();
    } else {
      const error = await response.json();
      alert(error.detail || "Failed to add slot");
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Slots</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-6 mb-8 space-y-4"
        >
          <input
            type="text"
            placeholder="Slot Name"
            value={slotName}
            onChange={(e) => setSlotName(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold"
          >
            Add Slot
          </button>
        </form>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Existing Slots</h2>

          {slots.length === 0 ? (
            <p className="text-gray-500">No slots added yet.</p>
          ) : (
            <div className="space-y-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="border rounded-xl p-4 flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{slot.slot_name}</p>
                    <p className="text-gray-500">
                      {slot.start_time} - {slot.end_time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ManageSlotsPage;