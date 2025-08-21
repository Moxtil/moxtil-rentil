"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const SearchSync = ({ setSearch }) => {
  const searchParams = useSearchParams();
  const searchingQuery = searchParams.get("search") || "";

  useEffect(() => {
    setSearch(searchingQuery);
  }, [searchingQuery, setSearch]);

  return null;
};
