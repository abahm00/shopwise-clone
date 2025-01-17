import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ProductDescription() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        setError("Failed to fetch product details.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (
        !product ||
        (!selectedSize && product.category !== "electronics") ||
        (product.category === "jewelery" && !selectedSize) ||
        (!selectedColor &&
          product.category !== "electronics" &&
          product.category !== "jewelery")
      ) {
        alert("Please select the required options.");
        return;
      }

      const cartItem = {
        ...product,
        quantity,
        selectedSize,
        selectedColor,
      };

      if (user) {
        const userResponse = await axios.get(
          "https://rebel-fishy-airship.glitch.me/users",
          {
            params: { email: user.email },
          }
        );

        const currentUser = userResponse.data[0];

        const existingItem = currentUser.cart.find(
          (item) =>
            item.id === product.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          currentUser.cart.push(cartItem);
        }

        await axios.patch(
          `https://rebel-fishy-airship.glitch.me/users/${currentUser.id}`,
          {
            cart: currentUser.cart,
          }
        );

        alert("Product added to cart!");
      } else {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingItem = savedCart.find(
          (item) =>
            item.id === product.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          savedCart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(savedCart));

        alert("Product added to cart!");
      }
    } catch (err) {
      setError("Failed to add product to cart.");
    }
  };

  // Helper function for generating size options
  const generateSizeOptions = () => {
    if (product.category === "jewelery") {
      return Array.from({ length: 6 }, (_, i) => 19 + i);
    }
    return ["S", "M", "L", "XL"];
  };

  // Helper function for generating color options
  const generateColorOptions = () => {
    return ["red", "blue", "green", "black"];
  };

  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!product)
    return (
      <div className="min-h-80 flex justify-center items-center bg-gray-100 p-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    );

  return (
    <div className="h-fit flex justify-center bg-gray-100 p-4">
      <div className="w-full sm:w-2/3 lg:w-3/4 p-4 shadow-md bg-white rounded-lg">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-96 object-contain rounded-md"
        />
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">{product.title}</h2>
          <p className="mt-2">{product.description}</p>
          <p className="mt-2 text-sm text-gray-600">
            <strong>Category:</strong> {product.category}
          </p>
          <span className="text-red-600 text-lg mt-4 block">
            ${product.price}
          </span>

          {/* Size Selection */}
          {product.category !== "electronics" && (
            <div className="mt-4">
              <label htmlFor="size" className="mr-2 text-gray-700">
                Size:
              </label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="">Select Size</option>
                {generateSizeOptions().map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Color Selection */}
          {product.category !== "electronics" &&
            product.category !== "jewelery" && (
              <div className="mt-4">
                <label htmlFor="color" className="mr-2 text-gray-700">
                  Color:
                </label>
                <select
                  id="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="">Select Color</option>
                  {generateColorOptions().map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {/* Quantity Selection */}
          <div className="mt-4">
            <label htmlFor="quantity" className="mr-2 text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 p-2 border rounded-lg"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={
              !product ||
              error ||
              (product.category !== "electronics" && !selectedSize) ||
              (product.category !== "electronics" &&
                product.category !== "jewelery" &&
                !selectedColor)
            }
            className={`mt-4 text-white font-medium rounded-lg text-sm px-6 py-2 ${
              !product ||
              error ||
              (product.category !== "electronics" && !selectedSize) ||
              (product.category !== "electronics" &&
                product.category !== "jewelery" &&
                !selectedColor)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-700 hover:bg-red-800"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
