"use client";
import { useEffect, useState } from "react";

const useDebounce = (query: string, delay: number = 500) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return {
    debouncedQuery,
  };
};

export default useDebounce;
