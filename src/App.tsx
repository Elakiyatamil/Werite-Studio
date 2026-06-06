// src/App.tsx
import React, { useState, useRef } from 'react'
import { useDocumentState } from './hooks/useDocumentState'
import { TopBar } from './components/TopBar'
import { LeftRail } from './components/LeftRail'
import { RightRail } from './components/RightRail'
import { EditorPanel } from './components/EditorPanel'
import { PageCanvas } from './components/PageCanvas'
import { exportToPDF } from './engine/pdfExport'

function App() {
  const {
    state,
    pages,
    preset,
    setText,
    addImage,
    moveImage,
    resizeImage,
    updateImage,
    removeImage,
    addShape,
    addAnnotation,
    updateAnnotation,
    setSetting,
  } = useDocumentState()

  const [editorWidth, setEditorWidth] = useState(260)
  const [shapeMode, setShapeMode] = useState<string | null>(null)

  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const onMouseMove = (me: MouseEvent) => {
      const newWidth = Math.max(200, Math.min(480, me.clientX - 48))
      setEditorWidth(newWidth)
    }
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleExportPDF = async () => {
    const validPageElements = pageRefs.current.filter((el): el is HTMLDivElement => el !== null)
    if (validPageElements.length === 0) return
    await exportToPDF(validPageElements, preset)
  }

  const handlePageDoubleClick = (e: React.MouseEvent, pageIndex: number) => {
    if (shapeMode) return // don't add note if we are in shape drawing mode
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    addAnnotation(pageIndex, x, y)
  }

  const handleAddAnnotationAtDefault = () => {
    const pageIndex = pages.length > 0 ? pages.length - 1 : 0
    const x = preset.w / 2 - 80
    const y = preset.h / 2 - 50
    addAnnotation(pageIndex, x, y)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '48px 1fr',
        gridTemplateColumns: `48px ${editorWidth}px 4px 1fr 48px`,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#0f0f14',
      }}
    >
      {/* Top Bar */}
      <div style={{ gridColumn: '1 / -1', gridRow: 1, zIndex: 10 }}>
        <TopBar onExportPDF={handleExportPDF} />
      </div>

      {/* Left Rail */}
      <div style={{ gridColumn: 1, gridRow: 2, zIndex: 5 }}>
        <LeftRail onExportPDF={handleExportPDF} />
      </div>

      {/* Editor Panel */}
      <div style={{ gridColumn: 2, gridRow: 2, overflow: 'hidden' }}>
        <EditorPanel
          state={state}
          onChangeText={setText}
          onUploadImage={(src, float) => {
            // Default y coordinate to place at the end of the text/current position
            // We can place it at a standard offset like preset.mt + 100
            addImage(src, float, preset.mt + 100, 0)
          }}
          onUpdateImage={updateImage}
          onRemoveImage={removeImage}
          shapeMode={shapeMode}
          setShapeMode={setShapeMode}
          onSetSetting={setSetting}
          annotations={state.annotations}
          onAddAnnotationAtDefault={handleAddAnnotationAtDefault}
        />
      </div>

      {/* Resizable handle */}
      <div
        onMouseDown={handleResizeMouseDown}
        style={{
          gridColumn: 3,
          gridRow: 2,
          background: '#2a2a3a',
          cursor: 'col-resize',
          zIndex: 6,
        }}
      />

      {/* Page Canvas Scroll Area */}
      <div
        style={{
          gridColumn: 4,
          gridRow: 2,
          background: '#0f0f14',
          overflowY: 'scroll',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Render stacked pages */}
        {pages.map((page, idx) => (
          <PageCanvas
            key={page.pageIndex}
            ref={(el) => {
              pageRefs.current[idx] = el
            }}
            layout={page}
            preset={preset}
            onImageMove={moveImage}
            onImageResize={resizeImage}
            onAnnotationUpdate={updateAnnotation}
            onDoubleClick={(e) => handlePageDoubleClick(e, page.pageIndex)}
            shapeMode={shapeMode}
            onShapeDrawn={addShape}
            onSetSetting={setSetting}
          />
        ))}

        {/* Footer actions inside canvas scroll area */}
        <div style={{ display: 'flex', gap: 16, marginTop: 16, marginBottom: 48 }}>
          <button
            onClick={handleAddAnnotationAtDefault}
            style={{
              padding: '10px 20px',
              background: 'rgba(201,169,110,0.12)',
              border: '1px solid #c9a96e',
              borderRadius: 6,
              color: '#c9a96e',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            + Add Page Note
          </button>
          <button
            onClick={handleExportPDF}
            style={{
              padding: '10px 20px',
              background: '#c9a96e',
              border: 'none',
              borderRadius: 6,
              color: '#141418',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Right Rail */}
      <div style={{ gridColumn: 5, gridRow: 2, zIndex: 5 }}>
        <RightRail />
      </div>
    </div>
  )
}

export default App
