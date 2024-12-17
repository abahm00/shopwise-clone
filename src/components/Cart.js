import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch cart data from the server or localStorage based on the user
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `https://rebel-fishy-airship.glitch.me/users/${user.id}`
          );
          setCart(response.data.cart); // Update cart with server data
        } catch (err) {
          setError("Failed to fetch cart items.");
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(localCart); // Use localStorage for unauthenticated users
      }
    };

    fetchCart(); // Trigger fetch only once when the component mounts
  }, [user]); // Dependency array ensures it runs when 'user' changes

  const handleCheckout = () => {
    if (cart.length > 0) {
      alert("Checking out!");
    } else {
      alert("Your cart is empty!");
    }
  };

  const handleQuantityChange = async (
    productId,
    selectedSize,
    selectedColor,
    newQuantity
  ) => {
    const updatedCart = cart.map((item) =>
      item.id === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(updatedCart); // Update cart state

    // Update cart in localStorage or backend (for authenticated users)
    if (user) {
      try {
        await axios.patch(
          `https://rebel-fishy-airship.glitch.me/users/${user.id}`,
          {
            cart: updatedCart,
          }
        );
      } catch (err) {
        setError("Failed to update cart on server.");
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage for unauthenticated users
    }
  };

  const handleRemoveItem = async (productId, selectedSize, selectedColor) => {
    const updatedCart = cart.filter(
      (item) =>
        !(
          item.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        )
    );

    // Update state and localStorage immediately
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (user) {
      try {
        await axios.patch(
          `https://rebel-fishy-airship.glitch.me/users/${user.id}`,
          {
            cart: updatedCart,
          }
        );
      } catch (err) {
        setError("Failed to remove item from cart on server.");
      }
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="h-fit flex justify-center bg-gray-100 p-4">
      <div className="w-full sm:w-full md:w-2/3 lg:w-3/4 p-4 shadow-lg bg-white rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Your Cart</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} // Unique key for each item
                className="flex flex-col sm:flex-row items-center justify-between p-4 border-b"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-contain mb-4 sm:mb-0 cursor-pointer"
                  onClick={() => navigate(`/description/${item.id}`)}
                />
                <div className="flex-grow pl-4 sm:pl-6">
                  <p
                    className="font-semibold cursor-pointer"
                    onClick={() => navigate(`/description/${item.id}`)}
                  >
                    {item.title}
                  </p>
                  <span className="text-red-600">${item.price}</span>
                  {item.category !== "electronics" && (
                    <p className="text-sm text-gray-600">
                      Size: {item.selectedSize}
                    </p>
                  )}

                  {item.category !== "jewelery" &&
                    item.category !== "electronics" && (
                      <p className="text-sm text-gray-600">
                        Color: {item.selectedColor}
                      </p>
                    )}
                </div>

                <div className="flex items-center space-x-2 pr-2 sm:pr-4 mt-2 sm:mt-0">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.id,
                        item.selectedSize,
                        item.selectedColor,
                        item.quantity - 1
                      )
                    }
                    disabled={item.quantity <= 1}
                    className="w-5 h-5 text-white bg-red-600 rounded-sm hover:bg-red-700 flex justify-center items-center"
                  >
                    -
                  </button>
                  <span className="w-4 text-center text-lg font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.id,
                        item.selectedSize,
                        item.selectedColor,
                        item.quantity + 1
                      )
                    }
                    className="w-5 h-5 text-white bg-red-600 rounded-sm hover:bg-red-700 flex justify-center items-center"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleRemoveItem(
                      item.id,
                      item.selectedSize,
                      item.selectedColor
                    )
                  }
                  className="text-red-600 hover:text-red-700 mt-2 sm:mt-0"
                >
                  <FontAwesomeIcon icon={faTrash} size="lg" className="mr-2" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center sm:justify-end">
          <button
            onClick={handleCheckout}
            className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-all"
          >
            Proceed to Checkout
          </button>
        </div>

        {cart.length > 0 && (
          <div className="mt-6 sm:text-right text-center font-semibold text-lg">
            <p>Total: ${calculateTotal().toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
