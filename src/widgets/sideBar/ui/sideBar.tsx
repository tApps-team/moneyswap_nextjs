import { FC } from "react";
import styles from "./sideBar.module.scss";
import { SelectCard } from "@/entities/selectCard/ui/selectCard";
import { Valute, selectType } from "@/shared/types";
import { ValutesList } from "../valutesList";
import { getAvailable } from "@/shared/api";

interface SideBarProps {}

export const SideBar: FC<SideBarProps> = async (props) => {
  const availableValutes = await getAvailable("all");

  /// добавить сюда запрос getAvailable и передать дату в ValutesList
  /// как то сохранять в этом стейте выбранные валюты + передавать их в селектКард
  /// добавить useEffect для рефетча и + учет get give как то

  return (
    <section className={styles.sidebar}>
      <SelectCard type={selectType.give} />
      <ValutesList selectType={selectType.give} categories={availableValutes} />
      <SelectCard type={selectType.get} />
      <ValutesList selectType={selectType.get} categories={availableValutes} />
    </section>
  );
};
