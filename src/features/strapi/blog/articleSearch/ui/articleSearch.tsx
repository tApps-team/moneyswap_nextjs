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

export const ArticleSearch = ({ currentValue }: { currentValue: string | null }) => {
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
    <div className="relative">
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        className="rounded-[10px] bg-new-light-grey text-white px-4 py-3 pr-10 w-full placeholder:text-font-light-grey 
        text-sm focus:outline-none placeholder:transition-opacity placeholder:duration-400 focus:placeholder:opacity-0 placeholder:opacity-1 font-light"
        placeholder="Поиск статьи..."
      />
      <button className="absolute right-3 top-2.5">
        {isLoading ? (
          <Loader className="animate-spin h-6 text-font-light-grey" />
        ) : (
          <Search width={24} height={24} className="text-font-light-grey" />
        )}
      </button>
    </div>
  );
};
