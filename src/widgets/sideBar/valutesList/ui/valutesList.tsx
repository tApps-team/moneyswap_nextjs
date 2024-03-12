"use client";

import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { DirectionTabs } from "@/features/directionTabs";
import { CategoriesWithLang, getAvailable } from "@/entities/categories";
import { ValuteCard, useSelectsStore } from "@/entities/valute";
import { selectType } from "@/shared/types";
import { Button, Dialog, DialogClose, DialogContent, DialogTrigger, Input } from "@/shared/ui";
import styles from "./valutesList.module.scss";

interface ValutesListProps {
  selectType: selectType;
  categories?: CategoriesWithLang;
}

export const ValutesList: FC<ValutesListProps> = memo((props) => {
  const { selectType, categories } = props;

  const [searchValute, setSearchValute] = useState("");

  const [directionExchange, setDirectionExchange] = useState("");
  const [availableDestinations, setAvailableDestinations] = useState<CategoriesWithLang>();

  const toExchange = useSelectsStore((state) => state.giveSelect?.code_name);

  const getSelectName = useSelectsStore((state) => state.getSelect?.name);
  const giveSelectName = useSelectsStore((state) => state.giveSelect?.name);
  const currentSelectName = selectType === "give" ? giveSelectName : getSelectName;

  const currentCategories = selectType === "give" ? categories : availableDestinations;

  useEffect(() => {
    if (toExchange && selectType === "get")
      getAvailable(toExchange).then((valutes) => setAvailableDestinations(valutes));
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
      <Dialog>
        <DialogTrigger asChild>
          <Button>Отдаю {currentSelectName} </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[600px] bg-current">
          <div className="min-h-[400px] grid grid-cols-1 grid-rows-2">
            <DirectionTabs
              directionExchange={directionExchange}
              setDirectionExchange={onChangeDirectionExchager}
              directions={currentCategories?.ru}
            />
            <Input
              className="text-slate-950 rounded-xl text-xl"
              onChange={(e) => onChange(e.target.value.trim())}
              value={searchValute}
            />

            {filteredValutes?.map((valute) => (
              <ValuteCard key={valute.id} valute={valute} type={selectType} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
});
