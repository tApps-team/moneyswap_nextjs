import { Name } from "@/shared/types";

export type City = {
  id: number;
  name: Name;
  codeName: string;
};

export type Country = {
  id: number;
  name: Name;
  icon_url: string;
  cities: City[];
};
