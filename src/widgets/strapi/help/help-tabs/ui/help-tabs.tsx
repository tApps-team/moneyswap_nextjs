"use client";

import { FC } from "react";
import { faqTypeTabs } from "@/entities/strapi";

interface HelpTabsProps {
  isFaq: boolean;
  setIsFaq: (bool: boolean) => void;
  faqTab: faqTypeTabs;
  setFaqTab: (tab: faqTypeTabs) => void;
}

export const HelpTabs: FC<HelpTabsProps> = ({ isFaq, setIsFaq, faqTab, setFaqTab }) => {
  return (
    <section
      className={`grid grid-flow-row ${isFaq ? "lg:gap-y-0 md:gap-y-[50px] mobile-xl:gap-y-8 gap-y-4" : ""}`}
    >
      <div className="mobile-xl:max-w-[80%] max-w-full grid grid-cols-2 md:gap-6 mobile-xl:gap-3 gap-2">
        <div
          className={`cursor-pointer text-center font-normal mobile-xl:text-base mobile:text-sm text-xs bg-new-light-grey rounded-[10px] md:p-4 p-3 w-full ${!isFaq ? "bg-yellow-main text-black" : "text-white"}`}
          onClick={() => setIsFaq(false)}
        >
          Помощь
        </div>
        <div
          className={`cursor-pointer text-center font-normal mobile-xl:text-base mobile:text-sm text-xs bg-new-light-grey rounded-[10px] md:p-4 p-3 w-full  ${isFaq ? "bg-yellow-main text-black" : "text-white"}`}
          onClick={() => setIsFaq(true)}
        >
          FAQ
        </div>
      </div>
      {isFaq && (
        <div className="lg:mt-[60px] flex flex-row mobile:gap-10 gap-6">
          <div
            className={`cursor-pointer mobile-xl:text-lg mobile:text-sm text-xs font-semibold mobile-xl:pb-2 pb-1 ${faqTab === faqTypeTabs.for_user ? "text-yellow-main border-b-yellow-main mobile-xl:border-b-[2px] border-b-[1px]" : "text-font-light-grey"}`}
            onClick={() => setFaqTab(faqTypeTabs.for_user)}
          >
            {faqTypeTabs.for_user}
          </div>
          <div
            className={`cursor-pointer mobile-xl:text-lg mobile:text-sm text-xs font-semibold mobile-xl:pb-2 pb-1 ${faqTab === faqTypeTabs.for_partner ? "text-yellow-main border-b-yellow-main mobile-xl:border-b-[2px] border-b-[1px]" : "text-font-light-grey"}`}
            onClick={() => setFaqTab(faqTypeTabs.for_partner)}
          >
            {faqTypeTabs.for_partner}
          </div>
        </div>
      )}
    </section>
  );
};
