import { Link, useNavigate } from "react-router-dom";

function OwnerDashboard() {
  

 
  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Owner Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your venues, bookings and account.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/owner/venues">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition cursor-pointer">
              <div className="text-4xl mb-4">🏢</div>

              <h2 className="text-xl font-semibold mb-2">
                My Venues
              </h2>

              <p className="text-gray-500">
                View and manage your venues.
              </p>
            </div>
          </Link>

          <Link to="/owner/add-venue">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition cursor-pointer">
              <div className="text-4xl mb-4">➕</div>

              <h2 className="text-xl font-semibold mb-2">
                Add Venue
              </h2>

              <p className="text-gray-500">
                Create a new venue listing.
              </p>
            </div>
          </Link>

          <Link to="/owner/bookings">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition cursor-pointer">
              <div className="text-4xl mb-4">📅</div>

              <h2 className="text-xl font-semibold mb-2">
                View Bookings
              </h2>

              <p className="text-gray-500">
                Check all bookings for your venues.
              </p>
            </div>
          </Link>
        </div>

        
      </div>
    </section>
  );
}

export default OwnerDashboard;