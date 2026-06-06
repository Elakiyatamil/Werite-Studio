// src/engine/layoutEngine.ts
import {
  prepare,
  layout,
  prepareWithSegments,
  layoutWithLines,
  layoutNextLineRange,
  materializeLineRange,
  measureLineStats,
  walkLineRanges,
  measureNaturalWidth,
  clearCache,
  setLocale,
} from '@chenglou/pretext'
import {
  prepareRichInline,
  layoutNextRichInlineLineRange,
  materializeRichInlineLineRange,
  type RichInlineItem,
} from '@chenglou/pretext/rich-inline'
import type { PlacedImage, PlacedShape, PageAnnotation, RenderedLine, PageLayout, DocNode } from '../types'
import { PARA_INDENT, PARA_SPACING, MIN_EXCLUSION_W, FONTS } from './constants'

// ── Cache ────────────────────────────────────────────────────────
const prepCache = new Map<string, ReturnType<typeof prepare>>()
const prepWSCache = new Map<string, ReturnType<typeof prepareWithSegments>>()
const prepRichCache = new Map<string, any>()

function getPrep(text: string, font: string) {
  const k = font + '§' + text
  if (!prepCache.has(k)) prepCache.set(k, prepare(text, font))
  return prepCache.get(k)!
}

function getPrepWS(text: string, font: string) {
  const k = font + '§' + text
  if (!prepWSCache.has(k)) prepWSCache.set(k, prepareWithSegments(text, font))
  return prepWSCache.get(k)!
}

function getPrepRich(text: string, font: string) {
  const k = font + '§' + text
  if (!prepRichCache.has(k)) {
    const items = parseToRichInlineItems(text, font)
    prepRichCache.set(k, prepareRichInline(items))
  }
  return prepRichCache.get(k)!
}

export function invalidateCache() {
  prepCache.clear()
  prepWSCache.clear()
  prepRichCache.clear()
  clearCache()
}

// ── Parse inline markdown for rich text ─────────────────────────
export function parseToRichInlineItems(
  text: string,
  bodyFont: string
): RichInlineItem[] {
  const size = parseInt(bodyFont) || 16
  const family = bodyFont.split(' ').slice(1).join(' ') || 'Georgia, serif'
  const boldFont = `bold ${size}px ${family}`
  const italicFont = `italic ${size}px ${family}`

  const items: RichInlineItem[] = []
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const plainText = text.slice(lastIndex, match.index)
    if (plainText) {
      items.push({ text: plainText, font: bodyFont, break: 'normal' })
    }
    const matchedText = match[0]
    if (matchedText.startsWith('**')) {
      items.push({ text: matchedText.slice(2, -2), font: boldFont, break: 'normal' })
    } else if (matchedText.startsWith('*')) {
      items.push({ text: matchedText.slice(1, -1), font: italicFont, break: 'normal' })
    }
    lastIndex = regex.lastIndex
  }
  const remainingText = text.slice(lastIndex)
  if (remainingText) {
    items.push({ text: remainingText, font: bodyFont, break: 'normal' })
  }
  return items
}

// ── Paragraph height (for page overflow check) ───────────────────
export function measureParaHeight(text: string, font: string, maxW: number, lineH: number) {
  const p = getPrep(text, font)
  return layout(p, maxW, lineH).height
}

// ── Chapter title centering ──────────────────────────────────────
export function measureChapterWidth(title: string, font: string, maxW: number) {
  const p = getPrepWS(title, font)
  return measureLineStats(p, maxW).maxLineWidth
}

// ── Natural width for UI labels ──────────────────────────────────
export function getLabelWidth(text: string, font: string) {
  const p = getPrepWS(text, font)
  return measureNaturalWidth(p)
}

// ── Balanced text width (for pull quotes) ────────────────────────
export function getBalancedWidth(text: string, font: string, targetLines: number, bodyW: number) {
  const p = getPrepWS(text, font)
  let lo = 80, hi = bodyW
  while (hi - lo > 1) {
    const mid = (lo + hi) / 2
    let count = 0
    walkLineRanges(p, mid, () => { count++ })
    if (count <= targetLines) hi = mid
    else lo = mid
  }
  return hi
}

