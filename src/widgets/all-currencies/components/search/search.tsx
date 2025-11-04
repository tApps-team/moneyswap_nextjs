import { SearchIcon } from "lucide-react";
import { FC } from "react";
import { Input } from "@/shared/ui";

interface SearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const Search:FC<SearchProps> = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative">
      <SearchIcon
        width={22}
        height={22}
        className="absolute translate-y-2 left-3"
        color="#bbbbbb"
      />
      <Input
        className="rounded-[10px] pl-12 bg-new-light-grey border-none placeholder:text-light-gray placeholder:font-normal placeholder:transition-opacity focus:placeholder:opacity-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        color="#BBBBBB"
      />
  </div>
  );
};