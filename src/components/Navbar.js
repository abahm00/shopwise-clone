import React, { useState } from "react";
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

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/Home");
    setIsMobileMenuOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search/${query}`);
    } else {
      navigate("/search");
    }
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    navigate("/Cart");
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/Login");
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = () => {
    navigate("/category");
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-fit bg-gray-200 p-2 shadow-md border-b border-gray-500 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Logo" className="h-10 sm:h-12" />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleCategoryClick}
              className="text-gray-600 hover:text-red-700 transition-all duration-200"
            >
              Categories
            </button>

            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-red-700 transition-all duration-300"
                placeholder="Search..."
              />
              <button
                type="submit"
                className="ml-2 text-gray-600 hover:text-red-700 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </button>
            </form>

            <FontAwesomeIcon
              icon={faCartShopping}
              size="lg"
              className="text-gray-600 cursor-pointer hover:text-red-700 transition-all duration-200"
              onClick={handleCartClick}
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
                onClick={handleLoginClick}
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 transition-all delay-50"
              >
                Login
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-red-700 focus:outline-none"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                size="lg"
              />
            </button>
          </div>
        </div>
      </div>

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
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-700 transition-all duration-300"
                placeholder="Search..."
              />
              <button
                type="submit"
                className="ml-2 text-gray-600 hover:text-red-700 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </button>
            </form>

            <button
              onClick={handleCategoryClick}
              className="w-full text-red-700 border border-red-700 font-medium rounded-lg text-sm px-4 py-2"
            >
              Categories
            </button>

            <button
              onClick={handleCartClick}
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
                onClick={handleLoginClick}
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
