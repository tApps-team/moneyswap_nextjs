"use client";

import clsx from "clsx";
import Link from "next/link";
import { FC, memo } from "react";
import { selectType } from "@/shared/types";
import { DialogClose } from "@/shared/ui";
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
    } else if (giveSelect) {
      setGetSelect(valute);
    }
  };

  const pagePath =
    type === selectType.get && giveSelect ? `${giveSelect?.code_name}-to-${valute.code_name}` : "";

  // add active className
  const giveActiveClass = clsx({
    [styles.active]: valute.id === giveSelect?.id,
  });
  const getActiveClass = clsx({
    [styles.active]: valute.id === getSelect?.id,
  });
  const linkClasses = clsx(
    styles.valute_card,
    type === selectType.give ? giveActiveClass : getActiveClass,
    "link",
  );

  return (
    <DialogClose asChild>
      <Link
        onClick={handleSelect}
        className={linkClasses}
        href={pagePath}
        // scroll={false}
      >
        <h3 className={styles.valute_name}>{valute.name}</h3>
        <p className={styles.valute_code}>{valute.code_name}</p>
      </Link>
    </DialogClose>
  );
});
