import { GetExchangersDtoRequest, GetExchangersDtoResponse } from "./exchanger-api-dto";

export const getExchangers = async (
  props: GetExchangersDtoRequest,
): Promise<GetExchangersDtoResponse> => {
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

  return data;
};
