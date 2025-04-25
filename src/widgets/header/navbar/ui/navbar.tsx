"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/ui";
import { navbarItems } from "../model/navbarItems";

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <NavigationMenu orientation="horizontal">
      <NavigationMenuList className="">
        {navbarItems.map((item) => (
          <NavigationMenuItem className="" key={item.href}>
            <NavigationMenuTrigger
              className={cn(
                "unbounded_font bg-transparent hover:bg-yellow-main hover:text-black font-normal uppercase rounded-[10px] p-6 data-[state=open]:text-black",
                pathname === item.href && "text-yellow-main ",
              )}
              asChild
            >
              <Link href={item.href}>{item.value}</Link>
            </NavigationMenuTrigger>
            {item.children && (
              <NavigationMenuContent className="shadow-[0px_2px_5px_1px_rgba(0,0,0,0.35)] bg-new-dark-grey border-none rounded-[6px] p-4 grid gap-4 text-white">
                {item.children.map((itemChildren) => (
                  <NavigationMenuLink
                    className="flex flex-col w-80 "
                    key={`${itemChildren.href}  ${itemChildren.value}`}
                    href={itemChildren.href}
                  >
                    <div className="flex gap-2.5 justify-start items-start break-words">
                      {itemChildren.icon && (
                        <div className="bg-[#43464E] rounded-[6px] p-1.5">
                          {typeof itemChildren.icon === "string" ? (
                            <Image
                              // src={itemChildren.icon as string}
                              src={"/phone-email.png"}
                              alt=""
                              width={30}
                              height={30}
                              className="w-7 h-auto"
                            />
                          ) : (
                            <itemChildren.icon className="flex-shrink-0 text-yellow-main" width={24} height={24} />
                          )}
                        </div>
                      )}
                      <div className="[&>p]:hover:text-yellow-main flex flex-col gap-1">
                        <p className="unbounded_font leading-none uppercase text-sm font-normal">
                          {itemChildren.value}
                        </p>
                        <p className="leading-tight text-xs text-[#878787] font-normal">
                          {itemChildren.description}
                        </p>
                      </div>
                    </div>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
