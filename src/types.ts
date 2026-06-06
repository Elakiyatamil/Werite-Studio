// src/types.ts

export type DocNodeType =
  | 'chapter'    // ## Title
  | 'paragraph'  // body text
  | 'scenebreak' // * * *
  | 'pullquote'  // > text

export interface DocNode {
  type: DocNodeType
  text: string
}

export interface PlacedImage {
  id: string
  src: string          // data URL
  x: number            // px from page left
  y: number            // px from page top
  width: number
  height: number
  float: 'left' | 'right' | 'none'
  pageIndex: number
  opacity: number      // 0.1–1.0, default 1.0
  label?: string       // user-set label shown in thumbnail
}

export interface PlacedShape {
  id: string
  type: 'rect' | 'circle' | 'line' | 'arrow' | 'freehand'
  x: number
  y: number
  width: number
  height: number
  strokeColor: string
  fillColor: string    // 'transparent' for no fill
  strokeWidth: number
  pageIndex: number
  points?: { x: number; y: number }[]  // for freehand
}

export interface PageAnnotation {
  id: string
  pageIndex: number
  text: string         // user's comment/note/sketch label
  x: number
  y: number
  color: string        // sticky note color
  isOpen: boolean
}

export interface RenderedLine {
  text: string
  x: number
  y: number
  width: number
  font: string
  isDropCap?: boolean
  fragments?: { text: string; font: string; width: number }[]
}

export interface PageLayout {
  pageIndex: number
  lines: RenderedLine[]
  images: PlacedImage[]
  shapes: PlacedShape[]
  annotations: PageAnnotation[]
}

export interface DocumentState {
  rawText: string
  title: string
  bodyFont: string
  fontSize: number        // base font size in px (12–24)
  lineHeight: number      // in px
  paperbackPreset: string
  images: PlacedImage[]
  shapes: PlacedShape[]
  annotations: PageAnnotation[]
  activeColor: string
  highlightColor: string  // for text highlighting
}
