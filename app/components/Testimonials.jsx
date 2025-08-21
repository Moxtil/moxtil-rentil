"use client";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      name: "John Smith",
      role: "Frequent Traveler",
      feedback:
        "Amazing service! The booking process was smooth and the car was in excellent condition. Highly recommended.",
      rating: 5,
    },
    {
      name: "Sophia Lee",
      role: "Business Professional",
      feedback:
        "Very reliable and transparent company. Customer support was very helpful and responsive.",
      rating: 4,
    },
    {
      name: "Michael Johnson",
      role: "Family Trip",
      feedback:
        "We had a wonderful experience. The car was clean and the whole process was hassle-free.",
      rating: 5,
    },
  ];

  return (
    <div className="w-full mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center text-white mb-12"
      >
        What Our Clients Say
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6 w-full">
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-4 relative"
          >
            <FaQuoteLeft className="text-blue-400 text-3xl absolute top-2 left-2 opacity-50 z-[1000]" />
            <p className="text-gray-300 italic mb-4">"{item.feedback}"</p>
            <div className="flex items-center mb-4">
              {[...Array(item.rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 mr-1" />
              ))}
            </div>
            <h2 className="text-lg font-semibold text-white">{item.name}</h2>
            <p className="text-sm text-gray-400">{item.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
