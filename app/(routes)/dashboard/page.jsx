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
  if (!isLoaded && user) return <div className="loader"></div>;
  return (
    <Suspense fallback={<div className="loader"></div>}>
      <div className="min-h-screen  bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
        {/* Header */}
        <Toaster position="top-center" reverseOrder={false} />

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold" data-aos="fade-down">
            Dashboard
          </h1>
        </motion.div>

        {/* Dashboard Content */}

        <div className="space-y-8">
          {/* Heading Icons , Cars length - Rent requests on my cars and Wishlist items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg"
              data-aos="fade-right"
            >
              <FaCar className="text-blue-400 text-3xl mb-2" />
              <h4 className="text-lg font-bold">Your Cars</h4>
              <p className="text-gray-400">{cars.length} Cars</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg"
              data-aos="fade-down"
            >
              <FaChartLine className="text-green-400 text-3xl mb-2" />
              <h4 className="text-lg font-bold">
                Rents Request For Your Cars!
              </h4>
              <p className="text-gray-400">{myCarsReqs.length}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg"
              data-aos="fade-left"
            >
              <FaHeart className="text-red-500 text-3xl mb-2" />
              <h4 className="text-lg font-bold">Wishlist Cars</h4>
              <p className="text-gray-400">{favCars.length}</p>
            </motion.div>
          </div>

          {/* My Wishlist */}
          <div className="my-8">
            <h3 className="text-xl md:text-x2xl lg:text-3xl font-semibold mb-4 flex items-center gap-2">
              <FaHeart className="text-red-500" /> Your Wishlist
            </h3>
            {favCars.length === 0 ? (
              <p className="text-gray-400">No cars found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favCars.map((car, i) => (
                  <div
                    key={i}
                    className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] transition-all"
                  >
                    <p
                      className={`${
                        car.availability === "Available"
                          ? "bg-green-500"
                          : "bg-red-500"
                      } text-white text-center font-medium rounded-md px-4 py-1.5 text-sx md:text-sm opacity-80 absolute left-0 top-0`}
                    >
                      {car.availability}
                    </p>
                    {car.imageUrl && (
                      <Image
                        width={300}
                        height={200}
                        src={car?.imageUrl}
                        alt={car.title || "Car"}
                        className="w-full h-48 object-cover "
                      />
                    )}
                    <div className="p-4">
                      <h4 className="text-lg font-bold">
                        {car?.brand} {car?.model}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-gray-400 -mt-0.5">Color :</p>
                        <div
                          className={`${car?.color} border-2 border-white rounded-full w-5 h-5 `}
                        ></div>
                      </div>{" "}
                      <p className="text-blue-400 font-semibold">
                        ${car?.price}
                      </p>
                      <div className="flex items-center gap-2 justify-between">
                        <Link
                          href={`/car-view/${car?.id}`}
                          className="cursor-pointer mt-3 w-full bg-blue-400 hover:bg-blue-500 rounded-lg py-2 flex items-center justify-center gap-2"
                        >
                          <FaEye /> View
                        </Link>
                        <button
                          onClick={async () => {
                            await toggleFavorite(user, car);
                            loadFavorites(user);
                            toast.success("Car Removed Successfully!");
                          }}
                          className="cursor-pointer mt-3 w-full bg-red-500 hover:bg-red-600 rounded-lg py-2 flex items-center justify-center gap-2"
                        >
                          <FaHeart /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Cars Section */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl md:text-x2xl lg:text-3xl font-semibold mb-4 flex items-center gap-2">
                <FaCar className="text-blue-400" /> Your Cars
              </h3>
              <Link
                href={`/add-car/${user?.id}`}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md transition"
              >
                <FaPlus /> Add Car
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.length > 0 ? (
                cars.map((car) => (
                  <div
                    data-aos="fade-up"
                    key={car.id}
                    className="relative bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-xl transition"
                  >
                    <div className="absolute right-0 left-0 flex items-center gap-2 justify-between  top-0 ">
                      <p
                        className={`${
                          car.availability === "Available"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } text-white text-center font-medium rounded-md px-4 py-1.5 text-sx md:text-sm opacity-80`}
                      >
                        {car.availability}
                      </p>
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
                              deleteCar(car.id);
                              toast.success("Request Deleted Successfully!");
                            }
                          });
                        }}
                        className="bg-white text-red-500 w-fit p-2 rounded-full shadow-lg text-center cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {car.imageUrl && (
                      <Image
                        width={300}
                        height={200}
                        src={car.imageUrl}
                        alt={car.title || "Car"}
                        className="w-full h-48 object-cover "
                      />
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-lg font-bold">
                        {car.brand} {car.model}
                      </h4>
                      <p className="text-blue-400 font-semibold">
                        ${car.price}
                      </p>
                    </div>
                    <p className="text-sm text-gray-400 my-1">{car.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-gray-400 -mt-0.5">Color :</p>
                      <div
                        className={`${car.color.toLowerCase()} border-2 border-white rounded-full w-5 h-5 `}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <Link
                        href={`/car-manage/${car.id}`}
                        className="mt-3 w-full bg-green-500 hover:bg-green-600 rounded-lg py-2 flex items-center justify-center gap-2"
                      >
                        <FaPen />
                        Manage
                      </Link>
                      <Link
                        href={`/car-view/${car.id}`}
                        className="cursor-pointer mt-3 w-full bg-blue-400 hover:bg-blue-500 rounded-lg py-2 flex items-center justify-center gap-2"
                      >
                        <FaEye /> View
                      </Link>
                    </div>
                  </div>
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
              <h3 className="text-xl md:text-x2xl lg:text-3xl font-semibold mb-4 flex items-center gap-2">
                <MdOutlineCarRental className="text-green-500" /> Your Rent
                Requests
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {usersReqs.length > 0 ? (
                usersReqs.map((car) => (
                  <div
                    key={car.id}
                    className="relative bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-xl transition"
                  >
                    <div className="absolute right-0 left-0 flex items-center gap-2 justify-between  top-0 ">
                      <p
                        className={`${
                          car.availability === "Available"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } text-white text-center font-medium rounded-md px-4 py-1.5 text-sx md:text-sm opacity-80`}
                      >
                        {car.availability === "Available"
                          ? "Available"
                          : "Not Available"}
                      </p>
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
                              deleteRentReq(car.id);
                              toast.success("Request Deleted Successfully!");
                            }
                          });
                        }}
                        className="bg-white text-red-500 w-fit p-2 rounded-full shadow-lg text-center cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {car.imageUrl && (
                      <Link href={`/car-view/${car.id}`} className="w-full">
                        <Image
                          width={300}
                          height={200}
                          src={car.imageUrl}
                          alt={car.title || "Car"}
                          className="w-full h-48 object-cover"
                        />
                      </Link>
                    )}
                    <h4 className="text-lg font-bold">
                      {car.brand} {car.model}
                    </h4>

                    <p className="text-sm text-gray-400 -mt-0.5">
                      Request Status:{" "}
                      <span
                        className={`${
                          car.status === "Approved"
                            ? "text-green-500"
                            : car.status === "Rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                        } font-semibold`}
                      >
                        {car.status}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 justify-between">
                      <p className="text-blue-400 font-semibold">
                        ${car.price}
                      </p>
                      <p className="text-gray-400">
                        {car.createdAt?.toDate
                          ? moment(car.createdAt.toDate()).fromNow()
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
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
            <h3 className="text-xl md:text-x2xl lg:text-3xl font-semibold mb-4 flex items-center gap-2">
              <MdOutlineCarRental /> Rent Requests On Your Cars
            </h3>

            {myCarsReqs.length === 0 ? (
              <p className="text-gray-400 text-left py-6">
                No rent requests on your cars found.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myCarsReqs.map((req) => (
                  <div
                    key={req.id}
                    className={` bg-gray-800 rounded-xl p-4 shadow transition-transform relative border-2 ${
                      req.status === "Approved"
                        ? "border-green-500"
                        : req.status === "Rejected"
                        ? "border-red-500"
                        : "border-yellow-500"
                    }`}
                  >
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
                      className="bg-white text-red-500 w-fit p-2 rounded-full shadow-lg text-center cursor-pointer absolute right-2 top-2"
                    >
                      <FaTrash />
                    </button>

                    <Link
                      href={`/car-view/${req.id}`}
                      key={req.id}
                      className="w-full"
                    >
                      <Image
                        src={req.imageUrl}
                        alt={req.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover "
                      />
                    </Link>
                    <p className="text-gray-300 flex items-center gap-1">
                      <IoCarSportOutline />
                      <span className="font-semibold">Car:</span>{" "}
                      <span className="text-gray-400 text-sm">
                        {" "}
                        {req.title || "N/A"}
                      </span>
                    </p>
                    <p className="text-gray-300 flex items-center flex-wrap gap-1">
                      <FaRegUserCircle />
                      <span className="font-semibold text-indigo-500">
                        {req.email}
                      </span>
                      <span className="text-gray-400 text-sm">
                        Wants to rent your car
                      </span>
                    </p>
                    <p className="text-gray-300 flex items-center gap-1">
                      <MdOutlineAccessTime />
                      <span className="font-semibold">Request Sent :</span>{" "}
                      <span className="text-gray-400 text-sm">
                        {req.createdAt?.toDate
                          ? moment(req.createdAt.toDate()).fromNow()
                          : "Unknown"}
                      </span>
                    </p>
                    <p className="text-gray-300 flex items-center gap-1">
                      {req.status === "Approved" ? (
                        <GrStatusGood color="oklch(79.2% 0.209 151.711)" />
                      ) : req.status === "Rejected" ? (
                        <MdOutlineCancel color="red" />
                      ) : (
                        <IoIosInformationCircleOutline color="yellow" />
                      )}
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`${
                          req.status === "Approved"
                            ? "text-green-400"
                            : req.status === "pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                        } font-semibold`}
                      >
                        {req.status || "pending"}
                      </span>
                    </p>
                    <div className="text-gray-300">
                      <div className="flex items-center gap-2 justify-between">
                        <button
                          onClick={() =>
                            changeRequestStatus(req.id, "Approved", req.email)
                          }
                          className={`font-semibold  mt-3 w-full bg-green-500/90  rounded-lg py-2 flex items-center justify-center gap-2 ${
                            req.status === "Approved"
                              ? "cursor-not-allowed bg-green-800/90"
                              : "cursor-pointer hover:bg-green-800/90"
                          }`}
                        >
                          <FaCheck />
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            changeRequestStatus(req?.id, "Rejected", req?.email)
                          }
                          className={`font-semibold  mt-3 w-full bg-red-500/90  rounded-lg py-2 flex items-center justify-center gap-2 ${
                            req.status === "Rejected"
                              ? "cursor-not-allowed bg-red-800/90"
                              : "cursor-pointer hover:bg-red-800/90"
                          }`}
                        >
                          <FaX /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
