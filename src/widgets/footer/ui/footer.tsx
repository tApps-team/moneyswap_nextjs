import Link from "next/link";
import { TelegramIcon } from "@/shared/assets";
import { FooterLogoIcon } from "@/shared/assets/icons/footer-logo-icon";
import { TelegramCircleIcon } from "@/shared/assets/icons/telegram-circle-icon";
import { routes } from "@/shared/router";
import { footerItems } from "../model/footerItems";
import { FooterMobile } from "./footer-mobile";

export const Footer = () => {
  return (
    <>
      <div className="md:hidden">
        <FooterMobile />
      </div>
      <footer className="md:block hidden p-6 bg-black">
        <div className="my-0 max-w-[1300px] mx-auto flex flex-col  gap-6  ">
          <div className="flex md:flex-col xl:flex-row justify-between  gap-12">
            <section className="flex md:flex-row xl:flex-col md:justify-between  gap-2 ">
              <Link href={routes.home}>
                <FooterLogoIcon width={300} height={100} />
              </Link>
              <div>
                <Link href={"https://t.me/MoneySwap_robot"} target="_blank">
                  <TelegramCircleIcon width={50} height={50} />
                </Link>
              </div>
            </section>
            <section className="flex md:justify-between md:gap-6 xl:gap-20 items-start">
              {footerItems.map((item, index) => (
                <ul key={item.value} className="flex flex-col md:gap-6 xl:gap-3">
                  <p className="font-medium uppercase text-sm">{item.value}</p>
                  {item.children?.map((itemChildren) => (
                    <li
                      key={itemChildren.value}
                      className="hover:text-yellow-main uppercase text-xs"
                    >
                      <Link target={itemChildren.target} href={itemChildren.href}>
                        {itemChildren.value}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </section>
          </div>
          <hr />
          <section className="flex items-center justify-between">
            <p className="uppercase">© moneyswap – мониторинг обменников. Все права защищены.</p>
            <p className="uppercase">© 2024 MoneYSWAP.RU</p>
          </section>
        </div>
      </footer>
    </>
  );
};
