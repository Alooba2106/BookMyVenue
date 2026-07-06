import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold">
            Book<span className="text-red-500">My</span>Venue
          </h3>

          <p className="text-gray-400 mt-3 leading-relaxed">
            Find and book the perfect venue for weddings,
            birthdays, conferences, exhibitions and special events.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Quick Links</h4>

          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link to="/venues" className="hover:text-white">
                Venues
              </Link>
            </li>

            <li>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Categories</h4>

          <ul className="space-y-2 text-gray-400">
            <li>Wedding Halls</li>
            <li>Birthday Parties</li>
            <li>Conferences</li>
            <li>Team Meetups</li>
            <li>Exhibitions</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Contact</h4>

          <ul className="space-y-2 text-gray-400">
            <li>support@bookmyvenue.com</li>
            <li>+91 98765 43210</li>
            <li>Kochi, Kerala</li>
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 py-4">
        <p className="text-center text-gray-500 text-sm">
          © 2026 BookMyVenue. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;