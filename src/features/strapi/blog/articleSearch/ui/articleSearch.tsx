import { Search } from "lucide-react";

export const ArticleSearch = () => {
  return (
    <div className="relative">
      <input
        type="text"
        className="rounded-[12px] bg-[#000] text-[#fff] px-4 py-3 pr-10 w-full placeholder:text-[#fff] text-[10px] uppercase focus:outline-none"
        placeholder="Поиск статьи..."
      />
      <Search width={24} height={24} className="absolute right-3 top-[50%] -translate-y-2/4" />
    </div>
  );
};
