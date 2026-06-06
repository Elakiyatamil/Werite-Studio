// src/engine/constants.ts
export const PAGE_W       = 560
export const PAGE_H       = 794
export const MARGIN_L     = 56
export const MARGIN_R     = 56
export const MARGIN_T     = 72
export const MARGIN_B     = 64
export const BODY_W       = PAGE_W - MARGIN_L - MARGIN_R  // 448
export const LINE_H       = 27
export const PARA_SPACING = 10
export const PARA_INDENT  = 28
export const MIN_EXCLUSION_W = 120

// FONTS — user can change body font from settings panel
export const FONTS = {
  body:      '16px Georgia, serif',
  chapter:   'bold 22px Georgia, serif',
  dropcap:   'bold 64px Georgia, serif',
  pullquote: 'italic 15px Georgia, serif',
  ui:        '13px Inter, system-ui',
}

// PAPERBACK PRESETS (user picks from dropdown in settings)
export const PAPERBACK_PRESETS: Record<string, { w: number, h: number, ml: number, mr: number, mt: number, mb: number }> = {
  'A5 (148×210mm)':        { w: 560,  h: 794,  ml: 56, mr: 56, mt: 72, mb: 64 },
  'US Trade (6×9in)':      { w: 576,  h: 864,  ml: 60, mr: 60, mt: 72, mb: 64 },
  'Digest (5.5×8.5in)':    { w: 528,  h: 816,  ml: 52, mr: 52, mt: 68, mb: 60 },
  'Mass Market (4.25×7in)':{ w: 408,  h: 672,  ml: 44, mr: 44, mt: 60, mb: 56 },
  'Royal (6.14×9.21in)':   { w: 590,  h: 885,  ml: 62, mr: 62, mt: 74, mb: 66 },
}
