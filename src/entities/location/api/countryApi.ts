import { Country } from "..";

export const getCountries = async (): Promise<Country[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cash/countries`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
