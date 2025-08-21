"use client";
import React, { useState } from "react";

export default function LikedBtn() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => setLiked(!liked)}
      aria-label="Like"
      className="w-[22px] h-[22px] relative cursor-pointer focus:outline-none"
    >
      <svg
        viewBox="0 0 24 24"
        fill={liked ? "red" : "none"}
        stroke="red"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-[24px] h-[24px] transition-transform duration-300 ease-in-out `}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
