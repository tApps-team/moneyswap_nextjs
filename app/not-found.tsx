import Image from "next/image";
import searchAnimation from "/public/animated/search_spin.gif";

export default function NotFound() {
  return (
    <div className="w-full h-[80dvh] flex flex-col justify-center items-center gap-10">
      <Image
        src={searchAnimation}
        alt="search spin"
        className="mobile-xl:w-[10vw] mobile-xl:h-[10vw] w-[30vw] h-[30vw]"
      />
      <p className="uppercase md:text-xl mobile-xl:text-lg text-sm font-medium">
        Oops! Страница не найдена
      </p>
    </div>
  );
}
