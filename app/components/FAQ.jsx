"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export const FAQSection = () => {
  const faqs = [
    {
      question: "What documents do I need to rent a car?",
      answer:
        "You need a valid driver's license, a government-issued ID, and a payment method.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes! You can cancel your booking up to 24 hours before pick-up without any fee.",
    },
    {
      question: "Is insurance included?",
      answer:
        "Basic insurance is included in all rentals. You can also purchase additional coverage.",
    },
    {
      question: "Are there any age restrictions?",
      answer:
        "Renters must be at least 21 years old. Some premium vehicles require 25+.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-gray-300">
          Everything you need to know about renting with Rentil.
        </p>

        <div className="mt-12 flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 cursor-pointer shadow-lg"
              onClick={() => toggleFAQ(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  {faq.question}
                </h3>
                <span className="text-white">
                  {openIndex === i ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.p
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-gray-300 text-left"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
