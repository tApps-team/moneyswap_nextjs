"use client";
import { ChangeEvent, useState } from "react";
import { Input } from "@/shared/ui";

export const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  return (
    <Input
      className="text-slate-950 rounded-xl"
      value={searchValue}
      onChange={handleChange}
      placeholder="search..."
    />
  );
};
