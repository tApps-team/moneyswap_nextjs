import { CategoriesWithLang } from "..";

type ReqFetchAvailableDto = {
  base: string | undefined;
  city?: string;
};

export const getAvailable = async ({
  base = "all",
  city,
}: ReqFetchAvailableDto): Promise<CategoriesWithLang> => {
  const apiUrl = city
    ? `/api/available_valutes?city=${city}&base=${base}`
    : `/api/available_valutes?base=${base}`;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiUrl}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
