"use client";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    router.push("/browse");
  }, [user, isLoaded, isSignedIn]);

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-10 my-10">
      <div className="text-lg font-semibold text-white">
        Redirecting user...
      </div>
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
