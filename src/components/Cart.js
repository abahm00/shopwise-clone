import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const navigate = useNavigate();

  return (
    <div
      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
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
          <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
        )}
        {item.category !== "jewelery" && item.category !== "electronics" && (
          <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>
        )}
      </div>
      <div className="flex items-center space-x-2 pr-2 sm:pr-4 mt-2 sm:mt-0">
        <button
          onClick={() =>
            onQuantityChange(
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
            onQuantityChange(
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
        onClick={() => onRemove(item.id, item.selectedSize, item.selectedColor)}
        className="text-red-600 hover:text-red-700 mt-2 sm:mt-0"
      >
        <FontAwesomeIcon icon={faTrash} size="lg" />
      </button>
    </div>
  );
};

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (user) {
          const { data } = await axios.get(
            `https://rebel-fishy-airship.glitch.me/users/${user.id}`
          );
          setCart(data.cart || []);
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart")) || [];
          setCart(localCart);
        }
      } catch {
        setError("Failed to fetch cart items.");
      }
    };

    fetchCart();
  }, [user]);

  const handleQuantityChange = async (productId, size, color, quantity) => {
    const updatedCart = cart.map((item) =>
      item.id === productId &&
      item.selectedSize === size &&
      item.selectedColor === color
        ? { ...item, quantity }
        : item
    );
    setCart(updatedCart);
    try {
      user
        ? await axios.patch(
            `https://rebel-fishy-airship.glitch.me/users/${user.id}`,
            { cart: updatedCart }
          )
        : localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch {
      setError("Failed to update cart.");
    }
  };

  const handleRemoveItem = async (productId, size, color) => {
    const updatedCart = cart.filter(
      (item) =>
        !(
          item.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        )
    );
    setCart(updatedCart);
    try {
      user
        ? await axios.patch(
            `https://rebel-fishy-airship.glitch.me/users/${user.id}`,
            { cart: updatedCart }
          )
        : localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch {
      setError("Failed to remove item.");
    }
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
              <CartItem
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-center sm:justify-end">
          <button
            onClick={() =>
              cart.length > 0
                ? alert("Checking out!")
                : alert("Your cart is empty!")
            }
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
