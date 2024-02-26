import { FC } from "react";
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

  const filteredOptions = Object.values(categories?.ru || {});

  return (
    <section className={styles.list}>
      {filteredOptions &&
        filteredOptions.map((category) =>
          category.map((valute) => (
            <ValuteCard key={valute.id} valute={valute} type={selectType} />
          )),
        )}
    </section>
  );
};
