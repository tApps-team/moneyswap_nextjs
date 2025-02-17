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
                "bg-transparent hover:bg-yellow-main hover:text-black font-bold uppercase rounded-[10px] p-6 data-[state=open]:text-black",
                pathname === item.href && "text-yellow-main ",
              )}
              asChild
            >
              <Link href={item.href}>{item.value}</Link>
            </NavigationMenuTrigger>
            {item.children && (
              <NavigationMenuContent className="bg-new-dark-grey border-none rounded-[6px] p-4 uppercase grid gap-2 text-white">
                {item.children.map((itemChildren) => (
                  <NavigationMenuLink
                    className="flex flex-col w-80 "
                    key={`${itemChildren.href}  ${itemChildren.value}`}
                    href={itemChildren.href}
                  >
                    <div className="flex gap-4 justify-start items-start  break-words ">
                      {itemChildren.icon && (
                        <div className="bg-[#43464E] rounded-[6px] p-1.5">
                          <itemChildren.icon className="flex-shrink-0" width={24} height={24} />
                        </div>
                      )}

                      <div className="[&>p]:hover:text-yellow-main flex flex-col gap-2 ">
                        <p className="text-sm  font-bold">{itemChildren.value}</p>
                        <p className="text-xs text-[#878787] font-normal">
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
