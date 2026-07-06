import { Link } from "react-router-dom";

function BookingSuccess() {
  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Booking Confirmed!
        </h1>

        <p className="text-gray-600 mb-6">
          Your advance payment was successful and your venue slot has been booked.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/my-bookings"
            className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition"
          >
            View My Bookings
          </Link>

          <Link
            to="/venues"
            className="w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Browse More Venues
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BookingSuccess;