type FilterData = {
  value: string;
  href: string;
};
export const filterData: FilterData[] = [
  {
    value: "ВСЕ",
    href: "all",
  },

  {
    value: "ПОЛОЖИТЕЛЬНЫЕ",
    href: "positive",
  },

  {
    value: "НЕЙТРАЛЬНЫЕ",
    href: "neutral",
  },

  {
    value: "НЕГАТИВНЫЕ",
    href: "negative",
  },
];
