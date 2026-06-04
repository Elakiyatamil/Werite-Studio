// src/App.tsx
import { useMemo, useRef } from 'react';
import { useDocumentState } from './hooks/useDocumentState';
import { useContextMenu } from './hooks/useContextMenu';
import { computeLayout } from './engine/layoutEngine';
import { TopBar } from './components/TopBar';
import { LeftRail } from './components/LeftRail';
import { RightRail } from './components/RightRail';
import { CharacterDrawer } from './components/CharacterDrawer';
import { ColorPalettePanel } from './components/ColorPalettePanel';
import { ContextMenu } from './components/ContextMenu';
import { FloatingToolbar } from './components/FloatingToolbar';
import { ImageThumbnailStrip } from './components/ImageThumbnailStrip';
import { CanvasPage } from './components/CanvasPage';
import { exportToPDF } from './engine/pdfExport';

function App() {
  const {
    text,
    setText,
    placedImages,
    addImage,
    addBuiltInIcon,
    updateImage,
    removeImage,
    activeColor,
    setActiveColor,
    characters,
    setCharacters,
    addCharacter,
    updateCharacter,
    removeCharacter,
    isLeftDrawerOpen,
    setIsLeftDrawerOpen,
    isColorPaletteOpen,
    setIsColorPaletteOpen,
  } = useDocumentState();

  const {
    isOpen: isContextMenuOpen,
    x: contextMenuX,
    y: contextMenuY,
    open: openContextMenu,
    close: closeContextMenu,
  } = useContextMenu();

  // Compute Layout lines from engine
  const layoutLines = useMemo(() => {
    return computeLayout(text, placedImages);
  }, [text, placedImages]);

  // Determine total pages to render.
  // We scan the layoutLines and find the maximum pageIndex.
  const totalPages = useMemo(() => {
    let maxIdx = 0;
    layoutLines.forEach((line) => {
      if (line.pageIndex > maxIdx) {
        maxIdx = line.pageIndex;
      }
    });
    // Ensure all images are accounted for. An image might be placed on a page
    // past the text flow.
    placedImages.forEach((img) => {
      if (img.pageIndex > maxIdx) {
        maxIdx = img.pageIndex;
      }
    });
    return maxIdx + 1;
  }, [layoutLines, placedImages]);

  // Store page HTML element references for PDF export
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleExportPDF = async () => {
    // Filter out null values
    const elements = pageRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (elements.length === 0) return;
    await exportToPDF(elements);
  };

  const insertChapter = () => {
    setText((prev) => `${prev.trim()}\n\n## CHAPTER 7: THE KEEPER'S SHADOW\n\n`);
  };

  const insertScene = () => {
    setText((prev) => `${prev.trim()}\n\n* * *\n\n`);
  };

  const handleUploadImage = (src: string) => {
    // Upload image to page index 0 or current last page
    const pageIndex = totalPages - 1;
    addImage(src, pageIndex);
  };

  const handleInsertIcon = (name: 'dragon' | 'castle' | 'quill' | 'candle' | 'compass') => {
    const pageIndex = totalPages - 1;
    // Calculate a default placement y offset depending on existing page height
    const pageLines = layoutLines.filter((l) => l.pageIndex === pageIndex);
    const lastLineY = pageLines.length > 0 ? pageLines[pageLines.length - 1].y : 100;
    const yOffset = Math.min(600, lastLineY + 30);
    addBuiltInIcon(name, pageIndex, yOffset);
  };

  return (
    <div className="app-grid">
      {/* 1. Top Bar */}
      <div className="topbar-area">
        <TopBar onExportPDF={handleExportPDF} />
      </div>

      {/* 2. Left Rail */}
      <div className="left-rail-area">
        <LeftRail
          isDrawerOpen={isLeftDrawerOpen}
          onToggleDrawer={() => setIsLeftDrawerOpen(!isLeftDrawerOpen)}
          onExportPDF={handleExportPDF}
        />
      </div>

      {/* 3. Left Sliding Drawer */}
      <CharacterDrawer
        isOpen={isLeftDrawerOpen}
        characters={characters}
        setCharacters={setCharacters}
        addCharacter={addCharacter}
        updateCharacter={updateCharacter}
        removeCharacter={removeCharacter}
      />

      {/* 4. Main Area (Floating panels + Canvas pages) */}
      <div className="main-content-area">
        <div className="canvas-scroller">
          {/* Floating Action Pill Toolbar */}
          <FloatingToolbar
            onInsertChapter={insertChapter}
            onInsertScene={insertScene}
            onUploadImage={handleUploadImage}
            onInsertIcon={handleInsertIcon}
            onExportPDF={handleExportPDF}
          />

          {/* Placed image thumbnail modification panel */}
          <ImageThumbnailStrip
            images={placedImages}
            onUpdateImage={(id, changes) => updateImage(id, changes)}
            onRemoveImage={removeImage}
          />

          {/* Render individual page elements */}
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageLines = layoutLines.filter((line) => line.pageIndex === idx);
            const pageImages = placedImages.filter((img) => img.pageIndex === idx);

            return (
              <CanvasPage
                key={idx}
                ref={(el: HTMLDivElement | null) => {
                  pageRefs.current[idx] = el;
                }}
                pageIndex={idx}
                lines={pageLines}
                images={pageImages}
                text={text}
                onChangeText={setText}
                onUpdateImage={updateImage}
                activeColor={activeColor}
                onContextMenu={openContextMenu}
              />
            );
          })}
        </div>
      </div>

      {/* 5. Right Rail */}
      <div className="right-rail-area">
        <RightRail
          isColorOpen={isColorPaletteOpen}
          onToggleColor={() => setIsColorPaletteOpen(!isColorPaletteOpen)}
        />
      </div>

      {/* 6. Floating Color Panel */}
      <ColorPalettePanel
        isOpen={isColorPaletteOpen}
        activeColor={activeColor}
        onChangeColor={setActiveColor}
      />

      {/* 7. Right-Click Context Menu */}
      <ContextMenu
        isOpen={isContextMenuOpen}
        x={contextMenuX}
        y={contextMenuY}
        onClose={closeContextMenu}
        onInsertIcon={handleInsertIcon}
      />
    </div>
  );
}

export default App;
