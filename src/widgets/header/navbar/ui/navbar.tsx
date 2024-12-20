"use client";
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
                "font-normal bg-transparent hover:bg-yellow-main uppercase rounded-3xl p-6 data-[state=open]:text-black",
                pathname === item.href && "text-yellow-main ",
              )}
            >
              <Link href={item.href}>{item.value}</Link>
            </NavigationMenuTrigger>
            {item.children && (
              <NavigationMenuContent className="bg-dark-gray shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] border-none rounded-2xl p-4 uppercase grid gap-2 text-white">
                {item.children.map((itemChildren) => (
                  <NavigationMenuLink
                    className="flex flex-col w-80 "
                    key={`${itemChildren.href}  ${itemChildren.value}`}
                    href={itemChildren.href}
                  >
                    <div className="flex gap-4 justify-start items-center  break-words ">
                      {itemChildren.icon && (
                        <itemChildren.icon className="flex-shrink-0" width={36} height={36} />
                      )}

                      <div className="[&>p]:hover:text-yellow-main ">
                        <p className="text-sm font-normal">{itemChildren.value}</p>
                        <p className="text-3xs font-light">{itemChildren.description}</p>
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
