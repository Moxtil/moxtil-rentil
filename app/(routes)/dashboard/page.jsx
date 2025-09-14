"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, useContext, useEffect, useState } from "react";
import {
  FaCar,
  FaPlus,
  FaHeart,
  FaChartLine,
  FaTrash,
  FaEye,
  FaPen,
  FaRegUserCircle,
} from "react-icons/fa";
import Image from "next/image";
import { db } from "../../firebase/config";
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { FavContext } from "../../context/ToggleFavContext";
import { RentContext } from "../../context/RentReqContext";
import {
  MdOutlineAccessTime,
  MdOutlineCancel,
  MdOutlineCarRental,
} from "react-icons/md";
import moment from "moment";
import { FiChevronRight } from "react-icons/fi";
import { IoCarSportOutline } from "react-icons/io5";
import { GrStatusGood } from "react-icons/gr";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaCheck, FaX } from "react-icons/fa6";
import { LargeLoadingSkeleton } from "../../components/LargeLoadingSkeleton";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";

export default function DashboardPage() {
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const { user, isLoaded } = useUser();
  const { favCars, toggleFavorite, setFavCars } = useContext(FavContext);
  const { usersReqs } = useContext(RentContext);
  const [myCarsReqs, setMyCarsReq] = useState([]);
  // Fetch All Cars Stored
  useEffect(() => {
    const q = query(collectionGroup(db, "cars"));
    const unsub = onSnapshot(q, (snap) => {
      setAllCars(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // fetch my cars
  useEffect(() => {
    const fetchCars = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "cars"),
          where("publisherEmail", "==", user?.primaryEmailAddress?.emailAddress)
        );
        const querySnapshot = await getDocs(q);

        const carData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCars(carData);
      } catch (error) {
        toast.error("Error fetching car:", error);
      }
    };

    fetchCars();
  }, [user, isLoaded]);

  // delete from my cars function
  const deleteCar = async (itemId) => {
    if (!user) return;

    try {
      const carRef = doc(db, "cars", itemId);
      const carSnap = await getDoc(carRef);

      if (!carSnap.exists()) {
        toast.error("Car Not Found!");
        return;
      }

      const carData = carSnap.data();

      // Ensure this user is the one who published the car
      if (carData.publisherEmail !== user?.primaryEmailAddress?.emailAddress) {
        toast.error("You are not authorized to delete this car.");
        return;
      }

      await deleteDoc(carRef);

      // Optionally update UI
      setCars((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      toast.error("Error deleting car:", error);
    }
  };

  // delete rent requests i have sent
  const deleteRentReq = async (itemId) => {
    if (!user) return;

    try {
      const carRef = doc(
        db,
        "reqs",
        user?.emailAddresses[0].emailAddress,
        "requests",
        itemId
      );
      const carSnap = await getDoc(carRef);

      if (!carSnap.exists()) {
        toast.error("Car Not Found!");
        return;
      }

      await deleteDoc(carRef);
    } catch (error) {
      toast.error("Error deleting car:", error);
    }
  };

  // delete rent requests on my cars
  const deleteRequestsOnMyCars = async (itemId, reqSender) => {
    if (!user) return;

    try {
      const carRef = doc(db, "reqs", reqSender, "requests", itemId);
      const carSnap = await getDoc(carRef);

      if (!carSnap.exists()) {
        toast.error("Request Not Found!");
        return;
      }

      await deleteDoc(carRef);
    } catch (error) {
      toast.error("Error deleting Request:", error);
    }
  };
  // approve or reject rent requests on my cars
  const changeRequestStatus = async (id, newStatus, reqSender) => {
    try {
      const docRef = doc(db, "reqs", reqSender, "requests", id);
      await updateDoc(docRef, { status: newStatus });

      setMyCarsReq((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );

      toast.success("Status updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    }
  };

  // fetch rent requests on my cars
  useEffect(() => {
    if (!user) return;

    const q = query(
      collectionGroup(db, "requests"),
      where("carOwner", "==", user.primaryEmailAddress.emailAddress)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyCarsReq(data);
    });

    return () => unsub();
  }, [user]);

  // fetch favorite items
  const loadFavorites = async (user) => {
    if (!user) return;

    const favRef = collection(db, "users", user?.id, "favorite-cars");
    const snapshot = await getDocs(favRef);

    const ids = snapshot.docs.map((doc) => doc.data().product.id);

    setFavCars(ids);
  };
  useEffect(() => {
    loadFavorites(user);
  }, [user, isLoaded]);
  if (!user && isLoaded) {
    return (
      <section className="flex flex-col justify-center items-center px-6 mt-20">
        <div className="max-w-xl bg-white rounded-xl shadow-xl p-12 text-center w-full">
          <h1 className="text-4xl flex-col font-extrabold text-[#004e77] mb-6 flex justify-center items-center gap-3 select-none">
            <FaChartLine size={40} />
            Have Your Own Dashboard
          </h1>
          <p className="text-gray-700 mb-10 text-lg leading-relaxed">
            Create an account or sign in to have your car stored quickly and
            securely.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/sign-up"
              className="bg-[#004e77] hover:bg-[#003452] transition-colors text-white px-7 py-3 rounded-md font-semibold cursor-pointer shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Sign Up <FiChevronRight />
            </Link>
            <Link
              href="/sign-in"
              className="border-2 border-[#004e77] text-[#004e77] hover:bg-[#003452] hover:text-white transition-colors px-7 py-3 rounded-md font-semibold cursor-pointer shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Login <FiChevronRight />
            </Link>
          </div>
        </div>
      </section>
    );
  }
  if (!isLoaded && user)
    return (
      <div className="flex flex-col gap-8 mt-10 p-6">
        <LargeLoadingSkeleton />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      </div>
    );
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 p-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      }
    >
      <div className="min-h-screen  bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
        {/* Header */}
        <Toaster position="top-center" reverseOrder={false} />

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold"
          >
            {" "}
            Dashboard
          </motion.h1>
        </motion.div>

        {/* Dashboard Content */}

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <FaCar className="text-blue-400 text-3xl mb-2" />
              <h4 className="text-lg font-bold">Your Cars</h4>
              <p className="text-gray-400">{cars.length} Cars</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <FaChartLine className="text-green-400 text-3xl mb-2" />
              <h4 className="text-lg font-bold">
                Rents Request For Your Cars!
              </h4>
              <p className="text-gray-400">{myCarsReqs.length}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <FaHeart className="text-red-500 text-3xl mb-2" />
              <h4 className="text-lg font-bold">Wishlist Cars</h4>
              <p className="text-gray-400">{favCars.length}</p>
            </motion.div>
          </div>

          {/* My Wishlist */}
          <div className="my-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl md:text-x2xl lg:text-3xl font-semibold mb-4 flex items-center gap-2"
            >
              {" "}
              <FaHeart className="text-red-500" /> Your Wishlist
            </motion.h2>
            {favCars.length === 0 ? (
              <p className="text-gray-400">No cars found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favCars.map((car, i) => (
                  <motion.div
                    key={i}
                    transition={{ duration: 0.4 }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative bg-gray-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 flex flex-col"
                  >
                    {/* Car Image */}
                    <div className="relative w-full h-48 overflow-hidden">
                      {car.imageUrl && (
                        <Image
                          width={400}
                          height={250}
                          src={car.imageUrl}
                          alt={car.title || "Car"}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                      )}

                      {/* Availability Badge */}
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 text-xs md:text-sm font-semibold rounded-full shadow-md ${
                          car.availability === "Available"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {car.availability}
                      </span>

                      {/* Icon Buttons */}
                      <Link
                        href={`/car-view/${car.id}`}
                        className="absolute top-3 right-3 bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition"
                      >
                        <FaEye className="text-white text-lg" />
                      </Link>

                      <button
                        onClick={async () => {
                          await toggleFavorite(user, car);
                          loadFavorites(user);
                          toast.success("Car Removed Successfully!");
                        }}
                        className="cursor-pointer absolute top-14 right-3 bg-red-500 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition"
                      >
                        <FaHeart className="text-white text-lg" />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col gap-3">
                      {/* Title */}
                      <h4 className="text-lg font-bold text-white truncate">
                        {car.brand} {car.model}
                      </h4>

                      {/* Mini Details */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="bg-gray-800/50 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                          <span>Color:</span>
                          <div
                            className={`${car.color?.toLowerCase()} w-4 h-4 rounded-full border border-white`}
                          ></div>
                        </div>
                        <div className="bg-gray-800/50 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                          <span>Price:</span> ${car.price}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* My Cars Section */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-xl md:text-x2xl lg:text-3xl font-semibold mb-4 flex items-center gap-2"
              >
                {" "}
                <FaCar className="text-blue-400" /> Your Collection{" "}
              </motion.h2>
              <Link
                href={`/add-car/${user?.id}`}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md transition"
              >
                <FaPlus /> Add Car
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.length > 0 ? (
                cars.map((car) => (
                  <motion.div
                    key={car.id}
                    transition={{ duration: 0.4 }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
                  >
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "This action cannot be undone!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "red",
                          cancelButtonColor: "oklch(79.2% 0.209 151.711)",
                          confirmButtonText: "Yes, delete it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteCar(car.id);
                            toast.success("Request Deleted Successfully!");
                          }
                        });
                      }}
                      className="cursor-pointer z-[50] absolute top-3 right-3 bg-white text-red-500 p-2 rounded-full shadow-md hover:bg-gray-200 transition"
                    >
                      <FaTrash />
                    </button>

                    {/* Car Image */}
                    <div className="relative w-full h-48 overflow-hidden">
                      {car.imageUrl && (
                        <Image
                          width={400}
                          height={250}
                          src={car.imageUrl}
                          alt={car.title || "Car"}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      {/* Availability Badge */}
                      <span
                        className={`absolute top-3 left-3 text-xs md:text-sm font-semibold px-3 py-1 rounded-full shadow-md ${
                          car.availability === "Available"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {car.availability}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      {/* Title & Price */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-white truncate">
                          {car.brand} {car.model}
                        </h4>
                        <p className="text-indigo-400 font-semibold text-lg">
                          ${car.price}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-400 my-2 line-clamp-2">
                        {car.title}
                      </p>

                      {/* Specs */}
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-sm text-gray-400">Color:</p>
                        <div
                          className={`${car.color.toLowerCase()} border-2 border-white rounded-full w-5 h-5`}
                        ></div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-start w-full gap-3 mt-auto">
                        <Link
                          href={`/car-manage/${car.id}`}
                          className="grow w-[150px] py-3 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition"
                        >
                          <FaPen />
                        </Link>
                        <Link
                          href={`/car-view/${car.id}`}
                          className="grow w-[150px] py-3 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400">
                  {" "}
                  You don't have any stored cars !
                </p>
              )}
            </div>
          </div>
          {/* My Rent Requests */}
          <div>
            <div className="flex items-center justify-between gap-3 h-full">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-xl md:text-x2xl lg:text-3xl font-semibold mb-4 flex items-center gap-2"
              >
                {" "}
                <MdOutlineCarRental className="text-green-500" /> Cars You
                Requested
              </motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {usersReqs.length > 0 ? (
                usersReqs.map((car) => (
                  <motion.div
                    key={car.id}
                    transition={{ duration: 0.4 }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="relative w-full h-48 overflow-hidden">
                      {car.imageUrl && (
                        <Link href={`/car-view/${car.id}`}>
                          <Image
                            width={400}
                            height={250}
                            src={car.imageUrl}
                            alt={car.title || "Car"}
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                          />
                        </Link>
                      )}

                      {/* Availability Badge */}
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 text-xs md:text-sm font-semibold rounded-full shadow-md ${
                          car.availability === "Available"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {car.availability === "Available"
                          ? "Available"
                          : "Not Available"}
                      </span>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "This request will be deleted permanently!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "red",
                            cancelButtonColor: "oklch(79.2% 0.209 151.711)",
                            confirmButtonText: "Yes, delete it!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              deleteRentReq(car.id);
                              toast.success("Request Deleted Successfully!");
                            }
                          });
                        }}
                        className="cursor-pointer absolute top-3 right-3 bg-white text-red-500 p-2 rounded-full shadow-md hover:bg-gray-200 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                      {/* Title */}
                      <h4 className="text-lg font-bold text-white">
                        {car.brand} {car.model}
                      </h4>

                      {/* Request Status */}
                      <p className="text-sm">
                        Request Status:{" "}
                        <span
                          className={`${
                            car.status === "Approved"
                              ? "text-green-400"
                              : car.status === "Rejected"
                              ? "text-red-400"
                              : "text-yellow-400"
                          } font-semibold`}
                        >
                          {car.status}
                        </span>
                      </p>

                      {/* Price & Time */}
                      <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                        <p className="text-indigo-400 font-bold">
                          ${car.price}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {car.createdAt?.toDate
                            ? moment(car.createdAt.toDate()).fromNow()
                            : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400">
                  You don't have any rent request !
                </p>
              )}
            </div>
          </div>

          {/* Rent Reqs On My Cars */}
          <div className="w-full my-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl md:text-x2xl lg:text-3xl font-semibold mb-4 flex items-center gap-2"
            >
              {" "}
              <MdOutlineCarRental /> Incoming Rent Requests
            </motion.h2>

            {myCarsReqs.length === 0 ? (
              <p className="text-gray-400 text-left py-6">
                No rent requests on your cars found.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myCarsReqs.map((req) => (
                  <motion.div
                    key={req.id}
                    transition={{ duration: 0.4 }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className={`bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 flex flex-col ${
                      req.status === "Approved"
                        ? "border-green-500"
                        : req.status === "Rejected"
                        ? "border-red-500"
                        : "border-yellow-500"
                    }`}
                  >
                    {/* Image + Delete Button */}
                    <div className="relative w-full h-48">
                      <Link href={`/car-view/${req.id}`}>
                        <Image
                          src={req.imageUrl}
                          alt={req.title}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover"
                        />
                      </Link>

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
                              deleteRequestsOnMyCars(req.id, req.email);
                              toast.success("Request Deleted Successfully!");
                            }
                          });
                        }}
                        className="cursor-pointer absolute top-3 right-3 bg-white text-red-500 p-2 rounded-full shadow hover:bg-gray-200 transition"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col space-y-3 flex-1">
                      {/* Car Info */}
                      <p className="text-gray-200 flex items-center gap-2">
                        <IoCarSportOutline className="text-indigo-400" />
                        <span className="font-semibold">Car:</span>
                        <span className="text-gray-400 text-sm">
                          {req.title || "N/A"}
                        </span>
                      </p>

                      {/* Renter Info */}
                      <p className="text-gray-200 flex items-center gap-2">
                        <FaRegUserCircle className="text-indigo-400" />
                        <span className="font-semibold text-indigo-500">
                          {req.email}
                        </span>
                        <span className="text-gray-400 text-sm">
                          wants to rent your car
                        </span>
                      </p>

                      {/* Time */}
                      <p className="text-gray-200 flex items-center gap-2">
                        <MdOutlineAccessTime className="text-indigo-400" />
                        <span className="font-semibold">Request Sent:</span>
                        <span className="text-gray-400 text-sm">
                          {req.createdAt?.toDate
                            ? moment(req.createdAt.toDate()).fromNow()
                            : "Unknown"}
                        </span>
                      </p>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        {req.status === "Approved" ? (
                          <GrStatusGood className="text-green-400" />
                        ) : req.status === "Rejected" ? (
                          <MdOutlineCancel className="text-red-400" />
                        ) : (
                          <IoIosInformationCircleOutline className="text-yellow-400" />
                        )}
                        <span className="font-semibold">Status:</span>
                        <span
                          className={`${
                            req.status === "Approved"
                              ? "text-green-400"
                              : req.status === "pending"
                              ? "text-yellow-400"
                              : "text-red-400"
                          } font-semibold`}
                        >
                          {req.status || "Pending"}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-auto">
                        <button
                          onClick={() =>
                            changeRequestStatus(req.id, "Approved", req.email)
                          }
                          className={`flex-1 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                            req.status === "Approved"
                              ? "cursor-not-allowed bg-green-800/80 text-gray-200"
                              : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                          }`}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          onClick={() =>
                            changeRequestStatus(req.id, "Rejected", req.email)
                          }
                          className={`flex-1 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                            req.status === "Rejected"
                              ? "cursor-not-allowed bg-red-800/80 text-gray-200"
                              : "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                          }`}
                        >
                          <FaX /> Reject
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
