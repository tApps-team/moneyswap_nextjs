import { FC } from "react";
import styles from "./exchangerCard.module.scss";
import { Exchanger } from "@/shared/types";

interface ExchangerCardProps {
  exchanger: Exchanger;
}

export const ExchangerCard: FC<ExchangerCardProps> = (props) => {
  const { exchanger } = props;
  return (
    <div className={styles.card}>
      <p>{exchanger.name.ru}</p>
    </div>
  );
};
