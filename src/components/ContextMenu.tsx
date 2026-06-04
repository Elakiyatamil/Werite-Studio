// src/components/ContextMenu.tsx
import React from 'react';

interface ContextMenuItem {
  icon: string;
  label: string;
  shortcut?: string;
  action: () => void;
  separator?: boolean;
}

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onInsertIcon: (name: 'dragon' | 'castle' | 'quill' | 'candle' | 'compass') => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  x,
  y,
  onClose,
  onInsertIcon,
}) => {
  if (!isOpen) return null;

  const items: ContextMenuItem[] = [
    { icon: 'ti-rotate-clockwise', label: 'Undo', shortcut: 'Ctrl+Z', action: () => {} },
    { icon: 'ti-rotate-counter-clockwise', label: 'Redo', shortcut: 'Ctrl+Y', action: () => {}, separator: true },
    { icon: 'ti-device-desktop', label: 'Devices', action: () => {} },
    { icon: 'ti-plus', label: 'Insert Dragon', action: () => onInsertIcon('dragon') },
    { icon: 'ti-plus', label: 'Insert Castle', action: () => onInsertIcon('castle') },
    { icon: 'ti-plus', label: 'Insert Quill', action: () => onInsertIcon('quill'), separator: true },
    { icon: 'ti-copy', label: 'Copy', shortcut: 'Ctrl+C', action: () => {} },
    { icon: 'ti-clipboard', label: 'Paste', shortcut: 'Ctrl+V', action: () => {}, separator: true },
    { icon: 'ti-adjustments', label: 'Properties...', action: () => {} },
  ];

  return (
    <div
      className="context-menu"
      style={{ top: `${y}px`, left: `${x}px` }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <div className="context-menu-item" onClick={item.action}>
            <div className="item-left">
              <i className={`ti ${item.icon}`}></i>
              <span className="item-label">{item.label}</span>
            </div>
            {item.shortcut && <span className="item-shortcut">{item.shortcut}</span>}
          </div>
          {item.separator && <div className="context-menu-separator" />}
        </React.Fragment>
      ))}
    </div>
  );
};
