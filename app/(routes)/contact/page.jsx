"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight"
            data-aos="fade-down"
          >
            Get in Touch
          </h1>
          <p className="text-gray-400" data-aos="fade-down">
            We’d love to hear from you! Whether you have a question, feedback,
            or just want to say hello, feel free to reach out.
          </p>

          <div className="space-y-3">
            <p className="text-lg" data-aos="fade-down">
              <span className="font-semibold">Email:</span> contact@example.com
            </p>
            <p className="text-lg" data-aos="fade-down">
              <span className="font-semibold">Phone:</span> +123 456 7890
            </p>
            <p className="text-lg" data-aos="fade-down">
              <span className="font-semibold">Location:</span> Istanbul, Turkey
            </p>
          </div>

          {/* Social Media */}
          <div className="flex space-x-4 mt-4">
            <Link
              href="#"
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
              data-aos="fade-right"
            >
              <FaFacebookF size={20} />
            </Link>
            <Link
              href="#"
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
              data-aos="fade-down"
            >
              <FaTwitter size={20} />
            </Link>
            <Link
              href="#"
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
              data-aos="fade-up"
            >
              <FaInstagram size={20} />
            </Link>
            <Link
              href="#"
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
              data-aos="fade-left"
            >
              <FaLinkedinIn size={20} />
            </Link>
          </div>
        </div>

        {/* Contact Form */}
        <div
          className="bg-gray-800 rounded-2xl shadow-lg p-8"
          data-aos="zoom-in"
        >
          <h2 className="text-2xl font-semibold mb-6" data-aos="fade-down">
            Send a Message
          </h2>
          <form className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
