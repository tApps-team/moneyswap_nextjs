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
      <div className="grid grid-flow-row pb-[50px] lg:gap-[80px] gap-[50px] w-full">
        {faqs?.map((type) => (
          <div key={type.title} className="w-full">
            <div className="mobile-xl:mb-0 mb-4 mobile-xl:pb-12 pb-6 lg:pl-8">
              <h3 className="text-start md:text-2xl mobile-xl:text-lg mobile:text-base text-sm text-yellow-main font-normal uppercase mobile-xl:truncate">
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
