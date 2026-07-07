import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function BookingForm() {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [guests, setGuests] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    async function fetchBlockedDates() {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${venueId}/blocked-dates`
      );
      const data = await response.json();
      setBlockedDates(data.map((item) => new Date(item.blocked_date)));
    }

    fetchBlockedDates();
  }, [venueId]);

  useEffect(() => {
    if (!eventDate) {
      setSlots([]);
      return;
    }

    const formattedDate = eventDate.toISOString().split("T")[0];

    async function fetchSlots() {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${venueId}/slots-with-status?event_date=${formattedDate}`
      );
      const data = await response.json();
      setSlots(data);
    }

    fetchSlots();
  }, [venueId, eventDate]);

  useEffect(() => {
    setSelectedSlotId("");
  }, [eventDate]);

 async function handleSubmit(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    alert("Please login first to book this venue");
    navigate("/login");
    return;
  }

  if (name.trim() === "") return alert("Name is Required");
  if (email.trim() === "" || !email.includes("@")) return alert("Enter a valid email");
  if (phone.trim().length < 10) return alert("Phone number must be 10 digits.");
  if (!eventDate) return alert("Event date is required");
  if (Number(guests) <= 0) return alert("Number of guests must be greater than 0");
  if (!selectedSlotId) return alert("Please select a slot");

  const formattedDate = eventDate.toISOString().split("T")[0];

  const bookingData = {
    venue_id: Number(venueId),
    slot_id: Number(selectedSlotId),
    event_date: formattedDate,
    guests: Number(guests),
    advance_amount: 5000,
  };

  const orderResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: 5000,
    }),
  });

  const orderData = await orderResponse.json();

  if (!orderResponse.ok) {
    alert(orderData.detail || "Failed to create payment order");
    return;
  }

  const options = {
  key: orderData.key,
  amount: orderData.amount,
  currency: orderData.currency,
  name: "BookMyVenue",
  description: "Venue Booking Advance Payment",
  order_id: orderData.order_id,

  prefill: {
    name: name,
    email: email,
    contact: phone,
  },

  theme: {
    color: "#dc2626",
  },

  handler: async function (response) {
  console.log("Payment success response:", response);
  console.log("Calling verify-payment...");

  const verifyResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      venue_id: Number(venueId),
      event_date: formattedDate,
      guests: Number(guests),
      amount: 5000,
      slot_id: Number(selectedSlotId),
    }),
  });

  const data = await verifyResponse.json();

  console.log("Verify status:", verifyResponse.status);
  console.log("Verify data:", data);

 if (verifyResponse.ok) {
  alert("Booking confirmed!");
  navigate("/booking-success");
} else {
    alert(data.detail || "Payment verification failed");
  }
},
};

const razorpay = new window.Razorpay(options);
razorpay.open();
 }
  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Booking
          </h1>
          <p className="text-gray-500 mt-2">
            Select your event date, slot and guest details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="number"
              placeholder="Number of Guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Date
            </label>

            <DatePicker
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              excludeDates={blockedDates}
              minDate={new Date()}
              placeholderText="Select event date"
              dateFormat="yyyy-MM-dd"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Select Slot
            </h3>

            {!eventDate && (
              <p className="rounded-xl bg-gray-100 px-4 py-3 text-gray-500">
                Please select an event date first.
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {slots.map((slot) => (
                <label
                  key={slot.id}
                  className={`border rounded-xl px-4 py-4 transition ${
                    slot.is_booked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : selectedSlotId === String(slot.id)
                      ? "border-red-600 bg-red-50 text-red-700 cursor-pointer"
                      : "border-gray-300 hover:border-red-500 cursor-pointer"
                  }`}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    disabled={slot.is_booked}
                    checked={selectedSlotId === String(slot.id)}
                    onChange={(e) => setSelectedSlotId(e.target.value)}
                    className="mr-2"
                  />

                  <span className="font-medium">
                    {slot.slot_name}
                  </span>

                  <span className="block text-sm mt-1">
                    {slot.start_time} - {slot.end_time}
                  </span>

                  {slot.is_booked && (
                    <span className="block mt-2 text-red-500 font-semibold">
                      Booked
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-red-50 border border-red-100 p-5">
            <p className="text-sm text-gray-600">Advance Amount</p>
            <p className="text-2xl font-bold text-red-600">₹5,000</p>
            
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </section>
  );
}
export default BookingForm;