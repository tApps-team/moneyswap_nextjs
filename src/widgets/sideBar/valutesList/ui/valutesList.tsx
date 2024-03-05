"use client";

import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { DirectionTabs } from "@/features/directionTabs";
import { Search } from "@/features/search";
import { CategoriesWithLang, getAvailable } from "@/entities/categories";
import { ValuteCard, useSelectsStore } from "@/entities/valute";
import { selectTypes } from "@/shared/types";
import styles from "./valutesList.module.scss";

interface ValutesListProps {
  selectType: selectTypes;
  categories?: CategoriesWithLang | null;
}

export const ValutesList: FC<ValutesListProps> = memo((props) => {
  const { selectType, categories } = props;

  const [searchValute, setSearchValute] = useState("");
  const [directionExchange, setDirectionExchange] = useState("");
  const [availableDestinations, setAvailableDestinations] = useState<CategoriesWithLang>();

  const toExchange = useSelectsStore((state) => state.giveSelect?.code_name);

  const currentCategories = selectType === selectTypes.give ? categories : availableDestinations;

  useEffect(() => {
    if (toExchange && selectType === selectTypes.get) {
      getAvailable(toExchange).then((valutes) => setAvailableDestinations(valutes));
    }
  }, [selectType, toExchange]);

  const onChange = useCallback((searchValue: string) => {
    setSearchValute(searchValue);
  }, []);

  const onChangeDirectionExchager = useCallback((direction: string) => {
    setDirectionExchange(direction);
  }, []);

  const filteredValutes = useMemo(
    () =>
      currentCategories?.ru[directionExchange]?.filter((valute) =>
        valute.name.toLowerCase().includes(searchValute.toLowerCase()),
      ),
    [currentCategories?.ru, directionExchange, searchValute],
  );

  return (
    <section className={styles.list}>
      <DirectionTabs
        directionExchange={directionExchange}
        setDirectionExchange={onChangeDirectionExchager}
        directions={currentCategories?.ru}
      />
      <Search onChange={onChange} searchValute={searchValute} />
      {filteredValutes?.map((valute) => (
        <ValuteCard key={valute.id} valute={valute} type={selectType} />
      ))}
    </section>
  );
});
