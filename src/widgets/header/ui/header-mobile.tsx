import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, HeaderArrow } from "@/shared/assets";
import { routes } from "@/shared/router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DialogTitle,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/shared/ui";
import { navbarItems } from "../navbar/model/navbarItems";
export const HeaderMobile = () => {
  return (
    <header className="fixed  lg:hidden block top-0 left-0 w-full backdrop-blur-md z-50 p-5">
      <div className="flex h-10 items-center justify-between">
        <Link href={routes.home}>
          <Image src={"/logofull.svg"} alt="logo" width={150} height={250} />
        </Link>
        <Drawer direction="top">
          <DrawerTrigger asChild>
            <HeaderArrow className="size-5" />
          </DrawerTrigger>
          <DrawerContent className="h-svh bg-transparent border-none backdrop-blur-md">
            <DrawerHeader className="flex items-center justify-between p-6">
              <DialogTitle className="sr-only">navbar</DialogTitle>
              <Link href={routes.home}>
                <Image src={"/logofull.svg"} alt="logo" width={150} height={250} />
              </Link>
              <DrawerClose>
                <HeaderArrow className="size-5 rotate-90" />
              </DrawerClose>
            </DrawerHeader>
            <Accordion type="single" collapsible className=" w-full px-6">
              {navbarItems.map((item, index) =>
                item?.children ? (
                  <AccordionItem
                    value={item.value}
                    key={item.value}
                    className="flex flex-col gap-1"
                  >
                    <AccordionTrigger className="font-medium uppercase text-sm pb-5">
                      <p>{item.value}</p>
                    </AccordionTrigger>
                    {item.children?.map((itemChildren) => (
                      <AccordionContent
                        key={itemChildren.value}
                        className="hover:text-yellow-main text-light-gray uppercase text-xs font-medium"
                      >
                        <DrawerClose asChild>
                          <Link target="_self" href={itemChildren.href}>
                            {itemChildren.value}
                          </Link>
                        </DrawerClose>
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                ) : (
                  <DrawerClose key={item.value} asChild>
                    <Link className="font-medium uppercase text-sm" href={item.href}>
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
