"use client";
import { motion } from "framer-motion";
import Image from "next/image";
export default function GallerySection() {
  const cars = [
    {
      name: "BMW i8",
      img: "https://images.unsplash.com/photo-1667551181687-e3eb9babf037?w=800",
      price: "$120,000",
    },
    {
      name: "Mercedes AMG",
      img: "https://images.unsplash.com/photo-1617814065893-00757125efab?w=800",
      price: "$150,000",
    },
    {
      name: "Porsche 911",
      img: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=800",
      price: "$140,000",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12"
        >
          Featured Cars
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {cars.map((car, i) => (
            <motion.div
              key={i}
              transition={{ duration: 0.3 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
              <Image
                width={300}
                height={300}
                src={car.img}
                alt={car.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {car.name}
                </h3>
                <p className="text-indigo-400 font-bold text-lg">{car.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
