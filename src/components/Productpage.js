import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, category } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://fakestoreapi.com/products");
        setData(response.data);

        let filtered = response.data;
        if (searchQuery) {
          filtered = filtered.filter((product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (category) {
          filtered = filtered.filter(
            (product) =>
              product.category.toLowerCase() === category.toLowerCase()
          );
        }

        setFilteredData(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, category]);

  if (loading) {
    return (
      <div className="min-h-80 flex justify-center items-center bg-gray-100 p-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-fit flex justify-center bg-gray-100 p-4">
      <div className="w-full sm:w-2/3 lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredData.length === 0 ? (
          <div className="text-center col-span-4 text-lg font-medium">
            No products found.
          </div>
        ) : (
          filteredData.map((product) => (
            <div
              key={product.id}
              className="p-4 shadow-md flex flex-col bg-white rounded-lg"
            >
              <div className="flex-grow">
                <img
                  onClick={() => navigate(`/description/${product.id}`)}
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-contain rounded-md cursor-pointer"
                />
              </div>

              <div className="mt-4">
                <a
                  onClick={() => navigate(`/description/${product.id}`)}
                  className="block font-semibold mb-2 hover:text-red-600 cursor-pointer transition-all duration-150"
                >
                  {product.title}
                </a>
                <span className="text-red-600 text-lg font-medium">
                  ${product.price}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
