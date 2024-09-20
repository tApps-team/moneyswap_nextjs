"use client";

import { FC } from "react";
import styles from "./help-tabs.module.scss";

interface HelpTabsProps {
  isFaq: boolean;
  setIsFaq: (bool: boolean) => void;
}

export const HelpTabs: FC<HelpTabsProps> = ({ isFaq, setIsFaq }) => {
  return (
    <section className={styles.tabs}>
      <div
        className={`${styles.tab} ${!isFaq ? styles.active : ""}`}
        onClick={() => setIsFaq(false)}
      >
        Как пользоваться
      </div>
      <div className={`${styles.tab} ${isFaq ? styles.active : ""}`} onClick={() => setIsFaq(true)}>
        Вопросы и ответы
      </div>
    </section>
  );
};
