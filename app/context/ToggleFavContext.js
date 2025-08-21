"use client";
import { useUser } from "@clerk/nextjs";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { db } from "../firebase/config";

export const FavContext = createContext();

export const ToggleFavContext = ({ children }) => {
  const [favCars, setFavCars] = useState([]);
  const { user, isLoaded } = useUser();

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const favRef = collection(db, "users", user?.id, "favorite-cars");
      const snapshot = await getDocs(favRef);
      const items = snapshot.docs.map((doc) => doc.data().product);
      setFavCars(items);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Add or remove from favorites
  const toggleFavorite = async (user, item) => {
    if (!user) return;

    const favRef = collection(db, "users", user.id, "favorite-cars");

    try {
      const q = query(favRef, where("product.id", "==", item.id));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Remove from favorites
        const existingDocId = snapshot.docs[0].id;
        await deleteDoc(
          doc(db, "users", user.id, "favorite-cars", existingDocId)
        );
      } else {
        await addDoc(favRef, {
          product: {
            id: item.id,
            title: item.title,
            imageUrl: item.imageUrl,
            brand: item.brand,
            color: item.color,
            model: item.model,
            status: item.status,
            price: item.price,
            publisherEmail: item.publisherEmail,
            availability: item.availability,
            createdAt: new Date(),
          },
          createdAt: new Date(),
        });
      }
      loadFavorites();
    } catch (error) {
      console.error("Error toggling favorite item:", error);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      loadFavorites();
    }
  }, [isLoaded, user]);

  return (
    <FavContext.Provider value={{ toggleFavorite, favCars, setFavCars }}>
      {children}
    </FavContext.Provider>
  );
};
