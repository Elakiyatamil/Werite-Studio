// src/hooks/useDocumentState.ts
import { useState, useMemo } from 'react'
import type { DocumentState, PlacedImage, PlacedShape, PageAnnotation } from '../types'
import { parseDocument } from '../engine/parseDocument'
import { layoutDocument, invalidateCache } from '../engine/layoutEngine'
import { FONTS, LINE_H, PAPERBACK_PRESETS } from '../engine/constants'

export const DEMO_TEXT = `## Chapter One: The Gate of Blackthorn

The road had forgotten it was a road. Beneath the canopy of blackthorn and silver ash, it had become something older — a scar in the earth that the forest was slowly reclaiming, one root and one season at a time.

She carried three things into the wilderness: a letter she had not yet read, a knife she had not yet used, and a name she was not yet ready to speak aloud.

The forest did not care about any of it.

* * *

> The gate stood at the edge of memory, where maps ran out of words.

By the time the gate appeared, the light had gone amber-grey and the blackthorns had grown close enough to touch her shoulders from both sides of the path. She did not slow down.

She stopped three feet from it and read the name carved in the keystone: Kazad-Dul. Est. 741.

## Chapter Two: The Keeper's Name

The Keeper had no face that she could remember afterward. Only hands — old, careful, ink-stained — and a voice that sounded like a page being turned.

She asked the only question that mattered: **"How long has the gate been open?"**

The Keeper considered this for *three full seconds* before answering.`

export function useDocumentState() {
  const [state, setState] = useState<DocumentState>({
    rawText: DEMO_TEXT,
    title: 'Untitled Novel',
    bodyFont: FONTS.body,
    fontSize: 16,
    lineHeight: LINE_H,
    paperbackPreset: 'A5 (148×210mm)',
    images: [],
    shapes: [],
    annotations: [],
    activeColor: '#1a1714',
    highlightColor: '#fde68a',
  })

  const nodes = useMemo(() => parseDocument(state.rawText), [state.rawText])

  const preset = PAPERBACK_PRESETS[state.paperbackPreset] ??
                 PAPERBACK_PRESETS['A5 (148×210mm)']

  const fonts: typeof FONTS = useMemo(() => {
    const size   = state.fontSize
    const family = state.bodyFont.split(' ').slice(1).join(' ') || 'Georgia, serif'
    return {
      body:      `${size}px ${family}`,
      chapter:   `bold ${Math.round(size * 1.4)}px ${family}`,
      dropcap:   `bold ${size * 4}px ${family}`,
      pullquote: `italic ${size - 1}px ${family}`,
      ui:        FONTS.ui,
    }
  }, [state.bodyFont, state.fontSize])

  const lineH = state.lineHeight

  const pages = useMemo(
    () => layoutDocument(nodes, state.images, state.shapes, state.annotations, fonts, lineH, preset),
    [nodes, state.images, state.shapes, state.annotations, fonts, lineH, preset]
  )

  // Actions
  function setText(rawText: string) {
    setState(s => ({...s, rawText}))
  }

  function addImage(src: string, float: PlacedImage['float'], insertY: number, pageIndex: number) {
    const width = 160, height = 200
    const x = float === 'right'
      ? preset.w - preset.mr - width
      : float === 'left' ? preset.ml : preset.ml + (preset.w - preset.ml - preset.mr - width) / 2
    setState(s => ({
      ...s,
      images: [...s.images, {
        id: crypto.randomUUID(), src, x, y: insertY,
        width, height, float, pageIndex, opacity: 1,
      }]
    }))
  }

  function moveImage(id: string, x: number, y: number) {
    setState(s => ({ ...s, images: s.images.map(i => i.id === id ? {...i, x, y} : i) }))
  }

  function resizeImage(id: string, w: number, h: number) {
    setState(s => ({ ...s, images: s.images.map(i => i.id === id ? {...i, width:w, height:h} : i) }))
  }

  function updateImage(id: string, patch: Partial<PlacedImage>) {
    setState(s => ({ ...s, images: s.images.map(i => i.id === id ? {...i, ...patch} : i) }))
  }

  function removeImage(id: string) {
    setState(s => ({ ...s, images: s.images.filter(i => i.id !== id) }))
  }

  function addShape(shape: Omit<PlacedShape, 'id'>) {
    setState(s => ({ ...s, shapes: [...s.shapes, { ...shape, id: crypto.randomUUID() }] }))
  }

  function updateShape(id: string, patch: Partial<PlacedShape>) {
    setState(s => ({ ...s, shapes: s.shapes.map(sh => sh.id === id ? {...sh, ...patch} : sh) }))
  }

  function removeShape(id: string) {
    setState(s => ({ ...s, shapes: s.shapes.filter(sh => sh.id !== id) }))
  }

  function addAnnotation(pageIndex: number, x: number, y: number) {
    const ann: PageAnnotation = {
      id: crypto.randomUUID(), pageIndex, text: '', x, y,
      color: '#fef9c3', isOpen: true,
    }
    setState(s => ({ ...s, annotations: [...s.annotations, ann] }))
  }

  function updateAnnotation(id: string, patch: Partial<PageAnnotation>) {
    setState(s => ({ ...s, annotations: s.annotations.map(a => a.id === id ? {...a, ...patch} : a) }))
  }

  function setSetting<K extends keyof DocumentState>(key: K, value: DocumentState[K]) {
    if (key === 'bodyFont' || key === 'fontSize') invalidateCache()
    setState(s => ({...s, [key]: value}))
  }

  return {
    state, nodes, pages, preset, fonts, lineH,
    setText, addImage, moveImage, resizeImage, updateImage, removeImage,
    addShape, updateShape, removeShape,
    addAnnotation, updateAnnotation, setSetting,
  }
}
