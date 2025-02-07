"use client";

import { FC, useState } from "react";
import { BotBanner } from "@/features/bot-banner";
import { BotBannerSidebar } from "@/features/bot-banner-in-sidebar";
import { BotBannerNew } from "@/features/bot-banner-new";
import { TopExchange } from "@/features/top-exchange/top-exchange-help-page";
import { GetDirectionsResponse } from "@/entities/currency";
import { DynamicContentItem, faqTypeTabs } from "@/entities/strapi";
import { ArticleContent } from "../../blog";
import { HelpFAQ, HelpFaqType } from "../help-faq";
import { HelpTabs } from "../help-tabs";

interface HelpBlockProps {
  isArticle: boolean;
  title: string;
  article: DynamicContentItem[];
  userFaqs: HelpFaqType[];
  partnerFaqs: HelpFaqType[];
  popularNoncashDirections: GetDirectionsResponse;
  randomNoncashDirections: GetDirectionsResponse;
}

export const HelpBlock: FC<HelpBlockProps> = ({
  isArticle,
  title,
  article,
  userFaqs,
  partnerFaqs,
  popularNoncashDirections,
  randomNoncashDirections,
}) => {
  const [isFaq, setIsFaq] = useState(isArticle ? false : true);
  const [faqTab, setFaqTab] = useState<faqTypeTabs>(faqTypeTabs.for_user);
  return (
    <div className="grid xl:grid-cols-[1fr_0.4fr] grid-flow-row items-start lg:gap-8 gap-0">
      <section className="grid lg:gap-[60px] md:gap-[50px] mobile-xl:gap-10 gap-8">
        <div className="grid grid-flow-row lg:gap-[60px] md:gap-[50px] mobile-xl:gap-10 gap-8 lg:pt-10 md:pt-6">
          <h1 className="text-yellow-main font-medium text-start mobile-xl:text-2xl md:text-3xl xl:text-3xl uppercase">
            Часто задаваемые вопросы
          </h1>
          <h2 className="tracking-wider mobile-xl:tracking-normal text-start text-xs lg:text-sm xl:text-base font-light">
            {title}
          </h2>
        </div>
        <HelpTabs
          isFaq={isFaq}
          setIsFaq={setIsFaq}
          faqTab={faqTab}
          setFaqTab={(tab: faqTypeTabs) => setFaqTab(tab)}
        />
        <div className="grid items-start gap-8">
          {isFaq ? (
            <HelpFAQ userFaqs={userFaqs} partnerFaqs={partnerFaqs} faqTab={faqTab} />
          ) : (
            <ArticleContent dynamic_content={article} />
          )}
        </div>
      </section>
      <section className="grid grid-flow-row xl:gap-6 gap-[50px]">
        <div className="xl:hidden grid grid-flow-row] justify-center justify-items-center bg-new-dark-grey rounded-[15px] mobile-xl:px-10 mobile-xl:py-8 px-6 py-8 gap-5 mx-auto max-w-full mobile-xl:max-w-[80vw] md:max-w-full">
          <p className="text-white mobile-xl:text-base mobile:text-xs text-2xs font-normal text-center uppercase mobile-xl:max-w-[80%]">
            Переходи в наш бот, чтобы сделать обмен стало ещё проще и удобнее
          </p>
          <BotBannerNew />
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
  );
};
