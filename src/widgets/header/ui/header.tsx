import { HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import { TelegramIcon } from "@/shared/assets";
import { routes } from "@/shared/router";
import { Navbar } from "../navbar";

export const Header = () => {
  return (
    <header className="p-4 bg-[#2d2d2d]">
      <section className="max-w-[1300px] grid grid-flow-col gap-4 justify-between items-center mx-auto">
        <Link href={routes.home}>
          <img src={"/logofull.svg"} alt="logo" className="w-[10vw] max-w-[150px] min-w-[70px]" />
        </Link>
        <Navbar />
        <div className="grid grid-flow-col gap-4 items-center text-sm">
          <a
            href="https://t.me/moneyswap_robot"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-[1.1] transition-all duration-300"
          >
            <TelegramIcon width={24} height={24} fill="#27aed6" />
          </a>
          <a href="tel:+79991112233" className="hover:scale-[1.1] transition-all duration-300">
            <HeadphonesIcon width={24} height={24} />
          </a>
          <a href="tel:+79991112233" className="hover:scale-[1.05] transition-all duration-300">
            +7 999 111-22-33
          </a>
        </div>
      </section>
    </header>
  );
};
