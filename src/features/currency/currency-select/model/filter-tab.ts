import { CurrencyResponse } from "@/entities/currency";

type FilteredTabListProps = {
  tabList: CurrencyResponse[];
  searchValue: string;
};
export const filterTabList = (props: FilteredTabListProps) => {
  return props.tabList
    ?.map((tab) => ({
      ...tab,
      currencies: tab?.currencies?.filter(
        (currency) =>
          currency.code_name.toLowerCase().includes(props.searchValue.toLowerCase()) ||
          currency.name.ru.toLowerCase().includes(props.searchValue.toLowerCase()),
      ),
    }))
    .filter((tab) => tab?.currencies?.length > 0);
};
