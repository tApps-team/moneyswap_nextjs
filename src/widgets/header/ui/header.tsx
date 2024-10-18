import { HeadphonesIcon, WalletIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TelegramIcon } from "@/shared/assets";
import { routes } from "@/shared/router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  TelegramButton,
} from "@/shared/ui";
import { Navbar } from "../navbar";
export const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md z-10 p-4 bg-[rgba(45,45,45,0.8)]">
      <section className="max-w-[1300px] grid grid-flow-col gap-4 justify-between items-center mx-auto">
        <Link href={routes.home}>
          <Image
            src={"/logofull.svg"}
            alt="logo"
            width={100}
            height={100}
            className="w-[10vw] max-w-[150px] h-[31px] min-w-[70px]"
          />
        </Link>
        <Navbar />
        <div className="grid grid-flow-col gap-4 items-center text-sm justify-center cursor-pointer">
          <TelegramButton />
        </div>
      </section>
    </header>
  );
};
