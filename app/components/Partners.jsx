"use client";

import { motion } from "framer-motion";
import {
  FaApple,
  FaGoogle,
  FaCcVisa,
  FaCcMastercard,
  FaStripe,
} from "react-icons/fa";

export const Partners = () => {
  const logos = [
    { icon: <FaApple className="text-5xl text-white" />, name: "Apple" },
    { icon: <FaGoogle className="text-5xl text-white" />, name: "Google" },
    { icon: <FaCcVisa className="text-5xl text-white" />, name: "Visa" },
    {
      icon: <FaCcMastercard className="text-5xl text-white" />,
      name: "MasterCard",
    },
    { icon: <FaStripe className="text-5xl text-white" />, name: "Stripe" },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Trusted By Leading Partners
        </h2>
        <p className="mt-4 text-gray-300">
          We collaborate with trusted brands to bring you the best car rental
          experience.
        </p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
          {logos.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center hover:scale-110 transition-transform"
              title={item.name}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
