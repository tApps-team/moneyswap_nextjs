type FilterData = {
  value: string;
  href: string;
  grade: number | undefined;
};
export const filterData: FilterData[] = [
  {
    value: "ВСЕ",
    href: "",
    grade: undefined,
  },

  {
    value: "ПОЛОЖИТЕЛЬНЫЕ",
    href: "?grade=1&page=1",
    grade: 1,
  },

  {
    value: "НЕЙТРАЛЬНЫЕ",
    href: "?grade=0&page=1",
    grade: 0,
  },

  {
    value: "НЕГАТИВНЫЕ",
    href: "?grade=-1&page=1",
    grade: -1,
  },
];