// ── Exclusion zone for text-around-image ─────────────────────────
function getExclusion(
  lineY: number,
  lineH: number,
  images: PlacedImage[],
  margins: { l: number, r: number, bodyW: number }
) {
  for (const img of images) {
    if (lineY >= img.y && lineY < img.y + img.height + lineH) {
      if (img.float === 'right') {
        const avail = img.x - margins.l - 12
        if (avail >= MIN_EXCLUSION_W) {
          return { availW: avail, xStart: margins.l }
        }
      }
      if (img.float === 'left') {
        const xStart = img.x + img.width + 12
        const avail = margins.l + margins.bodyW - xStart
        if (avail >= MIN_EXCLUSION_W) {
          return { availW: avail, xStart }
        }
      }
    }
  }
  return null
}

// ── Drop cap measurement ─────────────────────────────────────────
export function measureDropCap(firstLetter: string, dropCapFont: string): number {
  const p = getPrepWS(firstLetter, dropCapFont)
  return measureNaturalWidth(p)
}

// ── Master document layout ────────────────────────────────────────
export function layoutDocument(
  nodes: DocNode[],
  allImages: PlacedImage[],
  allShapes: PlacedShape[],
  allAnnotations: PageAnnotation[],
  fonts: typeof FONTS,
  lineH: number,
  preset: { w: number, h: number, ml: number, mr: number, mt: number, mb: number }
): PageLayout[] {
  const pages: PageLayout[] = []
  let currentLines: RenderedLine[] = []
  let pageIndex = 0
  let y = preset.mt
  const bodyW = preset.w - preset.ml - preset.mr
  const margins = { l: preset.ml, r: preset.mr, bodyW }
  let afterHeading = false

  function imagesOnPage() {
    return allImages.filter(i => i.pageIndex === pageIndex)
  }

  function newPage() {
    pages.push({
      pageIndex,
      lines: currentLines,
      images: imagesOnPage(),
      shapes: allShapes.filter(s => s.pageIndex === pageIndex),
      annotations: allAnnotations.filter(a => a.pageIndex === pageIndex)
    })
    pageIndex++
    currentLines = []
    y = preset.mt
    afterHeading = false
  }

  function addLine(line: RenderedLine) {
    currentLines.push(line)
  }

  for (let ni = 0; ni < nodes.length; ni++) {
    const node = nodes[ni]

    // ── Chapter heading ──
    if (node.type === 'chapter') {
      y += 32
      if (y > preset.h - preset.mb - lineH * 3) {
        newPage()
      }
      const titleUpper = node.text.toUpperCase()
      const p = getPrepWS(titleUpper, fonts.chapter)
      const titleLines = layoutWithLines(p, bodyW, lineH + 6).lines
      for (const l of titleLines) {
        if (y > preset.h - preset.mb) {
          newPage()
        }
        const centerX = preset.ml + (bodyW - l.width) / 2
        addLine({ text: l.text, x: centerX, y, width: l.width, font: fonts.chapter })
        y += lineH + 6
      }
      y += lineH * 0.5
      afterHeading = true
      continue
    }

    // ── Scene break ──
    if (node.type === 'scenebreak') {
      y += lineH
      if (y > preset.h - preset.mb - lineH * 2) {
        newPage()
      }
      const sbW = getLabelWidth('* * *', fonts.body)
      addLine({ text: '* * *', x: preset.ml + (bodyW - sbW) / 2, y, width: sbW, font: fonts.body })
      y += lineH * 2
      afterHeading = true
      continue
    }

    // ── Pull quote ──
    if (node.type === 'pullquote') {
      const balW = getBalancedWidth(node.text, fonts.pullquote, 3, bodyW * 0.6)
      const p = getPrepWS(node.text, fonts.pullquote)
      const qLines = layoutWithLines(p, balW, lineH).lines
      const xOff = preset.ml + (bodyW - balW) / 2
      y += lineH * 0.5
      for (const l of qLines) {
        if (y > preset.h - preset.mb) {
          newPage()
        }
        addLine({ text: l.text, x: xOff, y, width: l.width, font: fonts.pullquote })
        y += lineH
      }
      y += lineH * 0.5
      continue
    }

    // ── Paragraph ──
    if (node.type === 'paragraph') {
      // Check if paragraph contains rich-inline markers
      let isRich = node.text.includes('**') || node.text.includes('*')

      const estH = measureParaHeight(node.text, fonts.body, bodyW, lineH)
      // Check overflow before layout
      if (y + Math.min(estH, lineH * 3) > preset.h - preset.mb && y > preset.mt + lineH * 2) {
        newPage()
      }

      let dropCapLines = afterHeading ? 3 : 0
      let dropCapWidth = afterHeading ? measureDropCap(node.text[0], fonts.dropcap) : 0
      let restText = afterHeading ? node.text.slice(1) : node.text

      if (afterHeading) {
        addLine({
          text: node.text[0],
          x: preset.ml,
          y: y - 8, // shift up slightly to align visually with top of line
          width: dropCapWidth,
          font: fonts.dropcap,
          isDropCap: true
        })
        isRich = restText.includes('**') || restText.includes('*')
        afterHeading = false
      }

      let prepared = isRich
        ? getPrepRich(restText, fonts.body)
        : getPrepWS(restText, fonts.body)

      let cursor: any = isRich
        ? { itemIndex: 0, segmentIndex: 0, graphemeIndex: 0 }
        : { segmentIndex: 0, graphemeIndex: 0 }

      let lineIndex = 0
      let indent = ni > 0 && !dropCapWidth // don't indent if dropcap is present

      while (true) {
        if (y > preset.h - preset.mb) {
          newPage()
          dropCapLines = 0
          indent = false
        }

        const excl = getExclusion(y, lineH, imagesOnPage(), margins)
        let availW = excl ? excl.availW : margins.bodyW
        let xStart = excl ? excl.xStart : margins.l

        // Drop cap exclusion: first 3 lines of paragraph wrap around it
        if (dropCapLines > 0 && lineIndex < dropCapLines) {
          availW -= (dropCapWidth + 12)
          xStart += (dropCapWidth + 12)
        }

        // Paragraph indent
        if (indent && lineIndex === 0) {
          availW -= PARA_INDENT
          xStart += PARA_INDENT
        }

        if (availW < 60) {
          y += lineH
          lineIndex++
          continue
        }

        if (isRich) {
          const range = layoutNextRichInlineLineRange(prepared, availW, cursor)
          if (range === null) break

          const materialized = materializeRichInlineLineRange(prepared, range)
          const richItems = parseToRichInlineItems(restText, fonts.body)
          const fragments = materialized.fragments.map(f => ({
            text: f.text,
            font: richItems[f.itemIndex].font,
            width: f.occupiedWidth
          }))

          addLine({
            text: fragments.map(f => f.text).join(''),
            x: xStart,
            y,
            width: materialized.width,
            font: fonts.body,
            fragments
          })

          cursor = range.end
        } else {
          const range = layoutNextLineRange(prepared as any, cursor, availW)
          if (range === null) break

          const line = materializeLineRange(prepared as any, range)
          addLine({
            text: line.text,
            x: xStart,
            y,
            width: line.width,
            font: fonts.body
          })

          cursor = range.end
        }

        y += lineH
        lineIndex++
      }

      y += PARA_SPACING
    }
  }

  pages.push({
    pageIndex,
    lines: currentLines,
    images: imagesOnPage(),
    shapes: allShapes.filter(s => s.pageIndex === pageIndex),
    annotations: allAnnotations.filter(a => a.pageIndex === pageIndex)
  })

  return pages
}

export function changeLocale(locale: string) {
  setLocale(locale === 'default' ? 'en' : locale)
  invalidateCache()
}

export function renderFixedColumn(text: string, font: string, maxWidth: number) {
  const p = getPrepWS(text, font)
  return layoutWithLines(p, maxWidth, 27).lines
}
