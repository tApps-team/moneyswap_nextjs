import { Valute } from "./valute";

export interface Categories {
  [category: string]: Valute[];
}

export interface CategoriesWithLang {
  ru: Categories;
  en: Categories;
}
