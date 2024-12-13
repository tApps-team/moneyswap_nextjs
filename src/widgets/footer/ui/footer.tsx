import Link from "next/link";
import { SocialNetworks } from "@/features/social-networks";
import { FooterLogoIcon } from "@/shared/assets";
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
        <div className="my-0 max-w-[1300px] mx-auto flex flex-col gap-6">
          <div className="flex md:flex-col xl:flex-row justify-between gap-12">
            <section className="flex md:flex-row xl:flex-col md:justify-between gap-2">
              <Link href={routes.home}>
                <FooterLogoIcon width={300} height={100} />
              </Link>
              <SocialNetworks />
            </section>
            <section className="flex md:justify-between md:gap-6 xl:gap-14 items-start">
              {footerItems.map((item, index) => (
                <ul key={item.value} className="flex flex-col md:gap-6 xl:gap-3">
                  <p className="font-normal uppercase text-base">{item.value}</p>
                  {item.children?.map((itemChildren) => (
                    <li
                      key={itemChildren.value}
                      className="hover:text-yellow-main uppercase text-xs font-light"
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
            <p className="uppercase">© 2024 Moneyswap.online</p>
          </section>
        </div>
      </footer>
    </>
  );
};
