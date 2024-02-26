export type Exchanger = {
  id: number;
  name: {
    ru: string;
    en: string;
  };
  partner_link: string;
  valute_from: string;
  icon_valute_from: string;
  valute_to: string;
  icon_valute_to: string;
  in_count: number;
  out_count: number;
  min_amount: string;
  max_amount: string;
};
