import { ReviewEnum } from "@/shared/types";

type FilterData = {
  value: string;
  review: ReviewEnum;
  grade: number | undefined;
};
export const filterData: FilterData[] = [
  {
    value: "ВСЕ",
    review: ReviewEnum.all,
    grade: undefined,
  },

  {
    value: "ПОЛОЖИТЕЛЬНЫЕ",
    review: ReviewEnum.positive,
    grade: 1,
  },

  {
    value: "НЕЙТРАЛЬНЫЕ",
    review: ReviewEnum.neutral,
    grade: 0,
  },

  {
    value: "НЕГАТИВНЫЕ",
    review: ReviewEnum.negative,
    grade: -1,
  },
];
