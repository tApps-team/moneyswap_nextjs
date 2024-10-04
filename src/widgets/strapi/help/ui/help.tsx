"use client";

import { FC, useState } from "react";
import { BotBannerSidebar } from "@/features/bot-banner-in-sidebar";
import { TopExchange } from "@/features/top-exchange/top-exchange-help-page";
import { GetDirectionsResponse } from "@/entities/currency";
import { DynamicContentItem, faqTypeTabs } from "@/entities/strapi";
import { ArticleContent } from "../../blog";
import { HelpFAQ, HelpFaqType } from "../help-faq";
import { HelpTabs } from "../help-tabs";

interface HelpBlockProps {
  article: DynamicContentItem[];
  userFaqs: HelpFaqType[];
  partnerFaqs: HelpFaqType[];
  popularNoncashDirections: GetDirectionsResponse;
  randomNoncashDirections: GetDirectionsResponse;
}

export const HelpBlock: FC<HelpBlockProps> = ({
  article,
  userFaqs,
  partnerFaqs,
  popularNoncashDirections,
  randomNoncashDirections,
}) => {
  const [isFaq, setIsFaq] = useState(false);
  const [faqTab, setFaqTab] = useState<faqTypeTabs>(faqTypeTabs.for_user);
  return (
    <div className="">
      <HelpTabs
        isFaq={isFaq}
        setIsFaq={setIsFaq}
        faqTab={faqTab}
        setFaqTab={(tab: faqTypeTabs) => setFaqTab(tab)}
      />
      <div className="grid grid-cols-[1fr_0.4fr] items-start gap-8">
        {isFaq ? (
          <HelpFAQ userFaqs={userFaqs} partnerFaqs={partnerFaqs} faqTab={faqTab} />
        ) : (
          <ArticleContent dynamic_content={article} />
        )}
        <section className="grid grid-flow-row gap-6">
          <TopExchange
            popularNoncashDirections={popularNoncashDirections}
            randomNoncashDirections={randomNoncashDirections}
          />
          <BotBannerSidebar />
        </section>
      </div>
    </div>
  );
};
