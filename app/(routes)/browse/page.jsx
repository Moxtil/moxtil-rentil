"use client";

import { Suspense, useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { MdOutlineCarCrash } from "react-icons/md";
import { Toaster } from "react-hot-toast";
import Carousel from "../../components/Carousel";
import GallerySection from "../../components/GallerySection";
import About from "../../components/About";
import Testimonials from "../../components/Testimonials";
import { HowItWorks } from "../../components/HowItWorks";
import { SearchSync } from "../../context/SearchSync";
import { WhyChooseUs } from "../../components/WhyChooseUs";
import { Partners } from "../../components/Partners";
import { AppDownload } from "../../components/AppDownload";
import { FAQSection } from "../../components/FAQ";
import { FinalCTA } from "../../components/FinalCTA";
import { Premium } from "../../components/Premium";
import { FaBolt, FaPalette, FaTag } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [priceSort, setPriceSort] = useState("default");

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const normalize = (value) => value?.toString().trim().toLowerCase();
  const capitalizeWords = (value) =>
    value
      ?.toString()
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  const unique = (arr) => [...new Set(arr.filter(Boolean))];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cars"), (snapshot) => {
      const carsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(carsData);

      // Setting filter options
      setCategories([
        "all",
        ...unique(carsData.map((car) => normalize(car.status))),
      ]);
      setBrands([
        "all",
        ...unique(carsData.map((car) => normalize(car.brand))),
      ]);
      const availableModels =
        selectedBrand === "all"
          ? [
              ...new Set(
                carsData
                  .map((car) => car.model)
                  .filter(Boolean)
                  .sort((a, b) => Number(b) - Number(a))
              ),
            ]
          : [
              ...new Set(
                carsData
                  .filter((car) => normalize(car.brand) === selectedBrand)
                  .map((car) => car.model)
                  .filter(Boolean)
                  .sort((a, b) => Number(b) - Number(a))
              ),
            ];
      setModels(["all", ...availableModels]);
    });
    return () => unsub();
  }, [selectedBrand]);

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.title.toLowerCase().includes(search.toLowerCase()) ||
      car.brand.toLowerCase().includes(search.toLowerCase());

    const matchesBrand =
      selectedBrand === "all" || normalize(car.brand) === selectedBrand;

    const matchesModel = selectedModel === "all" || car.model === selectedModel;

    const matchesCategory =
      selectedCategory === "all" || normalize(car.status) === selectedCategory;

    return matchesSearch && matchesBrand && matchesModel && matchesCategory;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (priceSort === "asc") return a.price - b.price;
    if (priceSort === "desc") return b.price - a.price;
    return 0;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-2 text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={null}>
        <SearchSync setSearch={setSearch} />
      </Suspense>
      <div className="max-w-7xl mx-auto">
        <Carousel />

        {/* Search + Filters */}
        <div className="relative flex flex-col md:flex-row justify-between items-start mb-6 gap-4 flex-wrap">
          <div className="relative w-full mt-8 mb-4">
            <input
              type="text"
              placeholder="Search cars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-14 w-full px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <CiSearch size={24} className="absolute left-4 top-3 text-white" />
          </div>

          {/* Filters */}
          <div className="lg:flex grid grid-cols-4 gap-4 w-full  md:w-3/4">
            <div className="flex flex-col items-center gap-0.5 grow">
              <label className="text-sm text-center text-gray-500 text-nowrap">
                Status
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {categories.map((cat, i) =>
                  cat ? (
                    <option key={i} value={cat}>
                      {capitalizeWords(cat)}
                    </option>
                  ) : null
                )}
              </select>
            </div>

            <div className="flex flex-col items-center gap-0.5 grow">
              <label className="text-sm text-center text-gray-500 text-nowrap">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {brands.map((brand, i) =>
                  brand ? (
                    <option key={i} value={brand}>
                      {capitalizeWords(brand)}
                    </option>
                  ) : null
                )}
              </select>
            </div>

            <div className="flex flex-col items-center gap-0.5 grow">
              <label className="text-sm text-center text-gray-500 text-nowrap">
                Year
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {models.map((model, i) =>
                  model ? (
                    <option key={i} value={model}>
                      {model}
                    </option>
                  ) : null
                )}
              </select>
            </div>

            <div className="flex flex-col items-center gap-0.5 grow">
              <label className="text-sm text-center text-gray-500 text-nowrap">
                Price
              </label>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className=" w-full px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="default">Default</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cars Cards */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12"
        >
          Stored Cars
        </motion.h2>
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {sortedCars.map((car) => (
            <Link
              href={`/car-view/${car.id}`}
              key={car.id}
              className="group bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col"
            >
              {/* Car Image */}
              <div className="relative w-full h-44 sm:h-52 overflow-hidden">
                <Image
                  width={500}
                  height={300}
                  src={car.imageUrl}
                  alt={car.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Availability Badge */}
                <span
                  className={`absolute top-3 left-3 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md ${
                    car.availability === "Available"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {car.availability}
                </span>
              </div>

              {/* Car Info */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <h3 className="text-lg font-bold text-white truncate mb-3">
                  {car.title}
                </h3>

                {/* Specs */}
                <div className="space-y-2 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <FaPalette className="text-indigo-400" />
                    <span>Color:</span>
                    <div
                      className={`${car.color} rounded-full border w-4 h-4`}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-400" />
                    <span>Year: {car.model}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBolt className="text-indigo-400" />
                    <span>Status: {car.status}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-lg">
                    <FaTag />${car.price}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
        {sortedCars.length === 0 && (
          <p className="text-center text-gray-400 mt-10 flex items-center gap-2 justify-center text-xl">
            No cars found <MdOutlineCarCrash size={30} />
          </p>
        )}

        {/* Other Sections */}
        <GallerySection />
        <About />
        <HowItWorks />
        <Testimonials />
        <WhyChooseUs />
        <Premium />
        <Partners />
        <AppDownload />
        <FAQSection />
        <FinalCTA />
      </div>
    </main>
  );
}
