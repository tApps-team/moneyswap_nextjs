export type getSimilarCitiesDtoResponse = {
  pk: number;
  name: string;
  code_name: string;
  exchange_count: number;
}[];
export type getSimilarCitiesDtoRequest = {
  vaute_from: string;
  valute_to: string;
  city: string;
};
