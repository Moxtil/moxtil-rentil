"use client";

import { createContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      if (!isSignedIn) {
        setRole("user");
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", user.id);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(
          userRef,
          {
            id: user.id,
            name: user.fullName,
            email: user.emailAddresses[0].emailAddress,
            role: "user",
            avatar: user?.imageUrl,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
        setRole("user");
      } else {
        setRole(docSnap.data().role || "user");
      }

      setLoading(false);
    };

    syncUser();
  }, [isSignedIn, user]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
