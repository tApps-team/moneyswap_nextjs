import Link from "next/link";
import { SocialNetworks } from "@/features/social-networks";
import { FooterLogoIcon } from "@/shared/assets";
import { routes } from "@/shared/router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";
import { footerItems } from "../model/footerItems";

export const FooterMobile = () => {
  return (
    <footer className=" p-6 flex flex-col gap-2  bg-black">
      <Link href={routes.home}>
        <FooterLogoIcon width={200} height={100} />
      </Link>

      <Accordion type="single" collapsible className=" w-full  ">
        {footerItems.map((item, index) => (
          <AccordionItem value={item.value} key={item.value} className="flex flex-col gap-1">
            <AccordionTrigger className="font-medium uppercase mobile-xl:text-sm text-xs">
              {item.value}
            </AccordionTrigger>
            {item.children?.map((itemChildren) => (
              <AccordionContent
                key={itemChildren.value}
                className="hover:text-yellow-main text-light-gray uppercase mobile-xl:text-xs text-2xs"
              >
                <Link target={itemChildren.target} href={itemChildren.href}>
                  {itemChildren.value}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>

      <section className="flex flex-col gap-6 py-4">
        <p className="text-sm font-medium text-center uppercase">МЫ В СОЦСЕТЯХ</p>
        <SocialNetworks />
      </section>
      <hr />
      <section className="flex flex-col justify-center mobile-xl:text-xs text-2xs items-center gap-2 pt-4">
        <p className="uppercase">© moneyswap – мониторинг обменников. Все права защищены.</p>
        <p className="uppercase">© 2024 Moneyswap.online</p>
      </section>
    </footer>
  );
};
