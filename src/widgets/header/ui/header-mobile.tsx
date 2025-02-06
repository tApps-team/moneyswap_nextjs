import Image from "next/image";
import Link from "next/link";
import { HeaderArrow } from "@/shared/assets";
import { routes } from "@/shared/router";
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
} from "@/shared/ui";
import { navbarItems } from "../navbar/model/navbarItems";
export const HeaderMobile = () => {
  return (
    <header className="fixed lg:hidden block top-0 left-0 w-full backdrop-blur-md z-50 p-5">
      <div className="flex h-10 items-center justify-between">
        <Link href={routes.home}>
          <Image src={"/logofull.svg"} alt="logo" width={150} height={250} />
        </Link>
        <Drawer direction="top">
          <DrawerTrigger asChild>
            <HeaderArrow className="size-5" />
          </DrawerTrigger>
          <DrawerContent className="h-svh flex  flex-col bg-new-bg border-0 backdrop-blur-md">
            <DrawerHeader className="flex items-center justify-between p-6">
              <DrawerTitle className="sr-only">navbar</DrawerTitle>
              <Link href={routes.home}>
                <Image src={"/logofull.svg"} alt="logo" width={150} height={250} />
              </Link>
              <DrawerClose>
                <HeaderArrow className="size-5 rotate-90" />
              </DrawerClose>
            </DrawerHeader>
            <DrawerDescription className="sr-only">description</DrawerDescription>
            <Accordion type="single" collapsible className="flex flex-col gap-4 w-full px-6">
              {navbarItems.map((item) =>
                item?.children ? (
                  <AccordionItem
                    value={item.value}
                    key={item.value}
                    className="flex flex-col gap-1"
                  >
                    <AccordionTrigger className="font-bold bg-new-dark-grey rounded-[20px] py-4 px-12  uppercase text-sm ">
                      <p>{item.value}</p>
                    </AccordionTrigger>
                    {item.children?.map((itemChildren) => (
                      <AccordionContent
                        key={itemChildren.value}
                        className="hover:text-yellow-main text-light-gray uppercase text-xs font-normal"
                      >
                        <DrawerClose asChild>
                          <Link target="_self" href={itemChildren.href}>
                            <div className="flex gap-4 justify-start items-start  break-words ">
                              {itemChildren.icon && (
                                <div className="bg-new-dark-grey rounded-[6px] p-1.5">
                                  <itemChildren.icon
                                    className="flex-shrink-0"
                                    width={24}
                                    height={24}
                                  />
                                </div>
                              )}

                              <div className=" flex flex-col gap-2 ">
                                <p className="text-sm text-white font-bold">{itemChildren.value}</p>
                                <p className="text-xs text-[#878787] font-normal">
                                  {itemChildren.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </DrawerClose>
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                ) : (
                  <DrawerClose key={item.value} asChild>
                    <Link
                      className="font-bold bg-new-dark-grey rounded-[20px] py-4 px-12  uppercase text-sm w-full"
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
