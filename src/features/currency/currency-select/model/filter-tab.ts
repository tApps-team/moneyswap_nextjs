import { Currency, CurrencyResponse } from "@/entities/currency";

type FilteredTabListProps = {
  tabList?: CurrencyResponse[];
  searchValue: string;
};
export const filterTabList = (props: FilteredTabListProps) => {
  const searchValue = props.searchValue.toLowerCase();
  return props?.tabList
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
// export const filterTabList = (props: FilteredTabListProps) => {
//   const { searchValue, tabList } = props;
//   const searchValueToLowerCase = searchValue.toLowerCase();
//   const currencies = tabList.reduce<Currency[]>(
//     (accumulator, currentValue) => [...accumulator, ...currentValue.currencies],
//     [],
//   );
//   return currencies.filter(
//     (currency) =>
//       currency.code_name.toLowerCase().includes(searchValueToLowerCase) ||
//       currency.name.ru.toLowerCase().includes(searchValueToLowerCase),
//   );
// };
