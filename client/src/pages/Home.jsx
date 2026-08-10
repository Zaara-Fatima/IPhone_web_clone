import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Highlights } from "../components/Highlights";
import { Modal } from "../components/Modal";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Highlights />
      <Modal />
      <Features />
      <Footer />
    </div>
  );
};
