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
        <div className="my-0 max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="grid lg:grid-flow-col grid-flow-row lg:justify-between justify-stretch justify-items-stretch lg:gap-[10%] gap-[50px]">
            <section className="grid lg:grid-flow-row grid-flow-col items-start content-start lg:justify-start justify-between lg:justify-items-start justify-items-stretch gap-7">
              <Link href={routes.home}>
                <FooterLogoIcon width={200} height={80} />
              </Link>
              <SocialNetworks />
            </section>
            <section className="grid lg:grid-cols-4 lg:grid-rows-1 grid-cols-2 grid-rows-2 lg:justify-normal justify-between justify-items-stretch lg:gap-6 gap-[50px]">
              {footerItems.map((item, index) => (
                <ul key={item.value} className="flex flex-col md:gap-6 xl:gap-3">
                  <p className="lg:text-white text-yellow-main font-semibold uppercase text-base">
                    {item.value}
                  </p>
                  {item.children?.map((itemChildren) => (
                    <li
                      key={itemChildren.value}
                      className="hover:text-yellow-main text-sm font-normal"
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
            <p className="uppercase">© 2025 Moneyswap.online</p>
          </section>
        </div>
      </footer>
    </>
  );
};
