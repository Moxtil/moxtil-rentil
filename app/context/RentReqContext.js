"use client";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  where,
} from "firebase/firestore";
import React, { createContext, useState, useEffect } from "react";
import { db } from "../firebase/config";

export const RentContext = createContext();
export const RentReqProvider = ({ children }) => {
  const [reqStatus, setReqStatus] = useState("");
  const [requests, setRequests] = useState([]);
  const [usersReqs, setUsersReqs] = useState([]);
  const { user } = useUser();

  // send rent request
  const rentReq = async (item) => {
    if (!user) return;

    try {
      const ref = doc(
        db,
        "reqs",
        user?.emailAddresses[0].emailAddress,
        "requests",
        item.id
      );

      await setDoc(ref, {
        sender: user?.fullName,
        email: user.emailAddresses[0].emailAddress,
        carOwner: item.publisherEmail,
        carId: item.id,
        text: "Want To Rent Your Car",
        status: "pending",
        createdAt: new Date(),
        title: item.title,
        imageUrl: item.imageUrl,
        brand: item.brand,
        color: item.color,
        model: item.model,
        price: item.price,
        availability: item.availability,
      });

      setReqStatus("pending");
    } catch (error) {
      console.error("Failed to send rent request:", error);
    }
  };

  // fetch request status by id
  const fetchReqStatus = async (email, id) => {
    if (!email || !id) return null;

    try {
      const ref = doc(db, "reqs", email, "requests", id);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        return snapshot.data().status;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error fetching request status:", err);
      return null;
    }
  };

  // fetch all rent requests
  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const q = collectionGroup(db, "requests");
        const snapshot = await getDocs(q);
        const allReqs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(allReqs);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchAllRequests();
  }, []);

  // fetch rent request that user has sent
  useEffect(() => {
    if (!user?.emailAddresses[0]?.emailAddress) return;

    const userEmail = user.emailAddresses[0].emailAddress;
    const q = collection(db, "reqs", userEmail, "requests");

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allReqs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsersReqs(allReqs);
      },
      (error) => {
        console.error("Error fetching requests:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <RentContext.Provider
      value={{
        rentReq,
        requests,
        setRequests,
        reqStatus,
        setReqStatus,
        fetchReqStatus,
        usersReqs,
      }}
    >
      {children}
    </RentContext.Provider>
  );
};
