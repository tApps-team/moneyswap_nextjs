"use client";

import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { DirectionTabs } from "@/features/directionTabs";
import { selectTypes } from "@/shared/types";
import { CategoriesWithLang, getAvailable } from "@/entities/categories";
import { ValuteCard, useSelectsStore } from "@/entities/valute";
import { Button, Dialog, DialogContent, DialogTrigger, Input } from "@/shared/ui";
import styles from "./valutesList.module.scss";
import { useLocationStore } from "@/entities/location";

interface ValutesListProps {
  selectType: selectTypes;
  categories?: CategoriesWithLang | null;
}

export const ValutesList: FC<ValutesListProps> = memo((props) => {
  const { selectType, categories } = props;

  const [searchValute, setSearchValute] = useState("");

  const [directionExchange, setDirectionExchange] = useState("");
  const [availableDestinations, setAvailableDestinations] = useState<CategoriesWithLang | null>();

  const { setGiveSelect, setGetSelect, giveSelect, getSelect } = useSelectsStore((state) => state);
  const cityCodeName = useLocationStore((state) => state.city?.code_name);

  const currentCategories = selectType === selectTypes.give ? categories : availableDestinations;
  const currentSelectName = selectType === selectTypes.give ? giveSelect?.name : getSelect?.name;

  useEffect(() => {
    setAvailableDestinations(null);
    if (giveSelect && selectType === selectTypes.get) {
      getAvailable({ base: giveSelect.code_name, city: cityCodeName })
        .then((valutes) => setAvailableDestinations(valutes))
        .catch(() => {
          setGetSelect(null);
        });
    }
  }, [selectType, giveSelect]);

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
          <Button>
            {selectType === selectTypes.give ? "Отдаю" : "Получаю"} {currentSelectName}
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[600px] bg-neutral-500">
          {currentCategories ? (
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

              {filteredValutes?.length! > 0 ? (
                filteredValutes?.map((valute) => (
                  <ValuteCard key={valute.id} valute={valute} type={selectType} />
                ))
              ) : (
                <div className="text-black">Список пуст...</div>
              )}
            </div>
          ) : (
            <div className="text-red-900">Список пуст</div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
});
