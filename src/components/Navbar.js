import React, { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBars,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import logo from "../logo/logo_dark.png";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reset mobile menu state on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/Home");
    setIsMobileMenuOpen(false);
  }, [dispatch, navigate]);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const query = searchQuery.trim();
      navigate(query ? `/search/${query}` : "/");
      setIsMobileMenuOpen(false);
    },
    [searchQuery, navigate]
  );

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      setIsMobileMenuOpen(false);
    },
    [navigate]
  );

  return (
    <div className="h-fit bg-gray-200 p-2 shadow-md border-b border-gray-500 w-full">
      <div className="w-full flex justify-center mx-auto px-4 sm:px-6 lg:px-0">
        <div className="md:w-3/4 w-full flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => handleNavigation("/")}
            aria-label="Home"
          >
            <img src={logo} alt="Logo" className="h-10 sm:h-12" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleNavigation("/category")}
              className="text-gray-600 hover:text-red-700 transition-all duration-200"
              aria-label="Categories"
            >
              Categories
            </button>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-red-700 transition-all duration-300"
                placeholder="Search..."
                aria-label="Search"
              />
              <button
                type="submit"
                className="ml-2 text-gray-600 hover:text-red-700 transition-all duration-200"
                aria-label="Submit Search"
              >
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </button>
            </form>

            {/* Cart and Auth Buttons */}
            <FontAwesomeIcon
              icon={faCartShopping}
              size="lg"
              className="text-gray-600 cursor-pointer hover:text-red-700 transition-all duration-200"
              onClick={() => handleNavigation("/Cart")}
              aria-label="Cart"
            />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 transition-all delay-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/Login")}
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 transition-all delay-50"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-red-700 focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                size="lg"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-300">
          <div className="px-4 py-4 space-y-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center w-full"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-700 transition-all duration-300"
                placeholder="Search..."
                aria-label="Mobile Search"
              />
              <button
                type="submit"
                className="ml-2 text-gray-600 hover:text-red-700 transition-all duration-200"
                aria-label="Submit Mobile Search"
              >
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </button>
            </form>

            <button
              onClick={() => handleNavigation("/category")}
              className="w-full text-red-700 border border-red-700 font-medium rounded-lg text-sm px-4 py-2"
            >
              Categories
            </button>

            <button
              onClick={() => handleNavigation("/Cart")}
              className="w-full text-red-700 border border-red-700 font-medium rounded-lg text-sm px-4 py-2"
            >
              <FontAwesomeIcon
                icon={faCartShopping}
                size="lg"
                className="mr-2"
              />
              Cart
            </button>

            {isAuthenticated ? (
              <div>
                <p className="text-gray-600">Hello, {user.name}</p>
                <button
                  onClick={handleLogout}
                  className="w-full text-white border border-red-700 bg-red-700 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation("/Login")}
                className="w-full text-white border border-red-700 bg-red-700 font-medium rounded-lg text-sm px-4 py-2"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
