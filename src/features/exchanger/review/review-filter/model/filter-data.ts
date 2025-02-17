import { ReviewEnum } from "@/shared/types";

type FilterData = {
  value: string;
  review: ReviewEnum;
  grade: number | undefined;
};
export const filterData: FilterData[] = [
  {
    value: "Все",
    review: ReviewEnum.all,
    grade: undefined,
  },

  {
    value: "Положительные",
    review: ReviewEnum.positive,
    grade: 1,
  },

  {
    value: "Нейтральные",
    review: ReviewEnum.neutral,
    grade: 0,
  },

  {
    value: "Негативные",
    review: ReviewEnum.negative,
    grade: -1,
  },
];
