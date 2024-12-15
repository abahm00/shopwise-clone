import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Productpage from "./components/Productpage";
import Login from "./components/Login";
import Cart from "./components/Cart";
import Signup from "./components/Signup";
import ProductDescription from "./components/ProductDescription";
import ForgotPassword from "./components/ForgotPassword";
import PageNotFound from "./components/PageNotFound";
import CategoriesPage from "./components/CategoriesPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 w-full">
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Productpage />} />
            <Route path="/category" element={<CategoriesPage />} />
            <Route path="/category/:category" element={<Productpage />} />
            <Route path="Home" element={<Productpage />} />
            <Route path="Login" element={<Login />} />
            <Route path="Signup" element={<Signup />} />
            <Route path="Cart" element={<Cart />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/search/:searchQuery" element={<Productpage />} />
            <Route path="/description/:id" element={<ProductDescription />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
