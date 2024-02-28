"use client";
import { FC, useEffect, useState } from "react";
import { CategoriesWithLang, getAvailable } from "@/entities/categories";
import { Exchanger, getExchangers } from "@/entities/exchanger";
import { SelectCard } from "@/entities/select";
import { useSelectsStore } from "@/entities/valute";
import { selectType } from "@/shared/types";
import { ValutesList } from "../valutesList";
import styles from "./sideBar.module.scss";

interface SideBarProps {}

export const SideBar: FC<SideBarProps> = (props) => {
  // имеет смысл попробовать доставать данные из кеша а не создавать useState
  const [availableValutes, setAvailableValutes] = useState<CategoriesWithLang>();
  const [availableDestinations, setAvailableDestinations] = useState<CategoriesWithLang>();

  const to = useSelectsStore((state) => state.giveSelect?.code_name);
  const from = useSelectsStore((state) => state.getSelect?.code_name);

  const state = useSelectsStore((state) => state);
  useEffect(() => {
    getAvailable("all").then((availableValutes) => setAvailableValutes(availableValutes));
  }, []);
  useEffect(() => {
    if (to)
      getAvailable(to).then((availableDestinations) => {
        setAvailableDestinations(availableDestinations);
      });
  }, [to]);

  /// добавить сюда запрос getAvailable и передать дату в ValutesList
  /// как то сохранять в этом стейте выбранные валюты + передавать их в селектКард
  /// добавить useEffect для рефетча и + учет get give как то

  return (
    <section className={styles.sidebar}>
      <SelectCard type={selectType.give} />
      <ValutesList selectType={selectType.give} categories={availableValutes} />
      <SelectCard type={selectType.get} />
      <ValutesList selectType={selectType.get} categories={availableDestinations} />
    </section>
  );
};
