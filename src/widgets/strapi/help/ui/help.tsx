"use client";

import { FC, useState } from "react";
import { DynamicContentItem } from "@/entities/strapi";
import { ArticleContent } from "../../blog";
import { HelpFAQ, HelpFaqType } from "../help-faq";
import { HelpTabs } from "../help-tabs";

interface HelpBlockProps {
  article: DynamicContentItem[];
  userFaqs: HelpFaqType[];
  partnerFaqs: HelpFaqType[];
}

export const HelpBlock: FC<HelpBlockProps> = ({ article, userFaqs, partnerFaqs }) => {
  const [isFaq, setIsFaq] = useState(false);
  return (
    <div>
      <HelpTabs isFaq={isFaq} setIsFaq={setIsFaq} />
      {isFaq ? (
        <HelpFAQ userFaqs={userFaqs} partnerFaqs={partnerFaqs} />
      ) : (
        <ArticleContent dynamic_content={article} />
      )}
    </div>
  );
};
