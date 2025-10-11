import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">
        SASTA MMT
      </Link>

      <ul className="flex space-x-6 items-center">
        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="bg-secondary px-4 py-2 rounded hover:bg-white hover:text-primary transition"
          >
            Login
          </button>
        ) : (
          <div className="relative">
            <FaUserCircle
              size={30}
              className="cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-primary rounded shadow-lg">
                <ul>
                  <li>
                    <Link
                      to="/MyAccount"
                      className="px-4 py-2 hover:bg-primary hover:text-white block"
                    >
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/MyTrip"
                      className="px-4 py-2 hover:bg-primary hover:text-white block"
                    >
                      My Trips
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="px-4 py-2 hover:bg-primary hover:text-white block"
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
