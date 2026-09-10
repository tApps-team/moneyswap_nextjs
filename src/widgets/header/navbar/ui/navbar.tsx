"use client";
import { ArrowRight } from "lucide-react";
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
import { desktopNavbarItems } from "../model/navbarItems";

/*
 * Один класс на триггеры и на простые ссылки.
 *
 * Структурная часть (inline-flex, фиксированная высота, выравнивание) —
 * обязательна: NavigationMenuLink рисуется обычным инлайновым <a>, и без неё
 * пункты без панели встают по базовой линии, а не по центру, из-за чего строка
 * меню разъезжается лесенкой.
 */
const TRIGGER_CLASSES =
  "inline-flex h-9 w-max items-center justify-center rounded-[10px] transition-colors " +
  "unbounded_font bg-transparent uppercase text-[10px] font-light px-3 " +
  "hover:bg-yellow-main hover:text-black data-[state=open]:text-black";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu orientation="horizontal">
      <NavigationMenuList className="lg:space-x-0 xl:space-x-1">
        {desktopNavbarItems.map((item) => {
          const panelItems = item.items ?? item.children;
          const isActive = pathname === item.href;

          // Пункт без панели — обычная ссылка: триггер без содержимого
          // всё равно ловил бы состояние открытия и клавиатурную семантику меню
          if (!panelItems) {
            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  asChild
                  className={cn(TRIGGER_CLASSES, isActive && "text-yellow-main")}
                >
                  <Link href={item.href}>{item.value}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          return (
            // relative — точка отсчёта для панели: без неё Radix позиционирует
            // содержимое от всего списка, и панель открывается под чужим пунктом
            <NavigationMenuItem key={item.href} className="relative">
              <NavigationMenuTrigger
                className={cn(TRIGGER_CLASSES, isActive && "text-yellow-main")}
                asChild
              >
                <Link href={item.href}>{item.value}</Link>
              </NavigationMenuTrigger>

              {/* Панель группы: разделы направления и ссылка на его хаб */}
              {item.items && (
                <NavigationMenuContent
                  className={cn(
                    "shadow-[0px_2px_5px_1px_rgba(0,0,0,0.35)] bg-new-dark-grey border-none rounded-[6px] text-white",
                    // Префикс md: обязателен: базовые классы Radix-контента
                    // (md:absolute, md:w-[…viewport-width]) заданы с ним же, и без
                    // совпадающего модификатора twMerge их не вытеснит.
                    // Центрировать через translate нельзя: transform занят анимацией открытия.
                    "md:absolute md:top-full md:w-[300px] xl:md:w-[330px]",
                    item.align === "end" ? "md:left-auto md:right-0" : "md:left-0 md:right-auto",
                    "mt-0 p-3 grid gap-1",
                  )}
                >
                  {item.items.map((link) => (
                    <NavigationMenuLink
                      key={link.href}
                      href={link.href}
                      className="group flex items-start gap-2.5 rounded-[10px] p-2 transition-colors hover:bg-new-grey/60"
                    >
                      {typeof link.icon !== "string" && link.icon && (
                        <span className="grid place-items-center size-7 shrink-0 rounded-[8px] bg-[#43464E] text-yellow-main">
                          <link.icon width={16} height={16} />
                        </span>
                      )}
                      <span className="grid gap-1 min-w-0">
                        <span className="unbounded_font leading-none uppercase text-[11px] font-light transition-colors group-hover:text-yellow-main">
                          {link.value}
                        </span>
                        <span className="leading-tight text-[10px] text-[#878787] font-light line-clamp-2">
                          {link.description}
                        </span>
                      </span>
                    </NavigationMenuLink>
                  ))}

                  {item.moreHref && (
                    <>
                      <span className="block h-px bg-new-grey/60 mx-2 my-1" />
                      <NavigationMenuLink
                        href={item.moreHref}
                        className="group flex items-center justify-center gap-2 rounded-[10px] border border-new-grey/60 py-2 text-[11px] font-light uppercase text-yellow-main transition-colors hover:bg-new-grey/60"
                      >
                        Подробнее
                        <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
                      </NavigationMenuLink>
                    </>
                  )}
                </NavigationMenuContent>
              )}

              {/* «Поддержка»: одна колонка ссылок без хаба */}
              {item.children && (
                <NavigationMenuContent
                  className={cn(
                    "shadow-[0px_2px_5px_1px_rgba(0,0,0,0.35)] bg-new-dark-grey border-none rounded-[6px] p-3 grid gap-3 text-white",
                    item.align === "end" && "md:left-auto md:right-0",
                  )}
                >
                  {item.children.map((itemChildren) => (
                    <NavigationMenuLink
                      className="flex flex-col w-72"
                      key={`${itemChildren.href}  ${itemChildren.value}`}
                      href={itemChildren.href}
                    >
                      <div className="flex gap-2.5 justify-start items-start break-words">
                        {itemChildren.icon && (
                          <div className="bg-[#43464E] rounded-[6px] p-1">
                            {typeof itemChildren.icon === "string" ? (
                              <Image
                                src={"/phone-email.png"}
                                alt=""
                                width={30}
                                height={30}
                                className="w-[22px] h-auto"
                              />
                            ) : (
                              <itemChildren.icon
                                className="flex-shrink-0 text-yellow-main"
                                width={18}
                                height={18}
                              />
                            )}
                          </div>
                        )}
                        <div className="[&>p]:hover:text-yellow-main flex flex-col gap-1 min-w-0">
                          <p className="unbounded_font leading-none uppercase text-[11px] font-light">
                            {itemChildren.value}
                          </p>
                          <p className="leading-tight text-[10px] text-[#878787] font-light">
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
