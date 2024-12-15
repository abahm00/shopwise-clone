import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-center sm:text-left">
              © {new Date().getFullYear()} All Rights Reserved by Bestwebcreator
            </p>
          </div>

          <div className="flex space-x-6">
            <Link
              className="text-sm hover:text-gray-400 cursor-pointer transition duration-300"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-sm hover:text-gray-400 cursor-pointer transition duration-300"
              aria-label="Terms of Service"
            >
              Terms of Service
            </Link>
            <Link
              className="text-sm hover:text-gray-400 cursor-pointer transition duration-300"
              aria-label="Contact Us"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
