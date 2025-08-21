"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const WelcomingAnimation = ({ children }) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 z-50 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src={
                "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3VidzM1dXdpdTMzZmU5cDFxbnQ4ZHQ0MzlzaGNuZWhzOWM2dnY5OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mjTpgz6FGNVDoMg5lx/giphy.gif"
              }
              alt={`Rentil`}
              className="absolute w-screen h-screen object-cover drop-shadow-2xl"
              initial={{ x: "0%", y: 0, scale: 1 }}
              animate={{ x: "0%", y: 0, scale: 1.3 }}
              transition={{ duration: 3, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${showIntro ? "hidden" : "block"}`}>{children}</div>
    </>
  );
};
