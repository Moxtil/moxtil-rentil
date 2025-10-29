"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GPTLoaderSkeleton from "./components/GPTLoaderSkeleton";
export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    router.push("/browse");
  }, [user, isLoaded, isSignedIn]);

  return (
    <div>
      <GPTLoaderSkeleton />
    </div>
  );
}
