import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Loader = () => (
  <div className="min-h-80 flex justify-center items-center bg-gray-100 p-4">
    <div className="flex items-center justify-center space-x-2">
      <div className="w-8 h-8 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      <div className="text-lg font-medium text-gray-700">Loading...</div>
    </div>
  </div>
);

const CategoryCard = ({ label, onClick }) => (
  <div
    className="bg-white p-4 rounded-lg shadow-md text-center cursor-pointer hover:bg-red-700 hover:text-white transition-all duration-300"
    onClick={onClick}
  >
    {label}
  </div>
);

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://fakestoreapi.com/products/categories"
        );
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-80 flex justify-center items-center bg-gray-100 p-4">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );

  return (
    <div className="p-4 bg-gray-100 h-fit">
      <div className="w-2/3 mx-auto">
        <h1 className="text-2xl font-semibold text-center mb-6">Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          <CategoryCard label="All" onClick={() => navigate("/")} />
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              label={category}
              onClick={() => navigate(`/category/${category}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
