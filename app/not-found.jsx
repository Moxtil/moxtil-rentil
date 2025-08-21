"use client";

import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center"
      >
        <FaExclamationTriangle size={60} className="text-red-500 mb-6" />
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <Link
          href="/browse"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-all"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
