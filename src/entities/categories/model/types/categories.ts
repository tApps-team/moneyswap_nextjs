// eslint-disable-next-line boundaries/element-types
import { Valute } from "@/entities/valute";

export type Categories = {
  [category: string]: Valute[];
};

export type CategoriesWithLang = {
  ru: Categories;
  en: Categories;
};
