import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FC } from "react";
import { routes } from "@/shared/router";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  route: routes;
}

export const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, route }) => {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search");
  const createPaginationArray = () => {
    const pages = [];

    if (totalPages <= 7) {
      // Если страниц меньше или равно 7, показываем все страницы
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Если страниц больше 7, добавляем логику с многоточиями
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const pages = createPaginationArray();

  return (
    <div className="shadow-[inset_1px_1px_5px_2px_rgba(0,0,0,0.3)] rounded-[35px] bg-dark-gray grid grid-flow-col place-content-between gap-0   items-center">
      {pages.map((page, index) =>
        typeof page === "number" ? (
          <Link
            key={index}
            href={`${route}?page=${page}${searchValue ? `&search=${searchValue}` : ""}`}
            className={`mobile-xl:h-12 mobile-xl:w-12 mobile-xl:text-xs w-10 h-10 text-[10px] font-normal flex justify-center items-center rounded-full p-2 border-0 border-dark-gray transition-all duration-300 ${page === currentPage ? "bg-yellow-main text-dark-gray" : "hover:shadow-[inset_1px_1px_5px_2px_rgba(0,0,0,0.5)] transition-all duration-300"}`}
            scroll={false}
          >
            {page}
          </Link>
        ) : (
          <span
            key={index}
            className="h-12 w-12 font-normal flex justify-center items-center text-yellow-main"
          >
            {page}
          </span>
        ),
      )}
    </div>
  );
};
