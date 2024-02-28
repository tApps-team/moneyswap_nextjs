"use client";
import { ChangeEvent, FC, memo, useCallback, useMemo, useState } from "react";
import { DirectionTabs } from "@/features/directionTabs";
import { Search, useSearchStore } from "@/features/search";
import { CategoriesWithLang, getAvailable } from "@/entities/categories";
import { ValuteCard } from "@/entities/valute";
import { selectType } from "@/shared/types";
import styles from "./valutesList.module.scss";

interface ValutesListProps {
  selectType: selectType;
  categories?: CategoriesWithLang;
}

export const ValutesList: FC<ValutesListProps> = memo((props) => {
  const { selectType, categories } = props;

  const [searchValute, setSearchValute] = useState("");
  const [directionExchange, setDirectionExchange] = useState("");

  const onChange = useCallback((searchValue: string) => {
    setSearchValute(searchValue);
  }, []);

  const onChangeDirectionExchager = useCallback((direction: string) => {
    setDirectionExchange(direction);
  }, []);

  const filteredValutes = useMemo(
    () =>
      categories?.ru[directionExchange]?.filter((valute) =>
        valute.name.toLowerCase().includes(searchValute.toLowerCase()),
      ),
    [categories?.ru, directionExchange, searchValute],
  );

  return (
    <section className={styles.list}>
      <DirectionTabs
        directionExchange={directionExchange}
        setDirectionExchange={onChangeDirectionExchager}
        directions={categories?.ru}
      />
      <Search onChange={onChange} searchValute={searchValute} />
      {filteredValutes?.map((valute) => (
        <ValuteCard key={valute.id} valute={valute} type={selectType} />
      ))}
    </section>
  );
});
