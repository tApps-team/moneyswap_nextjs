import { CategoriesWithLang } from "..";

export const getAvailable = async (
  base: string,
): Promise<CategoriesWithLang> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/available_valutes_multi?base=${base}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
