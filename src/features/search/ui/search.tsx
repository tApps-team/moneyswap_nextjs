"use client";
import { memo } from "react";
import { Input } from "@/shared/ui";
// Todo возможно можно обойтись без стора, и просто прокидывать value и onChange пропсами, так будет лучше
type SearchProps = {
  searchValute: string;
  onChange: (valute: string) => void;
};
export const Search = memo((props: SearchProps) => {
  // const [searchValue, setSearchValue] = useState("");
  const { onChange, searchValute } = props;
  // const { searchValue, setSearchValue } = useSearchStore();

  return (
    <Input
      className="text-slate-950 rounded-xl text-xl"
      value={searchValute}
      onChange={(e) => onChange(e.target.value.trim())}
      placeholder="search..."
    />
  );
});
