"use client";

import clsx from "clsx";
import { FC } from "react";
import { directions } from "@/shared/types";
import styles from "./directionCard.module.scss";

interface DirectionTabProps {
  direction: directions;
  selectedDirection: directions;
  changeDirection: (direction: directions) => void;
}

export const DirectionCard: FC<DirectionTabProps> = ({
  direction,
  changeDirection,
  selectedDirection,
}) => {
  return (
    <div
      className={clsx(styles.direction, { [styles.active]: direction === selectedDirection })}
      onClick={() => changeDirection(direction)}
    >
      <p className={styles.title}>{direction}</p>
    </div>
  );
};
