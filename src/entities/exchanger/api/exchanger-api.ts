import {
  GetExchangersDtoRequest,
  GetExchangersDtoResponse,
  GetSimilarDirectionDtoRequset,
  GetSimilarDirectionDtoResponse,
} from "./exchanger-api-dto";

export const getExchangers = async (
  props: GetExchangersDtoRequest,
): Promise<{ exchangers: GetExchangersDtoResponse; status: number }> => {
  const { valute_from, valute_to, city } = props;

  const url = city
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/directions?city=${city}&valute_from=${valute_from}&valute_to=${valute_to}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/directions?valute_from=${valute_from}&valute_to=${valute_to}`;
  const res = await fetch(url, {
    method: "GET",
    next: {
      tags: city
        ? ["directions", valute_from, valute_to, city]
        : ["directions", valute_from, valute_to],
    },
    cache: "no-store",
  });
  const data = await res.json();

  return { exchangers: data, status: res.status };
};

export const getSimilarDirections = async (
  props: GetSimilarDirectionDtoRequset,
): Promise<GetSimilarDirectionDtoResponse> => {
  const { exchangeMarker, valuteFrom, valuteTo, city, limit } = props;
  const url = city
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/similar_directions?exchange_marker=cash&valute_from=${valuteFrom}&valute_to=${valuteTo}&city=${city}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/similar_directions?exchange_marker=no_cash&valute_from=${valuteFrom}&valute_to=${valuteTo}`;

  console.log(url);
  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};
