import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TelegramIcon } from "@/shared/assets";
import { products, routes } from "@/shared/router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  ScrollArea,
} from "@/shared/ui";
import { navbarItems } from "../navbar/model/navbarItems";

export const HeaderMobile = () => {
  return (
    <header className="fixed lg:hidden block top-0 left-0 w-full backdrop-blur-md z-50 py-5 mobile-xl:px-[25px] px-[15px]">
      <div className="flex h-10 items-center justify-between">
        <Link href={routes.home}>
          <Image
            src={"/logofull.svg"}
            alt="logo"
            width={150}
            height={250}
            className="mobile-xl:w-[150px] w-[120px]"
          />
        </Link>
        <Drawer direction="top" handleOnly>
          <DrawerTrigger asChild>
            <Menu className="mobile-xl:size-10 size-8 stroke-[1.5px]" />
          </DrawerTrigger>
          <DrawerContent className="h-dvh w-full rounded-none bg-new-bg border-0 mobile-xl:px-[60px] px-5 pb-5">
            <DrawerHeader className="grid justify-end justify-items-end mobile-xl:pt-12 pt-5 pb-[38px] px-0">
              <DrawerTitle className="sr-only">navbar</DrawerTitle>
              <DrawerClose>
                <Menu className="mobile-xl:size-10 size-8 stroke-[1.5px]" />
              </DrawerClose>
            </DrawerHeader>
            <DrawerDescription className="sr-only">description</DrawerDescription>
            <div className="grid grid-flow-row w-full mobile-xl:gap-[80px] gap-[60px]">
            <div className="grid justify-between items-center grid-flow-col">
              <Link href={routes.home} className="mobile-xl:w-[200px] w-[150px] h-fit">
                <img src={"/logofull.svg"} alt="logo" width={200} />
              </Link>
              <Link
                href={products.telegram_bot}
                target="_blank"
                rel="noopener noreferrer"
                className={` w-fit cursor-pointer grid grid-flow-col gap-6 justify-center items-center justify-items-center bg-[#039BE5] mobile-xl:rounded-[10px] rounded-[7px] mobile-xl:py-[10px] mobile-xl:px-[15px] p-2 hover:scale-[1.025] duration-300 active:scale-[0.99]`}
              >
                <div className="relative bg-[#039BE5] mobile-xl:h-10 mobile-xl:w-10 h-6 w-6 size-[42px] hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 grid grid-flow-col gap-4 items-center text-sm justify-center justify-items-center cursor-pointer rounded-full border-white mobile-xl:border-[1px] border-0">
                  <TelegramIcon className="size-6 absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[54%]" />
                </div>
                <p className="mobile-xl:block hidden uppercase text-lg truncate font-normal">
                  Телеграм-бот
                </p>
              </Link>
            </div>
            <ScrollArea className="mobile-xl:max-h-[calc(100svh_-_126px_-_80px_-_60px)] max-h-[calc(100svh_-_90px_-_60px_-_40px)]">
              <Accordion type="single" collapsible className="flex flex-col gap-4 w-full pb-10">
                {navbarItems.map((item) =>
                  item?.children ? (
                    <AccordionItem value={item.value} key={item.value} className="">
                      <AccordionTrigger className="font-bold bg-new-dark-grey mobile-xl:rounded-[15px] rounded-[10px] mobile-xl:py-7 mobile-xl:px-12 p-5 uppercase mobile-xl:text-xl text-sm">
                        <p className="leading-none">{item.value}</p>
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-6 hover:text-yellow-main p-0 pt-6 pb-2 mobile-xl:pl-[50px] pl-5">
                        {item.children?.map((itemChildren) => (
                          <DrawerClose asChild key={itemChildren.value}>
                            <Link target="_self" href={itemChildren.href}>
                              <div className="grid grid-cols-[auto,1fr] gap-4 break-words">
                                {itemChildren.icon && (
                                  <div className="bg-new-dark-grey rounded-[6px] mobile-xl:size-[48px] size-8 mobile-xl:p-1.5 p-1">
                                    {typeof itemChildren.icon === "string" ? (
                                      <Image
                                        // src={itemChildren.icon as string}
                                        src={"/phone-email.png"}
                                        alt=""
                                        width={100}
                                        height={100}
                                        className="w-full h-full"
                                      />
                                    ) : (
                                      <itemChildren.icon className="w-full h-full" />
                                    )}
                                  </div>
                                )}
                                <div className="grid grid-flow-row gap-[2px] h-full content-between items-stretch">
                                  <p className="leading-none uppercase mobile-xl:text-xl text-sm text-white font-bold">
                                    {itemChildren.value}
                                  </p>
                                  <p className="leading-tight mobile-xl:text-sm text-xs text-[#878787] font-normal">
                                    {itemChildren.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </DrawerClose>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <DrawerClose
                      key={item.value}
                      asChild
                      className="font-bold bg-new-dark-grey mobile-xl:rounded-[15px] rounded-[10px] mobile-xl:py-7 mobile-xl:px-12 p-5 uppercase mobile-xl:text-xl text-sm w-full"
                    >
                      <Link href={item.href}>{item.value}</Link>
                    </DrawerClose>
                  ),
                )}
              </Accordion>
            </ScrollArea>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
};
