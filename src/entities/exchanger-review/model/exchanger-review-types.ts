import { ReviewEnum } from "@/shared/types";

export type ExchangerReview = {
  id: number;
  username: string;
  review_date: string;
  review_time: string;
  review_from: ReviewFrom;
  grade: ReviewEnum;
  text: string;
  comment_count: number;
};
export type Comment = {
  id: number;
  comment_date: string;
  comment_time: string;
  text: string;
  role: CommentRole;
  username: string;
};

export enum Grade {
  positive = 1,
  neutral = 0,
  negative = -1,
  all = "all",
}
export enum ReviewFrom {
  moneyswap = "moneyswap",
  bestchange = "bestchange",
}
export enum CommentRole {
  admin = "admin",
  user = "user",
  exchanger = "exchanger",
}
