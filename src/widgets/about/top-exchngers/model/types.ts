import { ExchangerMarker, Review } from "@/shared/types";

export type TopExchanger = {
  id: number;
  iconUrl: string;
  name: string;
  reviewCount: Review;
  exchangerMarker: ExchangerMarker;
};
