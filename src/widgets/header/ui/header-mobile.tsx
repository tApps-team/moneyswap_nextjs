import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/shared/assets";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/shared/ui";
import { navbarItems } from "../navbar/model/navbarItems";
export const HeaderMobile = () => {
  return (
    <header className="fixed mobile-xl:hidden block top-0 left-0 w-full backdrop-blur-md z-10 p-6 ">
      <div className="flex items-center justify-between">
        <Image src={"/logofull.svg"} alt="logo" width={200} height={300} />
        <Drawer direction="top">
          <DrawerTrigger asChild>
            <ArrowRightIcon />
          </DrawerTrigger>
          <DrawerContent className="h-svh bg-transparent p-2 border-none backdrop-blur-md ">
            <DrawerHeader className="flex items-center justify-between">
              <Image src={"/logofull.svg"} alt="logo" width={150} height={250} />
              <X />
            </DrawerHeader>
            <Accordion type="single" collapsible className=" w-full  ">
              {navbarItems.map((item, index) =>
                item?.children ? (
                  <AccordionItem
                    value={item.value}
                    key={item.value}
                    className="flex flex-col gap-1"
                  >
                    <AccordionTrigger className="font-medium uppercase mobile-xl:text-sm text-xs">
                      <DrawerClose asChild>
                        <Link href={item.href}>{item.value}</Link>
                      </DrawerClose>
                    </AccordionTrigger>
                    {item.children?.map((itemChildren) => (
                      <AccordionContent
                        key={itemChildren.value}
                        className="hover:text-yellow-main text-light-gray uppercase mobile-xl:text-xs text-2xs"
                      >
                        <Link target={itemChildren.href} href={itemChildren.href}>
                          {itemChildren.value}
                        </Link>
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                ) : (
                  <DrawerClose key={item.value} asChild>
                    <Link
                      className="font-medium uppercase mobile-xl:text-sm text-xs"
                      href={item.href}
                    >
                      {item.value}
                    </Link>
                  </DrawerClose>
                ),
              )}
            </Accordion>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
};
