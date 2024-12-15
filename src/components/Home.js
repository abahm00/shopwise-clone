import React from "react";
import Navbar from "./Navbar";
import Productpage from "./Productpage";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      <Outlet />
      <Footer />
    </>
  );
}
