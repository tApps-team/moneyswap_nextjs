import { CurrencyResponse } from "@/entities/currency";

type FilteredListProps = {
  list?: CurrencyResponse[];
  searchValue: string;
};
export const filterList = (props: FilteredListProps) => {
  const searchValue = props.searchValue.toLowerCase();
  return props?.list
    ?.map((tab) => {
      const filteredCurrencies = tab.currencies?.filter(
        (currency) =>
          currency.code_name.toLowerCase().includes(searchValue) ||
          currency.name.ru.toLowerCase().includes(searchValue),
      );

      return {
        ...tab,
        currencies: filteredCurrencies?.sort((a) => (a.is_popular ? -1 : 1)),
      };
    })
    .filter((tab) => tab.currencies?.length > 0);
};