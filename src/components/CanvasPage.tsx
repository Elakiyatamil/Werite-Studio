// src/components/CanvasPage.tsx
import React, { useRef, useEffect } from 'react';
import type { LayoutLine } from '../engine/layoutEngine';
import type { PlacedImage } from '../types';
import { drawIconByName } from '../engine/iconDrawers';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../engine/layoutEngine';

interface CanvasPageProps {
  pageIndex: number;
  lines: LayoutLine[];
  images: PlacedImage[];
  text: string;
  onChangeText: (text: string) => void;
  onUpdateImage: (id: string, changes: Partial<PlacedImage>) => void;
  activeColor: string;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const CanvasPage = React.forwardRef<HTMLDivElement, CanvasPageProps>(({
  pageIndex,
  lines,
  images,
  text,
  onChangeText,
  onUpdateImage,
  activeColor,
  onContextMenu,
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaScroll = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0;
    }
  };

  const handleImageMouseDown = (
    e: React.MouseEvent,
    imgId: string,
    action: 'drag' | 'resize'
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const targetImage = images.find((img) => img.id === imgId);
    if (!targetImage) return;

    const startImgX = targetImage.x;
    const startImgY = targetImage.y;
    const startWidth = targetImage.width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (action === 'drag') {
        const newX = Math.max(0, Math.min(PAGE_WIDTH - targetImage.width, startImgX + dx));
        const newY = Math.max(0, Math.min(PAGE_HEIGHT - (targetImage.height || 100), startImgY + dy));
        onUpdateImage(imgId, { x: newX, y: newY });
      } else if (action === 'resize') {
        const newWidth = Math.max(60, Math.min(260, startWidth + dx));
        const newHeight = targetImage.isBuiltIn ? newWidth : Math.round(newWidth * 0.75);
        onUpdateImage(imgId, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={ref}
      className="page-canvas-container"
      onContextMenu={onContextMenu}
      data-page-index={pageIndex}
    >
      <div className="page-number-indicator">Page {pageIndex + 1}</div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => onChangeText(e.target.value)}
        onScroll={handleTextareaScroll}
        className="page-editor-textarea"
        style={{ caretColor: activeColor }}
        placeholder="Type your manuscript here... Use '## ' for Chapter and blank lines for paragraphs."
      />

      <div className="rendered-text-layer">
        {lines.map((line, idx) => {
          const isChapterHeading = line.text === line.text.toUpperCase() && line.text.length > 5 && line.font.includes('bold');
          const isSceneBreak = line.text === '* * *';

          return (
            <span
              key={idx}
              className={`text-line ${isChapterHeading ? 'chapter-header' : ''} ${isSceneBreak ? 'scene-break' : ''}`}
              style={{
                position: 'absolute',
                left: isSceneBreak || isChapterHeading ? '50%' : `${line.x}px`,
                transform: isSceneBreak || isChapterHeading ? 'translateX(-50%)' : 'none',
                top: `${line.y}px`,
                font: line.font,
                color: isChapterHeading ? 'var(--page-heading)' : activeColor,
                whiteSpace: 'nowrap',
              }}
            >
              {line.text}
            </span>
          );
        })}
      </div>

      <div className="images-layer">
        {images.map((img) => (
          <div
            key={img.id}
            className="placed-image-wrapper"
            style={{
              position: 'absolute',
              left: `${img.x}px`,
              top: `${img.y}px`,
              width: `${img.width}px`,
              height: `${img.height || img.width}px`,
            }}
          >
            {img.isBuiltIn && img.iconName ? (
              <IconCanvas iconName={img.iconName} width={img.width} height={img.width} />
            ) : (
              <img
                src={img.src}
                alt="Placed asset"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            <div
              className="drag-indicator"
              onMouseDown={(e) => handleImageMouseDown(e, img.id, 'drag')}
              title="Drag image"
            />
            <div
              className="resize-handle"
              onMouseDown={(e) => handleImageMouseDown(e, img.id, 'resize')}
              title="Resize image"
            />
          </div>
        ))}
      </div>
    </div>
  );
});

const IconCanvas: React.FC<{ iconName: string; width: number; height: number }> = ({
  iconName,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    drawIconByName(ctx, iconName as any, 0, 0, width);
  }, [iconName, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height}px`, pointerEvents: 'none' }}
    />
  );
};

CanvasPage.displayName = 'CanvasPage';
