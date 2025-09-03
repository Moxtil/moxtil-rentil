"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { LargeLoadingSkeleton } from "./components/LargeLoadingSkeleton";
export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    router.push("/browse");
  }, [user, isLoaded, isSignedIn]);

  return (
    <div className="flex flex-col gap-8 mt-10 p-6">
      <LargeLoadingSkeleton />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    </div>
  );
}
