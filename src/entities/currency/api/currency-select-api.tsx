import { GetAvailableValutesDtoRequest, GetAvailableValutesDtoResponse } from "./currency-dto";

export const getAvailableValutes = async (
  props: GetAvailableValutesDtoRequest,
): Promise<GetAvailableValutesDtoResponse> => {
  const { base = "all", city } = props;
  //   const url = new URL(props.base);
  //   const searchParams = new URLSearchParams(url.);
  const url = city
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/available_valutes_2?city=${city}&base=${base}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/available_valutes_2?base=${base}`;
  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};
