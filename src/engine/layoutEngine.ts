// src/engine/layoutEngine.ts
import { prepare, layoutNextLineRange, materializeLineRange } from '@chenglou/pretext';
import type { PlacedImage } from '../types';

export const BODY_FONT = '16px Georgia, serif';
export const CHAPTER_FONT = 'bold 18px Georgia, serif';
export const LINE_HEIGHT = 26;
export const PAGE_WIDTH = 560;
export const PAGE_HEIGHT = 794;
export const MARGIN_LEFT = 56;
export const MARGIN_RIGHT = 56;
export const MARGIN_TOP = 64;
export const MARGIN_BOTTOM = 64;
export const BODY_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 448px

export interface LayoutLine {
  text: string;
  x: number;
  y: number;
  font: string;
  pageIndex: number;
}

// Caches for @chenglou/pretext PreparedText handles to avoid calling prepare repeatedly
// Key: `${text}::${font}` -> PreparedText
const preparedCache = new Map<string, any>();

function getPreparedText(text: string, font: string) {
  const key = `${text}::${font}`;
  if (preparedCache.has(key)) {
    return preparedCache.get(key);
  }
  const prepared = prepare(text, font, { whiteSpace: 'normal' });
  preparedCache.set(key, prepared);
  return prepared;
}

export function computeLayout(
  rawText: string,
  placedImages: PlacedImage[]
): LayoutLine[] {
  const lines: LayoutLine[] = [];
  
  // Parse paragraphs
  const paragraphs = rawText.split(/\n\n+/);
  let currentY = MARGIN_TOP;
  let pageIndex = 0;

  for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
    const para = paragraphs[pIdx].trim();
    if (!para) continue;

    // Scene break
    if (para === '* * *') {
      if (currentY + LINE_HEIGHT * 2 > PAGE_HEIGHT - MARGIN_BOTTOM) {
        pageIndex++;
        currentY = MARGIN_TOP;
      }
      lines.push({ 
        text: '* * *', 
        x: PAGE_WIDTH / 2 - 20, 
        y: currentY + 8, 
        font: BODY_FONT,
        pageIndex 
      });
      currentY += LINE_HEIGHT * 2;
      continue;
    }

    // Chapter heading: ## Title
    if (para.startsWith('## ')) {
      const title = para.slice(3).toUpperCase();
      if (currentY + LINE_HEIGHT * 3 > PAGE_HEIGHT - MARGIN_BOTTOM) {
        pageIndex++;
        currentY = MARGIN_TOP;
      } else {
        currentY += 20;
      }
      lines.push({ 
        text: title, 
        x: PAGE_WIDTH / 2, // Centered in PageRenderer
        y: currentY, 
        font: CHAPTER_FONT,
        pageIndex 
      });
      currentY += LINE_HEIGHT * 2;
      continue;
    }

    // Body paragraph — use layoutNextLineRange for per-line width control
    const prepared = getPreparedText(para, BODY_FONT);
    let cursor: any = 0;
    let isFirstLine = true;

    while (cursor < para.length) {
      if (currentY + LINE_HEIGHT > PAGE_HEIGHT - MARGIN_BOTTOM) {
        pageIndex++;
        currentY = MARGIN_TOP;
        isFirstLine = false; // reset indent on new page
      }

      // Calculate exclusion zone at this y
      const exclusion = getExclusionAtY(currentY, placedImages, pageIndex);
      let lineWidth = BODY_WIDTH;
      let xStart = MARGIN_LEFT;

      if (exclusion) {
        lineWidth = exclusion.lineWidth;
        xStart = exclusion.xStart;
      }

      // First line of paragraph: add indent
      const indent = isFirstLine && pIdx > 0 ? 24 : 0;
      const effectiveWidth = lineWidth - indent;
      const effectiveX = xStart + indent;

      const range = layoutNextLineRange(prepared, cursor as any, effectiveWidth);
      if (!range) break;

      const materialized = materializeLineRange(prepared, range);
      const lineText = typeof materialized === 'string' ? materialized : (materialized.text || '');

      lines.push({ 
        text: lineText, 
        x: effectiveX, 
        y: currentY, 
        font: BODY_FONT,
        pageIndex 
      });

      cursor = range.end;
      currentY += LINE_HEIGHT;
      isFirstLine = false;
    }

    currentY += 12;  // paragraph spacing
  }

  return lines;
}

function getExclusionAtY(
  y: number,
  images: PlacedImage[],
  pageIndex: number
): { lineWidth: number; xStart: number } | null {
  for (const img of images) {
    if (img.pageIndex !== pageIndex) continue;
    if (img.float === 'none') continue;

    const imgTop = img.y;
    const imgBottom = img.y + img.height;
    
    // Check if the current line overlaps vertically with the image.
    // We add a safety padding of LINE_HEIGHT/2.
    if (y >= imgTop - 8 && y <= imgBottom + 8) {
      if (img.float === 'right') {
        return {
          lineWidth: img.x - MARGIN_LEFT - 12,
          xStart: MARGIN_LEFT,
        };
      }
      if (img.float === 'left') {
        return {
          lineWidth: (MARGIN_LEFT + BODY_WIDTH) - (img.x + img.width + 12),
          xStart: img.x + img.width + 12,
        };
      }
    }
  }
  return null;
}
