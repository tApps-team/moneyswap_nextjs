import { FC } from "react";
import { selectType } from "@/shared/types";
import styles from "./selectCard.module.scss";

interface SelectCardProps {
  type: selectType;
}

export const SelectCard: FC<SelectCardProps> = (props) => {
  const { type } = props;
  return (
    <section className={styles.select_card}>
      <h3 className={styles.select_title}>{type === selectType.give ? "Отдаю:" : "Получаю:"}</h3>
    </section>
  );
};
