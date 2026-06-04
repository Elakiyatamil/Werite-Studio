// src/components/FloatingToolbar.tsx
import React, { useRef } from 'react';

interface FloatingToolbarProps {
  onInsertChapter: () => void;
  onInsertScene: () => void;
  onUploadImage: (src: string) => void;
  onInsertIcon: (name: 'dragon' | 'castle' | 'quill' | 'candle' | 'compass') => void;
  onExportPDF: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onInsertChapter,
  onInsertScene,
  onUploadImage,
  onInsertIcon,
  onExportPDF,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUploadImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    // Reset selection so the same image can be uploaded again
    e.target.value = '';
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="floating-toolbar">
      <button className="toolbar-pill" onClick={onInsertChapter} title="Insert Chapter Header">
        <i className="ti ti-heading"></i> Chapter
      </button>
      <button className="toolbar-pill" onClick={onInsertScene} title="Insert Scene Break">
        <i className="ti ti-separator"></i> Scene
      </button>
      <button className="toolbar-pill" onClick={triggerUpload} title="Upload Custom Image">
        <i className="ti ti-upload"></i> Upload Image
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <div className="toolbar-divider"></div>
      <button className="toolbar-pill" onClick={() => onInsertIcon('dragon')} title="Insert Dragon Icon">
        🐉 Dragon
      </button>
      <button className="toolbar-pill" onClick={() => onInsertIcon('castle')} title="Insert Castle Icon">
        🏰 Castle
      </button>
      <button className="toolbar-pill" onClick={() => onInsertIcon('quill')} title="Insert Quill Icon">
        🪶 Quill
      </button>
      <button className="toolbar-pill" onClick={() => onInsertIcon('candle')} title="Insert Candle Icon">
        🕯 Candle
      </button>
      <button className="toolbar-pill" onClick={() => onInsertIcon('compass')} title="Insert Compass Icon">
        🧭 Compass
      </button>
      <div className="toolbar-divider"></div>
      <button className="toolbar-pill accent" onClick={onExportPDF} title="Download A5 PDF">
        <i className="ti ti-file-export"></i> Export PDF
      </button>
    </div>
  );
};
