"use client";

import { FC, useState } from "react";
import { HelpArticle } from "../help-article";
import { HelpFAQ, HelpFaqType } from "../help-faq";
import { HelpTabs } from "../help-tabs";

interface HelpBlockProps {
  article: string;
  userFaqs: HelpFaqType[];
  partnerFaqs: HelpFaqType[];
}

export const HelpBlock: FC<HelpBlockProps> = ({ article, userFaqs, partnerFaqs }) => {
  const [isFaq, setIsFaq] = useState(false);
  return (
    <div className="mt-10">
      <HelpTabs isFaq={isFaq} setIsFaq={setIsFaq} />
      {isFaq ? (
        <HelpFAQ userFaqs={userFaqs} partnerFaqs={partnerFaqs} />
      ) : (
        <HelpArticle article={article} />
      )}
    </div>
  );
};
