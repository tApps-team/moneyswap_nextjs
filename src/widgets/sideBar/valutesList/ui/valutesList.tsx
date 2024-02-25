import { ValuteCard } from "@/entities/valuteCard";
import { CategoriesWithLang, selectType } from "@/shared/types";
import { FC } from "react";
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
          ))
        )}
    </section>
  );
};
