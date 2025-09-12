"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const Premium = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white"
        >
          Our Premium Fleet
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl shadow-lg shadow-gray-700"
          >
            <Image
              width={400}
              height={250}
              src="https://images.unsplash.com/photo-1694575341005-10a3e9400a58?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Lamborghini Aventador"
              className="object-cover w-full h-64"
            />
            <div className="opacity-30 hover:opacity-0 transition-all absolute inset-0 bg-gray-900 flex items-center justify-center text-white text-xl font-semibold">
              Lamborghini Aventador
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl shadow-lg shadow-gray-700"
          >
            <Image
              width={400}
              height={250}
              src="https://images.unsplash.com/photo-1708063786219-15a48cfac1d3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Ferrari 488 gtb"
              className="object-cover w-full h-64"
            />
            <div className="opacity-30 hover:opacity-0 transition-all absolute inset-0 bg-gray-900 flex items-center justify-center text-white text-xl font-semibold">
              Ferrari 488 gtb
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl shadow-lg shadow-gray-700"
          >
            <Image
              width={400}
              height={250}
              src="https://images.unsplash.com/photo-1611651338412-8403fa6e3599?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Ferrari 488 gtb"
              className="object-cover w-full h-64"
            />
            <div className="opacity-30 hover:opacity-0 transition-all absolute inset-0 bg-gray-900 flex items-center justify-center text-white text-xl font-semibold">
              Porsche 911 Turbo
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
