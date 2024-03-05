"use client";

import { ChangeDirection } from "@/features/changeDirection";
import { SelectCard } from "@/entities/select";
import { directions, selectTypes } from "@/shared/types";
import { ValutesList } from "../valutesList";
import styles from "./sideBar.module.scss";
import { CategoriesWithLang, getAvailable } from "@/entities/categories";
import { FC, useEffect, useState } from "react";
import { useDirectionStore } from "@/entities/direction";
import { useSelectsStore } from "@/entities/valute";

interface SideBarProps {}

export const SideBar: FC<SideBarProps> = () => {
  const selectedDirection = useDirectionStore((state) => state.selectedDirection);
  // добавить в useEffect зависимость страны/города из стора страны
  const giveSelect = useSelectsStore((state) => state.giveSelect);
  const [availableValutes, setAvailableValutes] = useState<CategoriesWithLang | null>();

  useEffect(() => {
    if (selectedDirection === directions.cash && giveSelect) {
      getAvailable(giveSelect.code_name).then((valutes) => setAvailableValutes(valutes));
    } else if (selectedDirection === directions.cash && !giveSelect) {
      setAvailableValutes(null);
    } else {
      getAvailable("all").then((valutes) => setAvailableValutes(valutes));
    }
  }, [selectedDirection]);

  return (
    <section className={styles.sidebar}>
      <ChangeDirection />
      <hr />
      <SelectCard type={selectTypes.give} />
      <ValutesList selectType={selectTypes.give} categories={availableValutes} />
      <SelectCard type={selectTypes.get} />
      <ValutesList selectType={selectTypes.get} />
    </section>
  );
};
