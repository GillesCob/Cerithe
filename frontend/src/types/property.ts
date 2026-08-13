import type { IRoom } from "./room";

type HouseType = "HOUSE" | "APPARTMENT";

export interface IProperty {
  id: string;
  name: string;
  address: string;
  houseType: HouseType;
  surface: number;
  numberOfLevels: number;
  numberOfBasementLevels: number;
  profileId: string;
  room?: IRoom[];
}
