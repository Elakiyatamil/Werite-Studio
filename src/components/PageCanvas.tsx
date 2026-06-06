// src/components/PageCanvas.tsx
import React, { useState } from 'react'
import { DraggableImage } from './DraggableImage'
import type { PageLayout, PlacedShape, PageAnnotation } from '../types'

interface Props {
  layout: PageLayout
  preset: { w: number; h: number }
  onImageMove: (id: string, x: number, y: number) => void
  onImageResize: (id: string, w: number, h: number) => void
  onAnnotationUpdate: (id: string, patch: Partial<PageAnnotation>) => void
  onDoubleClick: (e: React.MouseEvent) => void
  shapeMode: string | null
  onShapeDrawn: (shape: Omit<PlacedShape, 'id'>) => void
  activeColor: string
}

export const PageCanvas = React.forwardRef<HTMLDivElement, Props>(
  ({ layout, preset, onImageMove, onImageResize, onAnnotationUpdate, onDoubleClick, shapeMode, onShapeDrawn, activeColor }, ref) => {
    const [drawing, setDrawing] = useState(false)
    const [startPt, setStartPt] = useState({ x: 0, y: 0 })
    const [currentPt, setCurrentPt] = useState({ x: 0, y: 0 })
    const [freehandPts, setFreehandPts] = useState<{ x: number; y: number }[]>([])

    const getPageCoords = (e: React.MouseEvent) => {
      const pageEl = (ref as React.RefObject<HTMLDivElement>).current
      if (!pageEl) return { x: 0, y: 0 }
      const rect = pageEl.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!shapeMode) return
      e.preventDefault()
      const pt = getPageCoords(e)
      setDrawing(true)
      setStartPt(pt)
      setCurrentPt(pt)
      setFreehandPts([pt])
    }

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!drawing || !shapeMode) return
      const pt = getPageCoords(e)
      setCurrentPt(pt)
      if (shapeMode === 'freehand') {
        setFreehandPts(prev => [...prev, pt])
      }
    }

    const handleMouseUp = () => {
      if (!drawing || !shapeMode) return
      setDrawing(false)

      const x = Math.min(startPt.x, currentPt.x)
      const y = Math.min(startPt.y, currentPt.y)
      const width = Math.abs(startPt.x - currentPt.x)
      const height = Math.abs(startPt.y - currentPt.y)

      // Commit shape
      onShapeDrawn({
        type: shapeMode as any,
        x: shapeMode === 'line' || shapeMode === 'arrow' ? startPt.x : x,
        y: shapeMode === 'line' || shapeMode === 'arrow' ? startPt.y : y,
        width: shapeMode === 'line' || shapeMode === 'arrow' ? (currentPt.x - startPt.x) : width,
        height: shapeMode === 'line' || shapeMode === 'arrow' ? (currentPt.y - startPt.y) : height,
        strokeColor: activeColor,
        fillColor: 'transparent',
        strokeWidth: 2,
        pageIndex: layout.pageIndex,
        points: shapeMode === 'freehand' ? freehandPts : undefined,
      })

      setFreehandPts([])
    }

    return (
      <div
        ref={ref}
        onDoubleClick={onDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: 'relative',
          width: preset.w,
          minHeight: preset.h,
          background: '#f5f0e8',
          boxShadow: '0 8px 48px rgba(0,0,0,0.55)',
          border: '1px solid #c8bfaa',
          overflow: 'hidden',
          flexShrink: 0,
          userSelect: shapeMode ? 'none' : 'text',
          cursor: shapeMode ? 'crosshair' : 'default',
        }}
        data-page-index={layout.pageIndex}
      >
        {/* Page lines */}
        {layout.lines.map((line, i) => {
          if (line.isDropCap) {
            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: line.x,
                  top: line.y,
                  font: line.font,
                  color: '#1a1714',
                  lineHeight: 1,
                  userSelect: 'text',
                  zIndex: 1,
                }}
              >
                {line.text}
              </span>
            )
          }

          if (line.fragments && line.fragments.length > 0) {
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: line.x,
                  top: line.y,
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  userSelect: 'text',
                  display: 'flex',
                  alignItems: 'baseline',
                }}
              >
                {line.fragments.map((frag, fi) => (
                  <span
                    key={fi}
                    style={{
                      font: frag.font,
                      color: '#1a1714',
                      whiteSpace: 'pre',
                    }}
                  >
                    {frag.text}
                  </span>
                ))}
              </div>
            )
          }

          return (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: line.x,
                top: line.y,
                font: line.font,
                color: '#1a1714',
                whiteSpace: 'nowrap',
                lineHeight: 1,
                userSelect: 'text',
              }}
            >
              {line.text}
            </span>
          )
        })}

        {/* SVG shape overlay */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: shapeMode ? 'all' : 'none',
            zIndex: 3,
          }}
        >
          {layout.shapes.map(sh => (
            <ShapeEl key={sh.id} shape={sh} />
          ))}
          {/* Preview shape while drawing */}
          {drawing && shapeMode && (
            <PreviewShape
              mode={shapeMode}
              start={startPt}
              current={currentPt}
              pts={freehandPts}
              color={activeColor}
            />
          )}
        </svg>

        {/* Images */}
        {layout.images.map(img => (
          <DraggableImage
            key={img.id}
            image={img}
            onMove={onImageMove}
            onResize={onImageResize}
          />
        ))}

        {/* Annotations */}
        {layout.annotations.map(ann => (
          <StickyNote
            key={ann.id}
            ann={ann}
            onUpdate={onAnnotationUpdate}
          />
        ))}

        {/* Page Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '11px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            color: 'rgba(26,23,20,0.4)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {layout.pageIndex + 1}
        </div>
      </div>
    )
  }
)

PageCanvas.displayName = 'PageCanvas'

// ── Shape Elements Rendering ─────────────────────────────────────
const ShapeEl: React.FC<{ shape: PlacedShape }> = ({ shape }) => {
  const { type, x, y, width, height, strokeColor, fillColor, strokeWidth } = shape

  if (type === 'rect') {
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={strokeColor}
        fill={fillColor}
        strokeWidth={strokeWidth}
      />
    )
  }
  if (type === 'circle') {
    return (
      <ellipse
        cx={x + width / 2}
        cy={y + height / 2}
        rx={width / 2}
        ry={height / 2}
        stroke={strokeColor}
        fill={fillColor}
        strokeWidth={strokeWidth}
      />
    )
  }
  if (type === 'line') {
    return (
      <line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y + height}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    )
  }
  if (type === 'arrow') {
    const endX = x + width
    const endY = y + height
    const angle = Math.atan2(endY - y, endX - x)
    const headLength = 10
    const x1 = endX - headLength * Math.cos(angle - Math.PI / 6)
    const y1 = endY - headLength * Math.sin(angle - Math.PI / 6)
    const x2 = endX - headLength * Math.cos(angle + Math.PI / 6)
    const y2 = endY - headLength * Math.sin(angle + Math.PI / 6)

    return (
      <g>
        <line
          x1={x}
          y1={y}
          x2={endX}
          y2={endY}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <polygon
          points={`${endX},${endY} ${x1},${y1} ${x2},${y2}`}
          fill={strokeColor}
        />
      </g>
    )
  }
  if (type === 'freehand' && shape.points) {
    const pathData = shape.points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ')
    return (
      <path
        d={pathData}
        stroke={strokeColor}
        fill="none"
        strokeWidth={strokeWidth}
      />
    )
  }
  return null
}

// ── Preview Drawing Rendering ─────────────────────────────────────
const PreviewShape: React.FC<{
  mode: string
  start: { x: number; y: number }
  current: { x: number; y: number }
  pts: { x: number; y: number }[]
  color: string
}> = ({ mode, start, current, pts, color }) => {
  const x = Math.min(start.x, current.x)
  const y = Math.min(start.y, current.y)
  const w = Math.abs(start.x - current.x)
  const h = Math.abs(start.y - current.y)

  if (mode === 'rect') {
    return <rect x={x} y={y} width={w} height={h} stroke={color} fill="none" strokeWidth={2} />
  }
  if (mode === 'circle') {
    return <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} stroke={color} fill="none" strokeWidth={2} />
  }
  if (mode === 'line') {
    return <line x1={start.x} y1={start.y} x2={current.x} y2={current.y} stroke={color} strokeWidth={2} />
  }
  if (mode === 'arrow') {
    const angle = Math.atan2(current.y - start.y, current.x - start.x)
    const headLength = 10
    const x1 = current.x - headLength * Math.cos(angle - Math.PI / 6)
    const y1 = current.y - headLength * Math.sin(angle - Math.PI / 6)
    const x2 = current.x - headLength * Math.cos(angle + Math.PI / 6)
    const y2 = current.y - headLength * Math.sin(angle + Math.PI / 6)

    return (
      <g>
        <line x1={start.x} y1={start.y} x2={current.x} y2={current.y} stroke={color} strokeWidth={2} />
        <polygon points={`${current.x},${current.y} ${x1},${y1} ${x2},${y2}`} fill={color} />
      </g>
    )
  }
  if (mode === 'freehand') {
    const pathData = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    return <path d={pathData} stroke={color} fill="none" strokeWidth={2} />
  }
  return null
}

// ── Sticky Note Annotations ──────────────────────────────────────
const StickyNote: React.FC<{
  ann: PageAnnotation
  onUpdate: (id: string, patch: Partial<PageAnnotation>) => void
}> = ({ ann, onUpdate }) => {
  const handleDragMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const initX = ann.x
    const initY = ann.y

    const onMouseMove = (me: MouseEvent) => {
      const dx = me.clientX - startX
      const dy = me.clientY - startY
      onUpdate(ann.id, { x: initX + dx, y: initY + dy })
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  if (!ann.isOpen) {
    return (
      <div
        onMouseDown={handleDragMouseDown}
        onClick={(e) => {
          e.stopPropagation()
          onUpdate(ann.id, { isOpen: true })
        }}
        style={{
          position: 'absolute',
          left: ann.x,
          top: ann.y,
          cursor: 'grab',
          fontSize: 20,
          zIndex: 10,
          userSelect: 'none',
        }}
        title="Click to open note"
      >
        📌
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: ann.x,
        top: ann.y,
        width: 160,
        background: ann.color || '#fef9c3',
        border: '1px solid #fef08a',
        borderRadius: 4,
        padding: '6px 8px 8px 8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {/* Note Header (for dragging and closing) */}
      <div
        onMouseDown={handleDragMouseDown}
        style={{
          height: 16,
          cursor: 'grab',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px dashed rgba(0,0,0,0.1)',
          paddingBottom: 4,
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 9, color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>NOTE</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onUpdate(ann.id, { isOpen: false })
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(0,0,0,0.5)',
            fontSize: 12,
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      <textarea
        value={ann.text}
        onChange={(e) => onUpdate(ann.id, { text: e.target.value })}
        placeholder="Write note..."
        style={{
          width: '100%',
          height: 80,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: 'sans-serif',
          fontSize: 12,
          color: '#1a1714',
          lineHeight: 1.3,
          padding: 0,
        }}
      />
    </div>
  )
}
