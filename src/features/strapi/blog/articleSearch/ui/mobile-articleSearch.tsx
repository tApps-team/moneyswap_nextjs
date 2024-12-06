"use client";

import { Loader, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { routes } from "@/shared/router";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const MobileArticleSearch = ({ currentValue }: { currentValue: string | null }) => {
  const [searchValue, setSearchValue] = useState(currentValue || "");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const router = useRouter();

  useEffect(() => {
    if (debouncedSearchValue.trim().length >= 3) {
      router.push(`${routes.blog}?search=${debouncedSearchValue}`);
    }
    setIsLoading(false);
  }, [debouncedSearchValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (e.target.value.trim().length >= 3) {
      setIsLoading(true);
    } else if (e.target.value.trim().length === 0) {
      setIsLoading(false);

      router.push(routes.blog);
    }
  };

  return (
    <div className="relative md:hidden block">
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        className="rounded-3xl bg-dark-gray text-light-gray px-3 py-2 pl-12 w-full placeholder:text-light-gray uppercase focus:outline-none placeholder:transition-opacity placeholder:duration-400 focus:placeholder:opacity-0 placeholder:opacity-1 border-2 border-light-gray"
        placeholder="Поиск статьи..."
      />
      <button className="absolute left-4 top-[50%] -translate-y-2/4">
        {isLoading ? (
          <Loader className="animate-spin h-6" />
        ) : (
          <Search className="stroke-light-gray h-6 w-6" />
        )}
      </button>
    </div>
  );
};
