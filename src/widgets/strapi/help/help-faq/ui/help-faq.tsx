"use client";

import { FC } from "react";
import { AccordionList } from "@/features/strapi";
import { Faq, faqTypeTabs } from "@/entities/strapi";

export type HelpFaqType = {
  title: string;
  faqs: Faq[];
};

interface HelpFAQProps {
  userFaqs: HelpFaqType[];
  partnerFaqs: HelpFaqType[];
  faqTab: faqTypeTabs;
}

export const HelpFAQ: FC<HelpFAQProps> = ({ userFaqs, partnerFaqs, faqTab }) => {
  const faqs = faqTab === faqTypeTabs.for_user ? userFaqs : partnerFaqs;
  return (
    <section>
      <div className="grid grid-flow-row mobile-xl:pb-[50px] pb-6 gap-6 w-full">
        {faqs?.map((type) => (
          <div key={type.title} className="w-full">
            <div className="mobile-xl:mb-0 mb-6 mobile-xl:pb-6 pb-6 md:pl-8 mobile-xl:border-none border-b-2 border-light-gray">
              <h3 className="text-center md:text-start xl:text-xl md:text-lg mobile-xl:text-base text-sm text-yellow-main font-normal uppercase mobile-xl:truncate">
                {type?.title}
              </h3>
            </div>
            <AccordionList data={type.faqs} />
          </div>
        ))}
      </div>
    </section>
  );
};
