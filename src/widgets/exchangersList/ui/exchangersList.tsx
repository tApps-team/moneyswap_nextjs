import { FC } from "react";
import styles from "./exchangersList.module.scss";
import { Exchanger } from "@/shared/types";
import { ExchangerCard } from "@/entities/exchangerCard";

interface ExchangersListProps {
  exchangers: Exchanger[];
}

export const ExchangersList: FC<ExchangersListProps> = (props) => {
  const { exchangers } = props;
  return (
    <section className={styles.exchangers}>
      {exchangers.map((exchanger) => (
        <ExchangerCard key={exchanger.id} exchanger={exchanger} />
      ))}
    </section>
  );
};
