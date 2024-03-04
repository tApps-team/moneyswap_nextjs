import { FC, useEffect, useState } from "react";
import { CountryAccordion } from "@/features/countryAccordion";
import { CategoriesWithLang, getAvailable } from "@/entities/categories";
import { getCountries } from "@/entities/country";
import { Exchanger, getExchangers } from "@/entities/exchanger";
import { SelectCard } from "@/entities/select";
import { useSelectsStore } from "@/entities/valute";
import { selectType } from "@/shared/types";
import { CountriesList } from "../countriesList";
import { ValutesList } from "../valutesList";
import styles from "./sideBar.module.scss";

interface SideBarProps {}

export const SideBar = async (props: SideBarProps) => {
  const availableValutes = await getAvailable("all");
  const countries = await getCountries();
  return (
    <section className={styles.sidebar}>
      <CountriesList countries={countries} />
      <SelectCard type={selectType.give} />
      <ValutesList selectType={selectType.give} categories={availableValutes} />
      <SelectCard type={selectType.get} />
      <ValutesList selectType={selectType.get} />
    </section>
  );
};
