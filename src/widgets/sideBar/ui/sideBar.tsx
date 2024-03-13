"use client";

import { ChangeDirection } from "@/features/changeDirection";
import { FC, useEffect, useState } from "react";
import { CountryModal } from "@/features/countryModal";
import { SelectCard } from "@/entities/select";
import { directions, selectTypes } from "@/shared/types";
import { CountriesList } from "../countriesList";
import { ValutesList } from "../valutesList";
import styles from "./sideBar.module.scss";
import { CategoriesWithLang, getAvailable } from "@/entities/categories";
import { useDirectionStore } from "@/entities/direction";
import { useCountryStore } from "@/entities/country";

interface SideBarProps {}

export const SideBar: FC<SideBarProps> = () => {
  const selectedDirection = useDirectionStore((state) => state.selectedDirection);
  const city = useCountryStore((state) => state.city);

  const [availableValutes, setAvailableValutes] = useState<CategoriesWithLang | null>(null);

  useEffect(() => {
    if (selectedDirection === directions.cash && city) {
      getAvailable({ base: "all", city: city.code_name })
        .then((valutes) => setAvailableValutes(valutes))
        .catch(() => setAvailableValutes(null));
    } else if (selectedDirection === directions.cash && !city) {
      setAvailableValutes(null);
    } else {
      getAvailable({ base: "all" }).then((valutes) => setAvailableValutes(valutes));
    }
  }, [selectedDirection, city]);

  return (
    <section className={styles.sidebar}>
      <ChangeDirection />
      {selectedDirection === directions.cash && (
        <>
          <CountryModal />
          <CountriesList />
        </>
      )}
      <SelectCard type={selectTypes.give} />
      <ValutesList selectType={selectTypes.give} categories={availableValutes} />
      <SelectCard type={selectTypes.get} />
      <ValutesList selectType={selectTypes.get} />
    </section>
  );
};
