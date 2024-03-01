import { FC, useEffect, useState } from "react";
import { CategoriesWithLang, getAvailable } from "@/entities/categories";
import { Exchanger, getExchangers } from "@/entities/exchanger";
import { SelectCard } from "@/entities/select";
import { useSelectsStore } from "@/entities/valute";
import { selectType } from "@/shared/types";
import { ValutesList } from "../valutesList";
import styles from "./sideBar.module.scss";

interface SideBarProps {}

export const SideBar = async (props: SideBarProps) => {
  const availableValutes = await getAvailable("all");

  return (
    <section className={styles.sidebar}>
      <SelectCard type={selectType.give} />
      <ValutesList selectType={selectType.give} categories={availableValutes} />
      <SelectCard type={selectType.get} />
      <ValutesList selectType={selectType.get} />
    </section>
  );
};
