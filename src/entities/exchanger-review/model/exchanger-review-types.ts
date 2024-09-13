import { ReviewEnum } from "@/shared/types";

export type ExchangerReview = {
  id: number;
  username: string;
  review_date: string;
  review_time: string;
  grade: ReviewEnum;
  text: string;
  comment_count: number;
};
export enum Grade {
  positive = 1,
  neutral = 0,
  negative = -1,
  all = "all",
}
