"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { FaDollarSign, FaUser, FaClock, FaPen, FaTrash } from "react-icons/fa";
import { MdEmail, MdOutlineAdminPanelSettings } from "react-icons/md";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import AddToFavButton from "../../../components/AddToFavButton";
import { RentContext } from "../../../context/RentReqContext";
import { TbMoodSad } from "react-icons/tb";

export default function CarViewPage() {
  const { user } = useUser();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { rentReq, reqStatus, setReqStatus, fetchReqStatus, usersReqs } =
    useContext(RentContext);
  const { id } = useParams();

  useEffect(() => {
    const loadStatus = async () => {
      if (user?.emailAddresses[0].emailAddress && id) {
        const status = await fetchReqStatus(
          user?.emailAddresses[0].emailAddress,
          id
        );
        setReqStatus(status);
        console.log("Loaded status:", status);
      }
    };
    loadStatus();
  }, [user, id]);

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
    } catch (error) {
      toast.error("Error deleting car:", error);
    }
  };

  useEffect(() => {
    const fetchCar = async () => {
      const docRef = doc(db, "cars", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCar({ id: docSnap.id, ...docSnap.data() });
      } else {
        toast.error("Car Not Available Currently!");
      }
      setLoading(false);
    };

    if (id) fetchCar();
  }, [id]);

  if (loading) {
    return <div className="loader"></div>;
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center gap-2 justify-center   text-white">
        <TbMoodSad size={30} />
        <span> Car not found.</span>{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className=" mx-auto bg-gray-800/80 rounded-2xl shadow-lg p-6 md:p-10 flex flex-col lg:flex-row gap-10">
        {/* Car Image */}
        <div className="flex-1 relative">
          <Image
            src={car.imageUrl}
            alt={car.title}
            width={600}
            height={400}
            className="rounded-xl object-cover w-full h-auto "
            data-aos="fade-down"
          />

          <div
            className="absolute  -top-1 flex items-center justify-between right-0 left-0"
            data-aos="fade-down"
          >
            {/* Favorite Button */}
            <p
              className={`${
                car.availability === "Available" ? "bg-green-500" : "bg-red-500"
              } text-white text-center font-medium rounded-md px-4 py-1.5 text-sx md:text-sm`}
            >
              {car.availability}
            </p>
            <AddToFavButton item={car} />
          </div>
        </div>

        {/* Car Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold" data-aos="fade-down">
            {car.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Detail label="Brand" value={car.brand} fade={"fade-right"} />
            <Detail label="Year" value={car.model} fade={"fade-left"} />
            <div
              data-aos="fade-right"
              className="bg-gray-700/50 rounded-lg p-3  flex-col shadow-inner flex items-start justify-between"
            >
              <span className="text-sm text-gray-400">Color </span>
              <div className={`${car.color} rounded-full w-5 h-5 `}></div>
            </div>
            <Detail label="Status" value={car.status} fade={"fade-left"} />
            <Detail
              label="Price"
              value={`${car.price}`}
              icon={<FaDollarSign />}
              fade={"fade-right"}
            />
            <Detail
              label="Posted"
              value={
                car.createdAt?.toDate
                  ? moment(car.createdAt.toDate()).fromNow()
                  : "Unknown"
              }
              icon={<FaClock />}
              fade={"fade-left"}
            />
            {car.publisherEmail === user?.emailAddresses[0]?.emailAddress && (
              <div className="w-full">
                <Link
                  href={`/car-manage/${car.id}`}
                  className=" flex items-center justify-center rounded-md transition-all hover:bg-green-600 shadow-lg gap-1.5 bg-green-500 text-white text-center px-5 py-2"
                >
                  <FaPen /> Manage
                </Link>
              </div>
            )}
            {car?.publisherEmail === user?.emailAddresses[0]?.emailAddress && (
              <div className="w-full">
                <button
                  onClick={() => {
                    if (!user) router.push("/sign-up");
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
                        toast.success("Car Deleted Successfully!");
                        router.back();
                      }
                    });
                  }}
                  className="w-full cursor-pointer flex items-center justify-center rounded-md transition-all hover:bg-red-600 shadow-lg gap-1.5 bg-red-500 text-white text-center px-5 py-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
            {car.publisherEmail !== user?.emailAddresses[0].emailAddress &&
              car.availability === "Available" && (
                <button
                  disabled={reqStatus == "pending"}
                  onClick={async () => {
                    if (!user) {
                      router.push("/sign-up");
                    } else if (reqStatus == "pending") {
                      toast.error("Request Already Submitted!");
                    } else {
                      const result = await Swal.fire({
                        title: "Sure?",
                        text: "Submit A Request To Rent The Car?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Submit",
                        cancelButtonText: "Cancel",
                      });

                      if (result.isConfirmed) {
                        rentReq(car);
                        toast.success("Rent Request Sent!");
                      }
                    }
                  }}
                  className={`text-[13px] py-2.5 px-4 bg-blue-500  text-white font-semibold rounded-md transition flex items-center gap-1 justify-center ${
                    reqStatus == "pending"
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  <MdOutlineAdminPanelSettings size={20} />
                  {reqStatus === "pending"
                    ? "Request Sent (pending)"
                    : reqStatus === "Approved"
                    ? "Request Approved"
                    : reqStatus === "Rejected"
                    ? "Request Rejected"
                    : "Submit To Rent Car"}
                </button>
              )}
          </div>

          {/* Description */}
          <div className="mt-6" data-aos="fade-up">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-300 bg-gray-700/40 rounded-md p-4">
              {car.description}
            </p>
          </div>

          {/* Publisher Info */}
          <div className="mt-6 border-t border-gray-600 pt-4">
            <h2 className="text-xl font-semibold mb-2">Publisher Info</h2>
            <p className="flex items-center gap-2 text-gray-300">
              <FaUser /> {car.publisherName}{" "}
              {car.publisherEmail === user?.emailAddresses[0].emailAddress &&
                "(You)"}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <MdEmail /> {car.publisherEmail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Detail = ({ label, value, icon, fade }) => (
  <div
    className="bg-gray-700/50 rounded-lg p-3 flex flex-col shadow-inner"
    data-aos={fade}
  >
    <span className="text-sm text-gray-400">{label}</span>
    <span className="text-lg font-semibold flex items-center gap-2">
      {icon} {value}
    </span>
  </div>
);
