import { VedReviewRating } from "../api/ved-dto";

export interface VedReviewDisplay {
  id: number;
  username: string;
  stars: number;
  sentiment: VedReviewRating;
  text: string;
  date: string;
}

export type VedReviewFilter = "all" | VedReviewRating;
