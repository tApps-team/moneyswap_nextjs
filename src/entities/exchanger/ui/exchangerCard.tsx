import { FC } from "react";
import { Exchanger } from "../model/types/exchanger";
import styles from "./exchangerCard.module.scss";

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
