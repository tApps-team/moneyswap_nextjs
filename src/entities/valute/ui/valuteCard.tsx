"use client";

import clsx from "clsx";
import Link from "next/link";
import { FC, memo } from "react";

import { selectType } from "@/shared/types";
import { useSelectsStore } from "../model/store/valuteStore";
import { Valute } from "../model/types/valute";
import styles from "./valuteCard.module.scss";

interface ValuteCardProps {
  valute: Valute;
  type: selectType;
}

export const ValuteCard: FC<ValuteCardProps> = memo((props) => {
  const { valute, type } = props;
  const { giveSelect, getSelect, setGetSelect, setGiveSelect } = useSelectsStore((state) => state);
  const handleSelect = () => {
    if (type === selectType.give) {
      setGiveSelect(valute);
      setGetSelect(null);
    } else {
      setGetSelect(valute);
    }
  };

  const path =
    type === selectType.get && giveSelect ? `${giveSelect?.code_name}-to-${valute.code_name}` : "";

  // add active className
  const giveActiveClass = clsx({
    [styles.active]: valute === giveSelect,
  });
  const getActiveClass = clsx({
    [styles.active]: valute === getSelect,
  });
  const linkClasses = clsx(
    styles.valute_card,
    type === selectType.give && giveActiveClass,
    type === selectType.get && getActiveClass,
    "link",
  );
  return (
    <Link onClick={handleSelect} className={linkClasses} href={path} scroll={false}>
      <h3 className={styles.valute_name}>{valute.name}</h3>
      <p className={styles.valute_code}>{valute.code_name}</p>
    </Link>
  );
});
