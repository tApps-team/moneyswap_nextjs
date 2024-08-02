import { City } from "@/entities/location/city";
import { Name } from "@/shared/types";

export type Country = {
  id: number;
  name: Name;
  icon_url: string;
  cities: City[];
};
