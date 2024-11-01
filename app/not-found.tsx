import Image from "next/image";
import searchAnimation from "/public/animated/search_spin.gif";

export default function NotFound() {
  return (
    <div className="w-full h-[80dvh] flex flex-col justify-center items-center gap-10">
      <Image src={searchAnimation} alt="search spin" className="w-[10vw] h-[10vw]" />
      <p className="uppercase text-xl font-medium">Oops! Страница не найдена</p>
    </div>
  );
}
