// src/components/ColorPalettePanel.tsx
import React from 'react';

interface ColorPalettePanelProps {
  isOpen: boolean;
  activeColor: string;
  onChangeColor: (color: string) => void;
}

const SWATCHES_3X2 = [
  { name: 'Warm Gray', color: '#5a5a66' },
  { name: 'Forest Green', color: '#1b4d3e' },
  { name: 'Rust Orange', color: '#b25329' },
  { name: 'Dark Red', color: '#8b1e1e' },
  { name: 'Olive', color: '#606c38' },
  { name: 'Brown', color: '#5c4033' },
];

const ACCENT_SWATCHES = [
  { name: 'Gold', color: '#c9a96e' },
  { name: 'Dusk Violet', color: '#8e7cc3' },
  { name: 'Ink Black', color: '#1a1714' },
];

export const ColorPalettePanel: React.FC<ColorPalettePanelProps> = ({
  isOpen,
  activeColor,
  onChangeColor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="color-palette-panel">
      <div className="color-header">
        <span>Color</span>
      </div>
      <div className="color-grid">
        {SWATCHES_3X2.map((sw, i) => (
          <div
            key={i}
            className={`color-swatch ${activeColor === sw.color ? 'active' : ''}`}
            style={{ backgroundColor: sw.color }}
            title={sw.name}
            onClick={() => onChangeColor(sw.color)}
          />
        ))}
      </div>
      <div className="color-header-small">
        <span>Accents</span>
      </div>
      <div className="color-grid-accents">
        {ACCENT_SWATCHES.map((sw, i) => (
          <div
            key={i}
            className={`color-swatch-small ${activeColor === sw.color ? 'active' : ''}`}
            style={{ backgroundColor: sw.color }}
            title={sw.name}
            onClick={() => onChangeColor(sw.color)}
          />
        ))}
      </div>
    </div>
  );
};
