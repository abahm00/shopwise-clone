import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
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
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 w-full">
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Productpage />} />
            <Route path="Home" element={<Productpage />} />
            <Route path="category" element={<CategoriesPage />} />
            <Route path="category/:category" element={<Productpage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="cart" element={<Cart />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="search/:searchQuery" element={<Productpage />} />
            <Route path="description/:id" element={<ProductDescription />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
