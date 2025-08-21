"use client";
// context/AOSContext.js
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AosContext = ({ children }) => {
  useEffect(() => {
    AOS.init({
      duration: 1150,
      once: false,
    });
  }, []);

  return children;
};
