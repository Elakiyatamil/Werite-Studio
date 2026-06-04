// src/types.ts

export type FloatType = 'left' | 'right' | 'none';

export type IconName = 'dragon' | 'castle' | 'quill' | 'candle' | 'compass';

export interface PlacedImage {
  id: string;
  x: number;          // page-local coordinate
  y: number;          // page-local coordinate
  width: number;
  height: number;
  src: string;        // data URL for uploaded image, or empty for built-in icons
  float: FloatType;
  isBuiltIn: boolean;
  iconName?: IconName;
  pageIndex: number;  // 0-indexed page number
}

export interface ExclusionZone {
  xStart: number;
  lineWidth: number;
}
