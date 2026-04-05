import { CFDI_Types } from "@constants/Enums";

export type TState =
  | "period_creditable"
  | "period_transferred"
  | "exercise_creditable"
  | "exercise_transferred";

export interface FetchFDIsType {
  forIVA?: boolean;
  ivaTab?: TabIVAType;
  excluded?: boolean;
  module: CFDIModule;
  type: CFDI_Types;
  options?: SearchOptions & {
    overridePeriodDates?: boolean;
  };
}

export type UpdateUUIDsType = SingleUpdateUUIDType[];

export type SingleUpdateUUIDType = {
  uuid: string;
  currentValue: boolean;
  is_issued: boolean;
};

export type updateDoctosType = SingleUpdateDoctosType[];

export type SingleUpdateDoctosType = {
  uuid: string;
  currentValue: boolean;
};

export type updateIVACFDIPayloadType = {
  uuids: IVACFDIsPayloadType;
};

export type IVACFDIsPayloadType = {UUID: string; [key: string]: boolean | string}[];

export type DoctosToExcludePayloadType = {
  [UUID: string]: boolean;
};

export type FetchDoctosType = {
  dates: string;
  options: SearchOptions;
};
