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
      <div className="grid grid-flow-row pb-[50px] gap-6 w-full">
        {faqs?.map((type) => (
          <div key={type.title} className="w-full">
            <div className="pb-6 pl-8">
              <h3 className="text-2xl text-white font-semibold uppercase truncate">{type.title}</h3>
            </div>
            <AccordionList data={type.faqs} />
          </div>
        ))}
      </div>
    </section>
  );
};
