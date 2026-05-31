import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-blue-600">
          BookMyVenue
        </h1>

        <div className="flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/venues">Venues</Link>
          <Link to="/login">Login</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;