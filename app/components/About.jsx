"use client";
import { motion } from "framer-motion";
import { FaUserTie, FaRocket, FaHandshake } from "react-icons/fa";
import { BsFillRocketTakeoffFill, BsStarFill } from "react-icons/bs";

export default function AboutPage() {
  const aboutData = [
    {
      title: "Our Mission",
      description:
        "We aim to provide the best car rental experience with transparency and comfort for all our users.",
      icon: (
        <BsFillRocketTakeoffFill className="text-4xl text-indigo-400 mb-4" />
      ),
    },
    {
      title: "Our Values",
      description:
        "Trust, reliability, and customer satisfaction are at the core of everything we do.",
      icon: <FaHandshake className="text-4xl text-indigo-400 mb-4" />,
    },
    {
      title: "Our Team",
      description:
        "A passionate group of professionals dedicated to making your journey smoother and stress-free.",
      icon: <FaUserTie className="text-4xl text-indigo-400 mb-4" />,
    },
    {
      title: "Our Quality",
      description:
        "We constantly improve our services to ensure excellence and innovation in every ride.",
      icon: <BsStarFill className="text-4xl text-indigo-400 mb-4" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <motion.h1
        className="text-4xl font-bold text-center text-white mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Us
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {aboutData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-4 relative"
          >
            {item.icon}
            <h2 className="text-xl font-semibold mb-2 text-white">
              {item.title}
            </h2>
            <p className="text-gray-300">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
