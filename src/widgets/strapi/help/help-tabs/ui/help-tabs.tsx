"use client";

import { FC } from "react";
import { faqTypeTabs } from "@/entities/strapi";
import styles from "./help-tabs.module.scss";

interface HelpTabsProps {
  isFaq: boolean;
  setIsFaq: (bool: boolean) => void;
  faqTab: faqTypeTabs;
  setFaqTab: (tab: faqTypeTabs) => void;
}

export const HelpTabs: FC<HelpTabsProps> = ({ isFaq, setIsFaq, faqTab, setFaqTab }) => {
  return (
    <section className={`${styles.wrapper} ${isFaq ? "lg:gap-y-0 mobile-xl:gap-y-8 gap-y-6" : ""}`}>
      <div
        className={`${styles.tab} ${styles.item_1} ${!isFaq ? styles.active : ""}`}
        onClick={() => setIsFaq(false)}
      >
        Помощь
      </div>
      <div
        className={`${styles.tab} ${styles.item_2} ${isFaq ? styles.active : ""}`}
        onClick={() => setIsFaq(true)}
      >
        FAQ
      </div>
      {isFaq && (
        <div className={`${styles.faq_tabs} ${styles.item_3}`}>
          <div
            className={`${styles.faq_tab} ${faqTab === faqTypeTabs.for_user ? styles.active : ""}`}
            onClick={() => setFaqTab(faqTypeTabs.for_user)}
          >
            {faqTypeTabs.for_user}
          </div>
          <div
            className={`${styles.faq_tab} ${faqTab === faqTypeTabs.for_partner ? styles.active : ""}`}
            onClick={() => setFaqTab(faqTypeTabs.for_partner)}
          >
            {faqTypeTabs.for_partner}
          </div>
        </div>
      )}
    </section>
  );
};
