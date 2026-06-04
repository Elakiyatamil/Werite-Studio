import React from 'react';
import type { PlacedImage } from '../types';

interface ImageThumbnailStripProps {
  images: PlacedImage[];
  onUpdateImage: (id: string, changes: Partial<PlacedImage>) => void;
  onRemoveImage: (id: string) => void;
}

export const ImageThumbnailStrip: React.FC<ImageThumbnailStripProps> = ({
  images,
  onUpdateImage,
  onRemoveImage,
}) => {
  if (images.length === 0) return null;

  return (
    <div className="image-thumbnail-strip">
      <div className="strip-title">Placed Assets:</div>
      <div className="strip-items">
        {images.map((img) => (
          <div key={img.id} className="thumbnail-control-card">
            {/* Asset Visual Preview */}
            <div className="thumbnail-preview">
              {img.isBuiltIn ? (
                <div className="built-in-preview-icon" title={img.iconName}>
                  <i className={`ti ti-${getIconClassName(img.iconName)}`}></i>
                </div>
              ) : (
                <img src={img.src} alt="Placed preview" />
              )}
            </div>

            {/* Controls */}
            <div className="thumbnail-details">
              <div className="details-header">
                <span className="asset-label">{img.isBuiltIn ? img.iconName : 'Custom Image'}</span>
                <button
                  className="remove-asset-btn"
                  onClick={() => onRemoveImage(img.id)}
                  title="Remove asset"
                >
                  <i className="ti ti-x"></i>
                </button>
              </div>

              {/* Float Selector */}
              <div className="float-selector">
                <button
                  className={`float-btn ${img.float === 'left' ? 'active' : ''}`}
                  onClick={() => onUpdateImage(img.id, { float: 'left' })}
                  title="Float Left"
                >
                  L
                </button>
                <button
                  className={`float-btn ${img.float === 'none' ? 'active' : ''}`}
                  onClick={() => onUpdateImage(img.id, { float: 'none' })}
                  title="Float None (Overlaps/No wrap)"
                >
                  N
                </button>
                <button
                  className={`float-btn ${img.float === 'right' ? 'active' : ''}`}
                  onClick={() => onUpdateImage(img.id, { float: 'right' })}
                  title="Float Right"
                >
                  R
                </button>
              </div>

              {/* Width Slider */}
              <div className="width-slider-container">
                <i className="ti ti-resize width-icon"></i>
                <input
                  type="range"
                  min="60"
                  max="260"
                  value={img.width}
                  onChange={(e) => onUpdateImage(img.id, { width: parseInt(e.target.value) })}
                  className="width-slider"
                />
                <span className="width-val">{img.width}px</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getIconClassName(name?: string): string {
  if (name === 'compass') return 'compass';
  if (name === 'candle') return 'flame';
  if (name === 'quill') return 'writing-sign';
  if (name === 'castle') return 'castle';
  if (name === 'dragon') return 'spiral';
  return 'photo';
}
