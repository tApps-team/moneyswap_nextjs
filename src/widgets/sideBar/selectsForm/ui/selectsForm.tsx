"use client";

import { FC, useEffect, useState } from "react";
import { SelectCard } from "@/entities/select";
import styles from "./selectsForm.module.scss";
import { ValutesList } from "../valutesList";
import { directions, selectTypes } from "@/shared/types";
import { useCountryStore } from "@/entities/country";
import { CategoriesWithLang, getAvailable } from "@/entities/categories";
import { SwitchSelects } from "@/features/switchSelects";

interface SelectsFormProps {
  selectedDirection: directions | null;
}

export const SelectsForm: FC<SelectsFormProps> = ({ selectedDirection }) => {
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
    <section className={styles.form}>
      <SelectCard type={selectTypes.give} />
      <ValutesList selectType={selectTypes.give} categories={availableValutes} />
      <SwitchSelects />
      <SelectCard type={selectTypes.get} />
      <ValutesList selectType={selectTypes.get} />
    </section>
  );
};
