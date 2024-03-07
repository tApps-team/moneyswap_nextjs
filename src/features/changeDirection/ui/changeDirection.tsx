"use client";

import { FC } from "react";
import { DirectionCard, useDirectionStore } from "@/entities/direction";
import { directions } from "@/shared/types";
import styles from "./changeDirection.module.scss";
import { useSelectsStore } from "@/entities/valute";
import { useCountryStore } from "@/entities/country";

interface ChangeDirectionProps {}

export const ChangeDirection: FC<ChangeDirectionProps> = () => {
  const { selectedDirection, setSelectedDirection } = useDirectionStore((state) => state);
  const { setGetSelect, setGiveSelect } = useSelectsStore((state) => state);
  const setCountry = useCountryStore((state) => state.setCountry);

  const handleChangeDirection = (direction: directions) => {
    setSelectedDirection(direction);
    setGiveSelect(null);
    setGetSelect(null);
    setCountry(null);
  };

  return (
    <section className={styles.directions}>
      <DirectionCard
        direction={directions.noncash}
        changeDirection={handleChangeDirection}
        selectedDirection={selectedDirection}
      />
      <DirectionCard
        direction={directions.cash}
        changeDirection={handleChangeDirection}
        selectedDirection={selectedDirection}
      />
    </section>
  );
};
