// eslint-disable-next-line boundaries/element-types
import { DirectionMarker } from "@/shared/types";

export type IncreaseLinkCountReq = {
  user_id: number;
  exchange_id: number;
  direction_marker: DirectionMarker;
  exchange_direction_id: number;
};