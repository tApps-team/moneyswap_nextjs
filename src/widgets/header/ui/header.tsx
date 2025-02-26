import Image from "next/image";
import Link from "next/link";
import { routes } from "@/shared/router";
import { TelegramButton } from "@/shared/ui";
import { Navbar } from "../navbar";
import { HeaderMobile } from "./header-mobile";
// TODO refactoring
export const Header = () => {
  return (
    <>
      <HeaderMobile />
      <header className="fixed lg:block hidden top-0 left-0 w-full backdrop-blur-md z-10 py-4 bg-new-dark-grey px-[25px]">
        <section className="max-w-[1400px] grid grid-flow-col gap-4 justify-between items-center mx-auto">
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
    </>
  );
};
