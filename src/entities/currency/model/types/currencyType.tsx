import { Name } from "@/shared/types";

export type Currency = {
  id: string;
  name: Name;
  code_name: string;
  icon_url: string;
};
export type CurrencyResponse = {
  id: string;
  name: Name;
  currencies: Currency[];
};
