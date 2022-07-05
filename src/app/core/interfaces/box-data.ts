import { ChartDataInterface } from "./chart-data.interface";

export interface BoxData {
  sales: number;
  consumtions?: number;
  utility?: number;
  profits?: number;
  results?: number;
  report: ChartDataInterface[];
}
