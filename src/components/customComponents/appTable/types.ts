import { SelectChangeEvent } from "@mui/material";
import { DatePickerProps } from "@mui/x-date-pickers";
import { DateRange, DayPickerProps } from "react-day-picker";

export type TColumn<T> = {
  key: keyof T | "actionColumn";
  header: string;
  render?: (val: T[keyof T], row: T) => React.ReactNode;
  minWidth?: number;
  width?: number;
  canSort?: boolean;
};

export type TSearchOpt<T> = {
  label: string;
  value: T;
};

export enum EFilterList {
  date,
  dateRange,
  select,
}

type TFilterOpt = {
  label: string;
  value: string;
};

export type TFilterList = {
  defaultShow?: boolean;
  label: string;
} & (
  | {
      value: string;
      type: EFilterList.select;
      options: TFilterOpt[];
      onChange: (event: SelectChangeEvent, child: React.ReactNode) => void;
    }
  | {
      type: EFilterList.date;
      options?: undefined;
      componentProps?: DatePickerProps & React.RefAttributes<HTMLDivElement>;
    }
  | {
      type: EFilterList.dateRange;
      options?: undefined;
      componentProps?: DayPickerProps;
      onChange: (data: DateRange) => void;
    }
);
