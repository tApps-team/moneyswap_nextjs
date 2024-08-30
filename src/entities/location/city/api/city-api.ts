import { apiClient } from "@/shared/api";
import { getSimilarCitiesDtoRequest, getSimilarCitiesDtoResponse } from "./city-api-dto";

export const getSimilarCities = async (props: getSimilarCitiesDtoRequest) => {
  const { city, valute_to, vaute_from } = props;
  const url = `/api/similar_cities_by_direction?valute_from=${vaute_from}&valute_to=${valute_to}&city=${city}`;
  const response = apiClient.get<getSimilarCitiesDtoResponse>(url);

  return response;
};
