"use client";

import { motion } from "framer-motion";
import { FaSearchLocation, FaCar, FaRoad } from "react-icons/fa";

export const HowItWorks = () => {
  const steps = [
    {
      title: "Search Cars",
      desc: "Enter your location and dates to find available cars instantly.",
      icon: <FaSearchLocation className="text-5xl text-blue-500" />,
    },
    {
      title: "Choose & Book",
      desc: "Pick the perfect car for your trip and confirm your booking in seconds.",
      icon: <FaCar className="text-5xl text-green-500" />,
    },
    {
      title: "Drive & Enjoy",
      desc: "Pick up your car and hit the road — stress-free and reliable.",
      icon: <FaRoad className="text-5xl text-purple-500" />,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          How Rentil Works
        </h2>
        <p className="mt-4 text-gray-300">
          Renting a car with Rentil is fast, easy, and hassle-free.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-md shadow-lg hover:scale-105 transition-transform"
            >
              <div className="flex justify-center">{step.icon}</div>
              <h3 className="mt-6 text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-gray-300">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
