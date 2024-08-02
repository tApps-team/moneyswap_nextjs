import { Name } from "@/shared/types";
import { Country } from "../model/country-types";

export type GetCountriesDtoResponse = Country[];
export type GetCountriesDtoRequest = {};

export type GetSpecificCityResponse = {
  id: number;
  name: Name;
  code_name: string;
  country: {
    name: Name;
    icon_url: string;
  };
};
export type GetSpecificCityRequest = { codeName: string };
