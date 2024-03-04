"use client";
import { memo } from "react";
import { Input } from "@/shared/ui";
// Todo возможно можно обойтись без стора, и просто прокидывать value и onChange пропсами, так будет лучше
type SearchProps = {
  searchValue: string;
  onChange: (valute: string) => void;
};
export const Search = memo((props: SearchProps) => {
  const { onChange, searchValue } = props;

  return (
    <Input
      className="text-slate-950 rounded-xl text-xl"
      value={searchValue}
      onChange={(e) => onChange(e.target.value.trim())}
      placeholder="search..."
    />
  );
});
