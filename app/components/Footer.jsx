"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaCarOn } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <FaCarOn className="text-blue-500 text-3xl" />
            <span className="text-2xl font-bold">Rentil</span>
          </div>
          <p className="text-gray-400">
            Rentil is your trusted car rental platform. Find, book, and enjoy
            your ride with ease.
          </p>
        </div>

        <div className="flex flex-col">
          <h3 className="font-bold text-xl mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/browse"
                className="hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/browse"
                className="hover:text-blue-400 transition-colors"
              >
                Cars
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-400 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h3 className="font-bold text-xl mb-4">Follow Us</h3>
          <div className="flex gap-4 mb-4 text-white">
            <Link href="#" className="hover:text-blue-400 transition-colors">
              <FaFacebookF size={20} />
            </Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">
              <FaTwitter size={20} />
            </Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">
              <FaInstagram size={20} />
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Rentil. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
