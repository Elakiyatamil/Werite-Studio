// src/components/EditorPanel.tsx
import React, { useRef, useState } from 'react'
import type { PlacedImage, PageAnnotation, DocumentState } from '../types'
import { invalidateCache } from '../engine/layoutEngine'

interface Props {
  state: DocumentState
  onChangeText: (t: string) => void
  onUploadImage: (src: string, float: PlacedImage['float']) => void
  onUpdateImage: (id: string, patch: Partial<PlacedImage>) => void
  onRemoveImage: (id: string) => void
  shapeMode: string | null
  setShapeMode: (mode: string | null) => void
  onSetSetting: <K extends keyof DocumentState>(key: K, value: DocumentState[K]) => void
  annotations: PageAnnotation[]
  onAddAnnotationAtDefault: () => void
}

const PRESETS = [
  'A5 (148×210mm)',
  'US Trade (6×9in)',
  'Digest (5.5×8.5in)',
  'Mass Market (4.25×7in)',
  'Royal (6.14×9.21in)',
]

const LOCALES = [
  { value: 'default', label: 'Default (en)' },
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'Tamil' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ar', label: 'Arabic' },
]

export const EditorPanel: React.FC<Props> = ({
  state,
  onChangeText,
  onUploadImage,
  onUpdateImage,
  onRemoveImage,
  shapeMode,
  setShapeMode,
  onSetSetting,
  annotations,
  onAddAnnotationAtDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [nextImageFloat, setNextImageFloat] = useState<PlacedImage['float']>('right')
  const [showColorDropdown, setShowColorDropdown] = useState(false)
  const [showHighlightDropdown, setShowHighlightDropdown] = useState(false)

  const wordCount = state.rawText ? state.rawText.trim().split(/\s+/).filter(Boolean).length : 0

  const insertText = (before: string, after: string = '') => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const text = el.value
    const selected = text.slice(start, end)
    const replacement = before + selected + after
    onChangeText(text.slice(0, start) + replacement + text.slice(end))

    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + selected.length)
    }, 0)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      if (evt.target?.result) {
        onUploadImage(evt.target.result as string, nextImageFloat)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const scrollToAsset = (pageIndex: number) => {
    const targetPage = document.querySelector(`[data-page-index="${pageIndex}"]`)
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const labelSectionStyle = {
    fontSize: 10,
    fontWeight: 600,
    color: '#6b6880',
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    marginBottom: 6,
  }

  return (
    <div
      style={{
        background: '#15151d',
        borderRight: '1px solid #2a2a3a',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        color: '#b8b4d0',
        fontFamily: 'var(--ui-font, sans-serif)',
      }}
    >
      {/* 1. MANUSCRIPT HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #2a2a3a',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: '#c9a96e', textTransform: 'uppercase' }}>
          Manuscript
        </span>
        <span style={{ fontSize: 11, color: '#6b6880' }}>
          {wordCount.toLocaleString()} words
        </span>
      </div>

      {/* 2. TEXTAREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <textarea
          ref={textareaRef}
          value={state.rawText}
          onChange={e => onChangeText(e.target.value)}
          spellCheck
          style={{
            flex: 1,
            width: '100%',
            background: '#111118',
            color: '#d4d0e8',
            border: 'none',
            outline: 'none',
            padding: 16,
            resize: 'none',
            fontFamily: 'Menlo, Consolas, monospace',
            fontSize: 13,
            lineHeight: 1.7,
            overflowY: 'auto',
          }}
          placeholder="Start writing here..."
        />
      </div>

      {/* 3. SYNTAX LEGEND STRIP */}
      <div
        style={{
          padding: '8px 16px',
          fontSize: 11,
          color: '#6b6880',
          background: '#13131a',
          borderTop: '1px solid #2a2a3a',
          borderBottom: '1px solid #2a2a3a',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flexShrink: 0,
        }}
      >
        <div>
          <span style={{ color: '#c9a96e', fontWeight: 'bold' }}>##</span> Chapter heading
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span><span style={{ color: '#c9a96e' }}>* * *</span> Scene break</span>
          <span><span style={{ color: '#c9a96e' }}>&gt;</span> Pull quote</span>
        </div>
        <div>
          <span style={{ color: '#c9a96e' }}>↵↵</span> Paragraph break
        </div>
      </div>

      {/* Scrollable controls container below textarea */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* 4. TEXT FORMATTING TOOLBAR */}
        <div>
          <div style={labelSectionStyle}>Formatting</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => insertText('**', '**')}
              style={{
                width: 28,
                height: 28,
                background: '#242432',
                border: '1px solid #2e2e40',
                color: '#b8b4d0',
                cursor: 'pointer',
                borderRadius: 4,
                fontWeight: 'bold',
              }}
              title="Bold"
            >
              B
            </button>
            <button
              onClick={() => insertText('*', '*')}
              style={{
                width: 28,
                height: 28,
                background: '#242432',
                border: '1px solid #2e2e40',
                color: '#b8b4d0',
                cursor: 'pointer',
                borderRadius: 4,
                fontStyle: 'italic',
              }}
              title="Italic"
            >
              I
            </button>

            {/* Font Select */}
            <select
              value={state.bodyFont}
              onChange={e => onSetSetting('bodyFont', e.target.value)}
              style={{
                background: '#111118',
                color: '#d4d0e8',
                border: '1px solid #2e2e40',
                padding: '4px 6px',
                borderRadius: 4,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              <option value="16px Georgia, serif">Georgia</option>
              <option value="16px Palatino, serif">Palatino</option>
              <option value="16px 'Times New Roman', serif">Times New Roman</option>
              <option value="16px 'EB Garamond', serif">EB Garamond</option>
            </select>

            {/* Size Select */}
            <select
              value={state.fontSize}
              onChange={e => onSetSetting('fontSize', parseInt(e.target.value))}
              style={{
                background: '#111118',
                color: '#d4d0e8',
                border: '1px solid #2e2e40',
                padding: '4px 6px',
                borderRadius: 4,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {[12, 13, 14, 15, 16, 17, 18, 20, 24].map(sz => (
                <option key={sz} value={sz}>{sz}px</option>
              ))}
            </select>

            {/* Ink Color Swatch picker */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowColorDropdown(!showColorDropdown)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: state.activeColor,
                  border: '1px solid #c9a96e',
                  cursor: 'pointer',
                }}
                title="Ink Color"
              />
              {showColorDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 26,
                    left: 0,
                    zIndex: 100,
                    background: '#1a1a26',
                    border: '1px solid #2e2e40',
                    borderRadius: 4,
                    padding: 4,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 4,
                    width: 110,
                  }}
                >
                  {['#1a1714', '#8b4513', '#2c3e7a', '#1a4a2e', '#6b1a3a', '#c9a96e', '#4a2c5a', '#1f4e5b', '#3d2b1f', '#2b2b2b'].map(col => (
                    <button
                      key={col}
                      onClick={() => {
                        onSetSetting('activeColor', col)
                        setShowColorDropdown(false)
                      }}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: col,
                        border: state.activeColor === col ? '1px solid #fff' : 'none',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Highlight color picker */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowHighlightDropdown(!showHighlightDropdown)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  background: state.highlightColor === 'transparent' ? 'transparent' : state.highlightColor,
                  border: '1px dashed #c9a96e',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: '#fff',
                }}
                title="Highlight Color"
              >
                {state.highlightColor === 'transparent' ? 'H' : ''}
              </button>
              {showHighlightDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 26,
                    left: 0,
                    zIndex: 100,
                    background: '#1a1a26',
                    border: '1px solid #2e2e40',
                    borderRadius: 4,
                    padding: 4,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 4,
                    width: 80,
                  }}
                >
                  {[
                    { name: 'Y', color: '#fde68a' },
                    { name: 'B', color: '#bfdbfe' },
                    { name: 'G', color: '#bbf7d0' },
                    { name: 'P', color: '#fbcfe8' },
                    { name: 'V', color: '#e9d5ff' },
                    { name: 'X', color: 'transparent' },
                  ].map(hl => (
                    <button
                      key={hl.color}
                      onClick={() => {
                        onSetSetting('highlightColor', hl.color)
                        setShowHighlightDropdown(false)
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        background: hl.color,
                        border: '1px solid #2e2e40',
                        cursor: 'pointer',
                        fontSize: 9,
                        color: '#111',
                      }}
                    >
                      {hl.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. INSERT SECTION */}
        <div>
          <div style={labelSectionStyle}>Insert Image</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['left', 'right', 'none'] as PlacedImage['float'][]).map(f => (
                <button
                  key={f}
                  onClick={() => setNextImageFloat(f)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    fontSize: 11,
                    borderRadius: 4,
                    border: '1px solid',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.15s',
                    borderColor: nextImageFloat === f ? '#c9a96e' : '#2e2e40',
                    background: nextImageFloat === f ? 'rgba(201,169,110,0.12)' : 'transparent',
                    color: nextImageFloat === f ? '#c9a96e' : '#6b6880',
                  }}
                >
                  {f === 'left' ? 'Float Left' : f === 'right' ? 'Float Right' : 'No Float'}
                </button>
              ))}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '8px 12px',
                background: 'rgba(201,169,110,0.08)',
                border: '1px solid rgba(201,169,110,0.25)',
                borderRadius: 6,
                color: '#c9a96e',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              Upload Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* 6. IMAGE THUMBNAIL STRIP */}
        {state.images.length > 0 && (
          <div>
            <div style={labelSectionStyle}>Placed Images</div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                paddingBottom: 8,
              }}
            >
              {state.images.map(img => (
                <div
                  key={img.id}
                  style={{
                    flexShrink: 0,
                    width: 140,
                    background: '#1e1e28',
                    border: '1px solid #2e2e40',
                    borderRadius: 6,
                    padding: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {/* Thumbnail 72x72 */}
                  <div
                    onClick={() => scrollToAsset(img.pageIndex)}
                    style={{
                      width: 72,
                      height: 72,
                      alignSelf: 'center',
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: '#111',
                      border: '1px solid #2e2e40',
                      cursor: 'pointer',
                    }}
                  >
                    <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Label Input */}
                  <input
                    type="text"
                    value={img.label || ''}
                    placeholder="Image label..."
                    onChange={e => onUpdateImage(img.id, { label: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #2e2e40',
                      color: '#d4d0e8',
                      fontSize: 11,
                      outline: 'none',
                      padding: '2px 0',
                    }}
                  />

                  {/* Float Buttons */}
                  <div style={{ display: 'flex', gap: 2 }}>
                    {(['left', 'right', 'none'] as PlacedImage['float'][]).map(f => (
                      <button
                        key={f}
                        onClick={() => onUpdateImage(img.id, { float: f })}
                        style={{
                          flex: 1,
                          fontSize: 9,
                          padding: '2px 0',
                          background: img.float === f ? '#c9a96e' : 'transparent',
                          color: img.float === f ? '#15151d' : '#6b6880',
                          border: '1px solid #2e2e40',
                          borderRadius: 3,
                          cursor: 'pointer',
                        }}
                      >
                        {f === 'left' ? 'L' : f === 'right' ? 'R' : 'None'}
                      </button>
                    ))}
                  </div>

                  {/* Opacity slider */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#6b6880' }}>
                      <span>Opacity</span>
                      <span>{Math.round(img.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={img.opacity * 100}
                      onChange={e => onUpdateImage(img.id, { opacity: parseInt(e.target.value) / 100 })}
                      style={{ width: '100%', height: 3, accentColor: '#c9a96e', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveImage(img.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #e05c5c',
                      borderRadius: 3,
                      color: '#e05c5c',
                      fontSize: 10,
                      padding: '3px 0',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. SHAPES SECTION */}
        <div>
          <div style={labelSectionStyle}>Shapes & Drawing</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[
                { id: 'rect', label: '□ Rect' },
                { id: 'circle', label: '○ Circle' },
                { id: 'line', label: '╱ Line' },
                { id: 'arrow', label: '→ Arrow' },
                { id: 'freehand', label: '✏ Freehand' },
              ].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setShapeMode(shapeMode === tool.id ? null : tool.id)}
                  style={{
                    flex: 1,
                    minWidth: 60,
                    padding: '6px 0',
                    fontSize: 11,
                    borderRadius: 4,
                    border: '1px solid',
                    cursor: 'pointer',
                    borderColor: shapeMode === tool.id ? '#c9a96e' : '#2e2e40',
                    background: shapeMode === tool.id ? 'rgba(201,169,110,0.12)' : 'transparent',
                    color: shapeMode === tool.id ? '#c9a96e' : '#6b6880',
                    fontWeight: 500,
                  }}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 8. ANNOTATIONS */}
        <div>
          <div style={labelSectionStyle}>Notes & Comments</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={onAddAnnotationAtDefault}
              style={{
                padding: '8px 12px',
                background: 'rgba(201,169,110,0.08)',
                border: '1px solid rgba(201,169,110,0.25)',
                borderRadius: 6,
                color: '#c9a96e',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              + Add Note to Page
            </button>

            {annotations.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 120, overflowY: 'auto' }}>
                {annotations.map(ann => (
                  <div
                    key={ann.id}
                    onClick={() => scrollToAsset(ann.pageIndex)}
                    style={{
                      background: '#1a1a24',
                      border: '1px solid #2e2e40',
                      borderRadius: 4,
                      padding: 6,
                      fontSize: 11,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#d4d0e8',
                    }}
                  >
                    <span>Page {ann.pageIndex + 1}: {ann.text ? (ann.text.length > 20 ? ann.text.slice(0, 20) + '...' : ann.text) : '(Empty Note)'}</span>
                    <span style={{ color: '#6b6880' }}>Jump</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 9. SETTINGS SECTION */}
        <div>
          <div style={labelSectionStyle}>Settings</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: '#6b6880', display: 'block', marginBottom: 4 }}>Paperback Preset</label>
              <select
                value={state.paperbackPreset}
                onChange={e => onSetSetting('paperbackPreset', e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: '#111118',
                  border: '1px solid #2e2e40',
                  borderRadius: 4,
                  color: '#d4d0e8',
                  fontSize: 12,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {PRESETS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, color: '#6b6880', display: 'block', marginBottom: 4 }}>Locale</label>
              <select
                value={state.rawText ? 'default' : 'default'} // proxy/no-op, but let's bind it correctly
                onChange={_e => {
                  invalidateCache()
                  onChangeText(state.rawText) // trigger refresh
                }}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: '#111118',
                  border: '1px solid #2e2e40',
                  borderRadius: 4,
                  color: '#d4d0e8',
                  fontSize: 12,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {LOCALES.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Clear Measurement Cache */}
            <button
              onClick={() => {
                invalidateCache()
                onChangeText(state.rawText) // trigger refresh
              }}
              style={{
                padding: '6px 10px',
                background: 'transparent',
                border: '1px solid #2e2e40',
                borderRadius: 4,
                color: '#6b6880',
                fontSize: 11,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s',
              }}
              title="Clear text metrics cache"
            >
              ↺ Clear Measurement Cache
            </button>

            {/* Future alignment toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, color: '#6b6880' }}>Alignment (coming soon)</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {['Left', 'Center', 'Justified'].map(al => (
                  <button
                    key={al}
                    disabled
                    style={{
                      flex: 1,
                      padding: '4px 0',
                      fontSize: 11,
                      border: '1px solid #2e2e40',
                      background: 'transparent',
                      color: '#4e4e5e',
                      borderRadius: 4,
                      cursor: 'not-allowed',
                    }}
                  >
                    {al}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
