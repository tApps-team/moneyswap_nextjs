import { apiClient } from "@/shared/api";
import { getSimilarCitiesDtoRequest, getSimilarCitiesDtoResponse } from "./city-api-dto";

export const getSimilarCities = async (props: getSimilarCitiesDtoRequest) => {
  const { city, valute_to, valute_from } = props;
  const url = `/api/v2/similar_cities_by_direction?valute_from=${valute_from}&valute_to=${valute_to}&city=${city}`;
  const response = apiClient.get<getSimilarCitiesDtoResponse>(url);

  return response;
};

export const getAllSimilarCities = async (props: getSimilarCitiesDtoRequest) => {
  const { city, valute_to, valute_from } = props;
  const url = `/api/v2/extended_similar_cities_by_direction?valute_from=${valute_from}&valute_to=${valute_to}&city=${city}`;
  const response = apiClient.get<getSimilarCitiesDtoResponse>(url);

  return response;
};