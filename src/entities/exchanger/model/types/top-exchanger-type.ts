import { Review } from "@/shared/types";

export type TopExchanger = {
  id: number;
  iconUrl: string;
  name: string;
  reviewCount: Review;
  /**
   * Платное размещение — плашка «Лучшее предложение», как в таблице направлений.
   * Пока API top_exchanges этого поля не отдаёт; появится — карточка подхватит сама.
   */
  is_vip?: boolean;
};
