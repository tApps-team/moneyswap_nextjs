"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/router";
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
        {navbarItems.map((item) => {
          const mega = item.layout === "mega";

          return (
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

              {/* Мега-панель: колонка на каждую группу разделов */}
              {mega && item.groups && (
                <NavigationMenuContent
                  className={cn(
                    "shadow-[0px_2px_5px_1px_rgba(0,0,0,0.35)] bg-new-dark-grey border-none rounded-[6px] text-white",
                    // Панель позиционируется по экрану, а не по своему пункту меню,
                    // иначе при четырёх колонках она уезжает за правый край. Префикс md: обязателен:
                    // базовые классы Radix-контента (md:absolute, md:w-[…viewport-width]) заданы с ним же,
                    // и без совпадающего модификатора twMerge их не вытеснит.
                    // Центрируем через inset-x-0 + mx-auto, а не translate: transform у панели
                    // занят анимацией открытия и перебил бы центрирование.
                    "md:fixed md:top-[74px] md:inset-x-0 md:mx-auto md:w-[min(calc(100vw-40px),1240px)]",
                    "mt-0 p-5 grid grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-5",
                  )}
                >
                  {item.groups.map((group) => (
                    <div key={group.key} className="grid content-start gap-1 min-w-0">
                      {/* Фиксированная высота шапки: «Международные платежи» переносится
                          на две строки, и без неё разделители в колонках не совпадают */}
                      <NavigationMenuLink
                        href={group.href}
                        className="group flex items-center gap-2.5 rounded-[10px] p-2 min-h-[56px] transition-colors hover:bg-new-grey/60"
                      >
                        <span className="grid place-items-center size-9 shrink-0 rounded-[10px] bg-[#43464E] text-yellow-main">
                          <group.icon width={20} height={20} />
                        </span>
                        <span className="unbounded_font uppercase text-xs font-normal leading-tight text-yellow-main min-w-0">
                          {group.title}
                        </span>
                      </NavigationMenuLink>

                      <span className="block h-px bg-new-grey/60 mx-2 mb-1" />

                      {group.items.map((link) => (
                        <NavigationMenuLink
                          key={`${group.key}-${link.href}`}
                          href={link.href}
                          className="group flex flex-col gap-1 min-w-0 rounded-[10px] px-2 py-2 transition-colors hover:bg-new-grey/60"
                        >
                          <span className="unbounded_font leading-none uppercase text-sm font-normal transition-colors group-hover:text-yellow-main">
                            {link.value}
                          </span>
                          <span className="hidden xl:block leading-tight text-xs text-[#878787] font-normal line-clamp-2">
                            {link.description}
                          </span>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  ))}

                  <NavigationMenuLink
                    href={routes.ratings}
                    className="group col-span-full flex items-center justify-center gap-2 rounded-[10px] border border-new-grey/60 py-2.5 text-sm text-yellow-main transition-colors hover:bg-new-grey/60"
                  >
                    Все рейтинги
                    <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </NavigationMenuLink>
                </NavigationMenuContent>
              )}

              {/* Обычный дропдаун в одну колонку */}
              {!mega && item.children && (
                <NavigationMenuContent className="shadow-[0px_2px_5px_1px_rgba(0,0,0,0.35)] bg-new-dark-grey border-none rounded-[6px] p-4 grid gap-4 text-white">
                  {item.children.map((itemChildren) => (
                    <NavigationMenuLink
                      className="flex flex-col w-80"
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
                              <itemChildren.icon
                                className="flex-shrink-0 text-yellow-main"
                                width={24}
                                height={24}
                              />
                            )}
                          </div>
                        )}
                        <div className="[&>p]:hover:text-yellow-main flex flex-col gap-1 min-w-0">
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
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
