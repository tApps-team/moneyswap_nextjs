"use client";
import { FC, useMemo } from "react";
import { useSearchStore } from "@/features/search";
import { CategoriesWithLang } from "@/entities/categories";
import { ValuteCard } from "@/entities/valute";
import { selectType } from "@/shared/types";
import styles from "./valutesList.module.scss";

interface ValutesListProps {
  selectType: selectType;
  categories?: CategoriesWithLang;
}

export const ValutesList: FC<ValutesListProps> = (props) => {
  const { selectType, categories } = props;
  const { searchValue } = useSearchStore();
  console.log(searchValue);
  const filteredOptions = useMemo(
    () =>
      Object.values(categories?.ru || {})
        .flat()
        .filter((el) =>
          el.name.toLowerCase().includes(searchValue.toLowerCase()),
        ),
    [categories?.ru, searchValue],
  );
  return (
    <section className={styles.list}>
      {filteredOptions &&
        filteredOptions.map((valute) => (
          <ValuteCard key={valute.id} valute={valute} type={selectType} />
        ))}
    </section>
  );
};
