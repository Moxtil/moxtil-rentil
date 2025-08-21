"use client";

import { Suspense, useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { MdOutlineCarCrash } from "react-icons/md";
import { Toaster } from "react-hot-toast";
import Carousel from "../../components/Carousel";
import GallerySection from "../../components/GallerySection";
import About from "../../components/About";
import Testimonials from "../../components/Testimonials";
import { SearchSync } from "../../context/SearchSync";
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white">
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
              className="relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] duration-300 transition-all"
            >
              <div className="absolute right-0 left-0 flex items-center gap-2 justify-between top-0 hover:opacity-100 opacity-80 transition-all">
                <p
                  className={`${
                    car.availability === "Available"
                      ? "bg-green-500"
                      : "bg-red-500"
                  } text-white text-center font-medium rounded-md px-4 py-1.5 text-sx md:text-sm`}
                >
                  {car.availability}
                </p>
              </div>
              <Image
                width={300}
                height={200}
                src={car.imageUrl}
                alt={car.title}
                className="w-full h-48 md:object-cover sm:object-contain aspect-square"
              />
              <div className="p-4">
                <h3 className="text-[16px] font-bold flex items-center justify-between gap-2">
                  <span>{car.title}</span>
                </h3>
                <div className="flex flex-row justify-between items-center gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs md:text-sm text-gray-400 -mt-0.5">
                      Color
                    </p>
                    <div
                      className={`${car.color} rounded-full border-2 border-white w-5 h-5`}
                    ></div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-400">
                    Year <span className="text-indigo-100">{car.model}</span>
                  </p>
                </div>
                <span className="text-gray-400 text-xs md:text-sm font-medium">
                  Status <span className="text-indigo-100">{car.status}</span>
                </span>
                <p className="text-indigo-400 font-semibold mt-2">
                  ${car.price}
                </p>
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
        <Testimonials />
      </div>
    </main>
  );
}
