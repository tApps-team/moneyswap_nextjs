"use client";
import { ChangeEvent, useState } from "react";
import { Input } from "@/shared/ui";
import { useSearchStore } from "..";
// Todo возможно можно обойтись без стора, и просто прокидывать value и onChange пропсами, так будет лучше
export const Search = () => {
  // const [searchValue, setSearchValue] = useState("");
  const { searchValue, setSearchValue } = useSearchStore();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <Input
      className="text-slate-950 rounded-xl text-xl"
      value={searchValue}
      onChange={handleChange}
      placeholder="search..."
    />
  );
};
