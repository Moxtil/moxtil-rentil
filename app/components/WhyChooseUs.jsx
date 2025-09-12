"use client";

import { motion } from "framer-motion";
import { FaDollarSign, FaHeadset, FaCarAlt, FaClock } from "react-icons/fa";

export const WhyChooseUs = () => {
  const benefits = [
    {
      title: "Affordable Rates",
      desc: "Get the best daily rates with no hidden fees.",
      icon: <FaDollarSign className="text-5xl text-green-400" />,
    },
    {
      title: "24/7 Support",
      desc: "Our team is always ready to help you on the road.",
      icon: <FaHeadset className="text-5xl text-blue-400" />,
    },
    {
      title: "Wide Vehicle Selection",
      desc: "From economy cars to luxury SUVs — we’ve got you covered.",
      icon: <FaCarAlt className="text-5xl text-yellow-400" />,
    },
    {
      title: "Quick & Easy Booking",
      desc: "Reserve your car in just a few clicks.",
      icon: <FaClock className="text-5xl text-purple-400" />,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Why Choose Rentil?
        </h2>
        <p className="mt-4 text-gray-300">
          We make car rentals simple, affordable, and reliable.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {benefits.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-md shadow-lg hover:scale-105 transition-transform"
            >
              <div className="flex justify-center">{item.icon}</div>
              <h3 className="mt-6 text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
