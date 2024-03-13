import { positionList, gradientDirection,gradientType, repeatList, sizeList } from "src/utils/stringList";

export type positions = typeof positionList[number];
export type repeats = typeof repeatList[number];
export type sizes = typeof sizeList[number];
export type grdDirection = typeof gradientDirection[number];
export type grdType = typeof gradientType[number];

export interface bgmdStyle {
  pos: positions[],
  rep: repeats,
  siz: sizes,
  opa: string|null
  bgi: string | null,
  bgc: string,
  grd: [grdDirection,grdType]
}