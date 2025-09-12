"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  FaCar,
  FaDollarSign,
  FaCalendarAlt,
  FaPalette,
  FaTag,
} from "react-icons/fa";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { MdAutorenew } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Image from "next/image";

export default function AddCarPage() {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    carTitle: "",
    carName: "",
    year: "",
    color: "",
    status: "",
    price: 0,
    description: "",
    availability: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [previewExtraImages, setPreviewExtraImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 30 }, (_, i) => 2025 - i);
  const colors = [
    { name: "Black", code: "bg-[#222]" },
    { name: "White", code: "bg-[#fff]" },
    { name: "Silver", code: "bg-[#444]" },
    { name: "Gray", code: "bg-gray-700" },
    { name: "Red", code: "bg-red-500" },
    { name: "Blue", code: "bg-blue-500" },
    { name: "Green", code: "bg-green-500" },
    { name: "Brown", code: "bg-yellow-700" },
  ];
  const statuses = ["New", "Old", "Broken", "Well Used", "Tired"];

  // handle single image change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, image: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // handle multiple extra images
  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + extraImages.length > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }

    setExtraImages([...extraImages, ...files]);
    setPreviewExtraImages([
      ...previewExtraImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    let imageUrl = "";
    let extraImageUrls = [];

    try {
      // upload main image
      if (formData.image) {
        const data = new FormData();
        data.append("file", formData.image);
        data.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const file = await res.json();
        if (!file.secure_url) throw new Error("Cloudinary upload failed");
        imageUrl = file.secure_url;
      }

      // upload extra images
      if (extraImages.length > 0) {
        const uploadPromises = extraImages.map(async (img) => {
          const data = new FormData();
          data.append("file", img);
          data.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
          );

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: data,
            }
          );

          const file = await res.json();
          if (file.secure_url) return file.secure_url;
          else throw new Error("Cloudinary upload failed");
        });

        extraImageUrls = await Promise.all(uploadPromises);
      }

      // save to firestore
      await addDoc(collection(db, "cars"), {
        title: formData.carTitle,
        brand: formData.carName,
        model: formData.year,
        color: formData.color,
        status: formData.status,
        price: formData.price,
        description: formData.description,
        imageUrl: imageUrl,
        extraImages: extraImageUrls,
        publisherId: user.id,
        publisherEmail: user.primaryEmailAddress?.emailAddress,
        publisherName: user.fullName,
        availability: formData.availability,
        createdAt: serverTimestamp(),
      });

      // reset form
      setFormData({
        carTitle: "",
        carName: "",
        year: "",
        color: "",
        status: "",
        price: 0,
        description: "",
        availability: "",
        image: null,
      });
      setPreviewImage(null);
      setExtraImages([]);
      setPreviewExtraImages([]);

      toast.success("Car Posted Successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error uploading car: " + error.message);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="mt-20 w-full flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl text-red-500 font-bold">
          You Are Not Authorized To Reach This Page!
        </h1>
        <p className="text-sm text-gray-400 ">Sign Up To Store Your Car</p>
        <Link
          href="/browse"
          className="px-5 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition"
        >
          Back To Browse Page
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-white"
      >
        <Toaster position="top-center" reverseOrder={false} />
        <h1
          className="text-3xl font-bold mb-6 text-center"
          data-aos="fade-down"
        >
          Add a Car
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          data-aos="fade-down"
        >
          {/* Car Title */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <FaTag /> Car Title
            </label>
            <input
              name="carTitle"
              required
              type="text"
              value={formData.carTitle}
              onChange={handleChange}
              placeholder="BMW X5 2016"
              className="w-full border-2 border-white rounded-sm outline-none p-2"
            />
          </div>

          {/* Car Brand */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <FaCar /> Car Brand
            </label>
            <select
              name="carName"
              value={formData.carName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Car</option>
              <option value="Toyota">Toyota</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes">Mercedes</option>
              <option value="Audi">Audi</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Honda">Honda</option>
              <option value="Kia">Kia</option>
              <option value="Mazda">Mazda</option>
              <option value="Dodge">Dodge</option>
              <option value="Fiat">Fiat</option>
              <option value="Renault">Renault</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <FaCalendarAlt /> Year
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <FaPalette /> Color
            </label>
            <select
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Color</option>
              {colors.map((color, i) => (
                <option key={i} value={color.code}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <MdAutorenew />
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* availability */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <IoMdInformationCircleOutline />
              Availability
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <FaDollarSign /> Price
            </label>
            <input
              name="price"
              type="number"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="1000.."
              className="w-full border-2 border-white rounded-sm outline-none p-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              Description
            </label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="This is my car . . ."
              className="w-full border-2 border-white rounded-sm outline-none p-2"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <MdOutlineAddPhotoAlternate /> Car Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {previewImage && (
              <Image
                width={350}
                height={225}
                src={previewImage}
                alt="Preview"
                className="mt-2 w-40 h-40 object-cover rounded-lg border border-gray-300"
              />
            )}
          </div>

          {/* Extra Images Upload */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <MdOutlineAddPhotoAlternate /> More Car Images (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleExtraImagesChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {previewExtraImages.length > 0 && (
              <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-3">
                {previewExtraImages.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    width={120}
                    height={120}
                    alt={`Extra Preview ${i}`}
                    className="w-28 h-28 object-cover rounded-lg border border-gray-300"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all"
          >
            {loading ? "Adding Car..." : "Add Car"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
