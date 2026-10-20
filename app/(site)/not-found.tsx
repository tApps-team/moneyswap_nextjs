import Image from "next/image";
import searchAnimation from "/public/animated/search_spin.gif";
import Link from "next/link";
import { routes } from "@/shared/router";

export default function NotFound() {
  return (
    <div className="w-full h-[80dvh] flex flex-col justify-center items-center gap-10">
      <Image
        src={searchAnimation}
        alt="search spin"
        className="mobile-xl:w-[10vw] mobile-xl:h-[10vw] w-[30vw] h-[30vw]"
      />
      <p className="md:text-xl mobile-xl:text-lg text-sm font-normal">Oops! Страница не найдена</p>
      <Link
        href={routes.home}
        className="cursor-pointer hover:bg-new-grey hover:text-white transition-all duration-300 md:text-base mobile:text-sm text-xs font-normal p-4 rounded-[10px] bg-yellow-main text-black"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
