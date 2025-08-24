"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  FaCar,
  FaDollarSign,
  FaPalette,
  FaPen,
  FaTag,
  FaTrash,
} from "react-icons/fa6";
import { MdAutorenew, MdOutlineAddPhotoAlternate } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { TbMoodSad } from "react-icons/tb";

export default function CarViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const years = Array.from({ length: 30 }, (_, i) => 2025 - i);
  const colors = [
    {
      name: "Black",
      code: "bg-[#222]",
    },
    {
      name: "White",
      code: "bg-[#fff]",
    },
    {
      name: "Silver",
      code: "bg-[#444]",
    },
    {
      name: "Gray",
      code: "bg-gray-700",
    },
    {
      name: "Red",
      code: "bg-red-500",
    },

    {
      name: "Blue",
      code: "bg-blue-500",
    },
    {
      name: "Green",
      code: "bg-green-500",
    },
    {
      name: "Brown",
      code: "bg-yellow-700",
    },
  ];
  const statuses = ["New", "Old", "Broken", "Well Used", "Tired"];
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    color: "",
    status: "",
    price: 0,
    description: "",
    availability: "",
  });
  //  Fetch our car (by id)
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const carRef = doc(db, "cars", id);
        const carSnap = await getDoc(carRef);
        if (carSnap.exists()) {
          setCar({ id: carSnap.id, ...carSnap.data() });
          setFormData(carSnap.data()); // fill edit form
        } else {
          console.error("Car not found!");
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCar();
  }, [id]);

  //  Handle input change in edit mode
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //  Update car
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const carRef = doc(db, "cars", id);
      await updateDoc(carRef, formData);
      setCar({ ...car, ...formData });
      toast.success("Car Info Updated!");
      setEditMode(false);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error updating car:", error);
    }
  };

  //  Delete car
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "cars", id));
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error deleting car:", error);
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center gap-2 justify-center   text-white">
        <TbMoodSad size={30} />
        <span> Car not found.</span>{" "}
      </div>
    );
  }
  if (!user) {
    return (
      <div className="mt-20 w-full flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl text-red-500 font-bold">
          You Are Not Authorized To Reach This Page!
        </h1>
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
    <div className="max-w-7xl mt-14 mb-12 mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
      <Toaster position="top-center" reverseOrder={false} />
      {!editMode ? (
        <>
          <Image
            width={500}
            height={300}
            src={car.imageUrl || "/placeholder.jpg"}
            alt={car.title}
            className="w-full h-full max-h-[500px] object-cover object-center rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold">{car.title}</h1>
          <p className="text-gray-600">
            {car.brand} - {car.model}
          </p>
          <p className="text-lg font-semibold mt-2">${car.price}</p>
          <p className="text-gray-400 mt-4">{car.description}</p>

          {user?.primaryEmailAddress?.emailAddress === car.publisherEmail && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setEditMode(true)}
                className="cursor-pointer flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <FaPen size={19} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "red",
                    cancelButtonColor: "oklch(79.2% 0.209 151.711)",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDelete();
                      toast.success("Car Deleted Successfully!");
                      router.back();
                    }
                  });
                }}
                className="flex items-center gap-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                <FaTrash size={19} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Car Title */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <FaTag /> Car Title
            </label>
            <input
              name="title"
              required
              type="text"
              value={formData.title}
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
              name="brand"
              value={formData.brand}
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
            </select>
          </div>

          {/* Year */}
          <div>
            <label className=" mb-2 font-semibold flex items-center gap-2">
              <FaCalendarAlt /> Year
            </label>
            <select
              name="model"
              value={formData.model}
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

          {/* Submit */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all"
            >
              {loading ? "Updating Car..." : "Update"}
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="cursor-pointer w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Cancel Edit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
