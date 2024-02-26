import { FC } from "react";

import { DirectionTabs } from "@/features/directionTabs";
import { Search } from "@/features/search";
import { getAvailable } from "@/entities/categories";
import { SelectCard } from "@/entities/select";
import { selectType } from "@/shared/types";
import { ValutesList } from "../valutesList";
import styles from "./sideBar.module.scss";

interface SideBarProps {}

export const SideBar: FC<SideBarProps> = async (props) => {
  const availableValutes = await getAvailable("all");

  /// добавить сюда запрос getAvailable и передать дату в ValutesList
  /// как то сохранять в этом стейте выбранные валюты + передавать их в селектКард
  /// добавить useEffect для рефетча и + учет get give как то

  return (
    <section className={styles.sidebar}>
      <DirectionTabs />
      <Search />
      <SelectCard type={selectType.give} />
      <ValutesList selectType={selectType.give} categories={availableValutes} />
      <SelectCard type={selectType.get} />
      <ValutesList selectType={selectType.get} categories={availableValutes} />
    </section>
  );
};
