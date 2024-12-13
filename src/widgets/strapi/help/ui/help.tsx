"use client";

import { FC, useState } from "react";
import { BotBanner } from "@/features/bot-banner";
import { BotBannerSidebar } from "@/features/bot-banner-in-sidebar";
import { TopExchange } from "@/features/top-exchange/top-exchange-help-page";
import { GetDirectionsResponse } from "@/entities/currency";
import { DynamicContentItem, faqTypeTabs } from "@/entities/strapi";
import { ArticleContent } from "../../blog";
import { HelpFAQ, HelpFaqType } from "../help-faq";
import { HelpTabs } from "../help-tabs";

interface HelpBlockProps {
  isArticle: boolean;
  article: DynamicContentItem[];
  userFaqs: HelpFaqType[];
  partnerFaqs: HelpFaqType[];
  popularNoncashDirections: GetDirectionsResponse;
  randomNoncashDirections: GetDirectionsResponse;
}

export const HelpBlock: FC<HelpBlockProps> = ({
  isArticle,
  article,
  userFaqs,
  partnerFaqs,
  popularNoncashDirections,
  randomNoncashDirections,
}) => {
  const [isFaq, setIsFaq] = useState(isArticle ? false : true);
  const [faqTab, setFaqTab] = useState<faqTypeTabs>(faqTypeTabs.for_user);
  return (
    <div className="">
      <HelpTabs
        isFaq={isFaq}
        setIsFaq={setIsFaq}
        faqTab={faqTab}
        setFaqTab={(tab: faqTypeTabs) => setFaqTab(tab)}
      />
      <div className="grid xl:grid-cols-[1fr_0.4fr] grid-flow-row items-start gap-8">
        {isFaq ? (
          <HelpFAQ userFaqs={userFaqs} partnerFaqs={partnerFaqs} faqTab={faqTab} />
        ) : (
          <ArticleContent dynamic_content={article} />
        )}
        <section className="grid grid-flow-row gap-6">
          <div className="xl:hidden block -mobile:mt-7 mobile:mb-0 -mt-12 -mb-5">
            <BotBanner />
          </div>
          <TopExchange
            popularNoncashDirections={popularNoncashDirections}
            randomNoncashDirections={randomNoncashDirections}
          />
          <div className="xl:block hidden">
            <BotBannerSidebar />
          </div>
        </section>
      </div>
    </div>
  );
};
