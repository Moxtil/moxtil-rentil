"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export const AppDownload = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-4xl font-bold text-white">
            Book Your Car On The Go
          </h2>
          <p className="mt-4 text-gray-300">
            Download the Rentil app and reserve your car anytime, anywhere.
            Fast, simple, and reliable.
          </p>

          <div className="mt-8 flex justify-center md:justify-start gap-4">
            <Link
              href="#"
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              <FaApple className="text-2xl" /> App Store
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              <FaGooglePlay className="text-2xl" /> Google Play
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex-1 flex justify-center"
        >
          <Image
            width={600}
            height={400}
            src="https://images.unsplash.com/photo-1593642634367-d91a135587b5"
            alt="Phone mockup"
            className="w-full rounded-lg shadow-2xl shadow-gray-700"
          />
        </motion.div>
      </div>
    </section>
  );
};
