"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import { FaCarOn } from "react-icons/fa6";
export default function Navbar() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const { user } = useUser();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchInput)}`);
      setSearchInput("");
      setMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[2000] shadow-lg bg-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/browse"
          className="text-2xl font-bold text-white hover:text-indigo-400 transition-colors flex items-center gap-1"
        >
          <FaCarOn size={24} className="-mt-1" />
          Rentil
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/browse"
            className={`${
              path === "/browse" ? "text-indigo-400" : "text-white"
            }  hover:text-indigo-400 transition-all font-medium`}
          >
            Browse
          </Link>
          <Link
            href="/dashboard"
            className={`${
              path === "/dashboard" ? "text-indigo-400" : "text-white"
            }  hover:text-indigo-400 transition-all font-medium`}
          >
            Dashboard
          </Link>

          <Link
            href="/contact"
            className={`${
              path === "/contact" ? "text-indigo-400" : "text-white"
            }  hover:text-indigo-400 transition-all font-medium`}
          >
            Contact
          </Link>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
            >
              <FiSearch size={20} />
            </button>
          </form>
          {!user && (
            <div>
              <Link
                href="/sign-up"
                className="inline-block mx-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition border-2 border-transparent"
              >
                Sign Up
              </Link>
              <Link
                href="/sign-in"
                className="inline-block mx-2 px-5 py-2 bg-gray-700 hover:bg-gray-800 hover:border-white border-2 border-transparent text-white rounded-lg transition"
              >
                Login
              </Link>
            </div>
          )}
          <UserButton
            afterSignOutUrl="/browse"
            appearance={{
              elements: {
                userButtonPopoverCard: "shadow-lg border border-gray-200",
                userButtonAvatarBox: "ring-2 ring-indigo-500 w-[50px] h-[50px]",
              },
            }}
          />
        </div>

        {/* Mobile Menu Buttons */}
        <div className="lg:hidden flex flex-row-reverse items-center gap-1">
          <button onClick={() => setMenuOpen(!menuOpen)} className=" mx-3">
            {menuOpen ? (
              <FiX className="text-white text-2xl" />
            ) : (
              <FiMenu className="text-white text-2xl" />
            )}
          </button>

          {user && (
            <div>
              <UserButton
                afterSignOutUrl="/browse"
                appearance={{
                  elements: {
                    userButtonPopoverCard: "shadow-lg border border-gray-200",
                    userButtonAvatarBox:
                      "ring-2 ring-blue-500 w-[50px] h-[50px]",
                  },
                }}
              />
            </div>
          )}
          {!user && (
            <Link
              href="/sign-up"
              className=" mx-2 px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition border-2 border-transparent"
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-gray-800 px-6 py-4 flex flex-col gap-4 shadow-lg z-[2000] border-b-[3px] border-white"
          >
            <Link
              href="/browse"
              className={`${
                path === "/browse" ? "text-indigo-400" : "text-white"
              } hover:text-indigo-400 transition-all font-medium`}
              onClick={() => setMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              href="/dashboard"
              className={`${
                path === "/dashboard" ? "text-indigo-400" : "text-white"
              } hover:text-indigo-400 transition-all font-medium`}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              href="/contact"
              className={`${
                path === "/contact" ? "text-indigo-400" : "text-white"
              } hover:text-indigo-400 transition-all font-medium`}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            {!user && (
              <div>
                <Link
                  href="/sign-in"
                  className="inline-block px-5 py-2 bg-gray-700 hover:bg-gray-800 hover:border-white border-2 border-transparent text-white rounded-lg transition"
                >
                  Login
                </Link>
              </div>
            )}
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mt-2">
              <input
                type="text"
                placeholder="Search cars..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <FiSearch size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
