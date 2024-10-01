import Link from "next/link";
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
  return (
    <NavigationMenu orientation="horizontal">
      <NavigationMenuList className="">
        {navbarItems.map((item) => (
          <NavigationMenuItem className="" key={item.href}>
            <NavigationMenuTrigger className="bg-transparent hover:bg-[#f6ff5f] uppercase rounded-3xl p-6">
              <Link href={item.href}>{item.value}</Link>
            </NavigationMenuTrigger>
            {item.children && (
              <NavigationMenuContent className="bg-[#2d2d2d] shadow-[1px_3px_10px_3px_rgba(0,0,0,0.7)] border-none rounded-2xl p-4 uppercase grid gap-2 text-white">
                {item.children.map((itemChildren) => (
                  <NavigationMenuLink
                    className="flex flex-col w-80 "
                    key={itemChildren.href}
                    href={itemChildren.href}
                  >
                    <div className="flex gap-4 justify-start items-center  break-words ">
                      {itemChildren.icon && (
                        <itemChildren.icon className="flex-shrink-0" width={32} height={32} />
                      )}

                      <div className="[&>p]:hover:text-[#f6ff5f] ">
                        <p className="text-sm  font-medium">{itemChildren.value}</p>
                        <p className="text-[8px] ">{itemChildren.description}</p>
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
