import { Exchanger } from "..";

type ReqFetchExchangersDto = {
  from: string | undefined;
  to: string | undefined;
  city?: string | undefined;
};

export const getExchangers = async ({
  from,
  to,
  city,
}: ReqFetchExchangersDto): Promise<Exchanger[]> => {
  const apiUrl = city
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/directions_multi?city=${city}&valute_from=${from}&valute_to=${to}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/directions_multi?valute_from=${from}&valute_to=${to}`;

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error: any) {
    console.error("Error during fetch");
    return error;
  }
};
