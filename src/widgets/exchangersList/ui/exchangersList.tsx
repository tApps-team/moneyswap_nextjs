import { FC } from "react";
import { Exchanger, ExchangerCard } from "@/entities/exchanger";

import styles from "./exchangersList.module.scss";

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
