"use client";

import { motion } from "framer-motion";

export const FinalCTA = () => {
  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white"
        >
          Ready to Hit the Road?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-300 max-w-2xl"
        >
          Book your car today with Rentil and enjoy a seamless, luxurious
          driving experience.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          href="#"
          className="mt-6 inline-block bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition-transform"
        >
          Book Now
        </motion.a>
      </div>
    </section>
  );
};
