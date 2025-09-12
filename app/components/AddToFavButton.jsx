"use client";
import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

import LikedBtn from "./LikedBtn";
import { FavContext } from "../context/ToggleFavContext";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AddToFavButton({ item, size }) {
  const router = useRouter();
  const { toggleFavorite } = useContext(FavContext);

  const [favoriteIds, setFavoriteIds] = useState([item.id]);

  const { user } = useUser();

  const loadFavorites = async (user) => {
    if (!user) return;

    const favRef = collection(db, "users", user?.id, "favorite-cars");
    const snapshot = await getDocs(favRef);

    const ids = snapshot.docs.map((doc) => doc.data().product.id);

    setFavoriteIds(ids);
  };
  useEffect(() => {
    loadFavorites(user);
  }, []);

  const isFavorite = favoriteIds.includes(item.id);
  return (
    <div
      onClick={async () => {
        if (!user) {
          router.push("/sign-up");
        } else {
          await toggleFavorite(user, item);
          loadFavorites(user);
        }
      }}
      className="rounded-full bg-white p-1.5"
    >
      {isFavorite && user ? (
        <button
          aria-label="Like"
          className="w-[22px] h-[22px] relative cursor-pointer focus:outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            fill={"red"}
            stroke="red"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-[24px] h-[24px] transition-transform duration-300 ease-in-out `}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      ) : (
        <LikedBtn />
      )}
    </div>
  );
}
