import { FC } from "react";
import { selectTypes } from "@/shared/types";
import styles from "./selectCard.module.scss";

interface SelectCardProps {
  type: selectTypes;
}

export const SelectCard: FC<SelectCardProps> = (props) => {
  const { type } = props;
  return (
    <section className={styles.select_card}>
      <h3 className={styles.select_title}>{type === selectTypes.give ? "Отдаю:" : "Получаю:"}</h3>
    </section>
  );
};
