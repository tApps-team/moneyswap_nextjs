import { Exchanger } from "@/shared/types";

export const getPosts = async (): Promise<Exchanger[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/directions_multi?city=msk&valute_from=btc&valute_to=cashrub`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
