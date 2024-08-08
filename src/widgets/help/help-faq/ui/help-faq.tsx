"use client";

import { FC, useState } from "react";
import { AccordionList } from "@/features/faq";
import { Faq } from "@/shared/types";
import styles from "./help-faq.module.scss";

export type HelpFaqType = {
  title: string;
  faqs: Faq[];
};

interface HelpFAQProps {
  userFaqs: HelpFaqType[];
  partnerFaqs: HelpFaqType[];
}

enum FaqType {
  for_user = "FAQ для пользователей",
  for_partner = "FAQ для партнеров",
}

export const HelpFAQ: FC<HelpFAQProps> = ({ userFaqs, partnerFaqs }) => {
  const [faqType, setFaqType] = useState<FaqType>(FaqType.for_user);
  const faqs = faqType === FaqType.for_user ? userFaqs : partnerFaqs;
  return (
    <section>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${faqType === FaqType.for_user ? styles.active : ""}`}
          onClick={() => setFaqType(FaqType.for_user)}
        >
          {FaqType.for_user}
        </div>
        <div
          className={`${styles.tab} ${faqType === FaqType.for_partner ? styles.active : ""}`}
          onClick={() => setFaqType(FaqType.for_partner)}
        >
          {FaqType.for_partner}
        </div>
      </div>
      <div className="grid grid-flow-row pb-[50px] gap-6 w-full">
        {faqs?.map((type) => (
          <div key={type.title} className="w-full">
            <div className="pb-6 border-b-[#bbbbbb] border-b-[1.5px]">
              <h3 className="text-md text-[#f6ff5f] font-semibold uppercase truncate">
                {type.title}
              </h3>
            </div>
            <AccordionList data={type.faqs} />
          </div>
        ))}
      </div>
    </section>
  );
};
