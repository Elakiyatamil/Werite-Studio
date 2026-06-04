// src/components/RightRail.tsx
import React from 'react';

interface RightRailProps {
  isColorOpen: boolean;
  onToggleColor: () => void;
}

export const RightRail: React.FC<RightRailProps> = ({
  isColorOpen,
  onToggleColor,
}) => {
  return (
    <div className="right-rail">
      <button 
        className={`rail-icon-btn ${isColorOpen ? 'active' : ''}`} 
        title="Toggle Color Palette"
        onClick={onToggleColor}
      >
        <i className="ti ti-palette"></i>
      </button>
      <button className="rail-icon-btn" title="Typography controls">
        <i className="ti ti-typography"></i>
      </button>
      <button className="rail-icon-btn" title="Document properties">
        <i className="ti ti-adjustments-horizontal"></i>
      </button>
      <button className="rail-icon-btn" title="View options">
        <i className="ti ti-eye"></i>
      </button>
      <div className="rail-separator"></div>
      <button className="rail-icon-btn" title="Help docs">
        <i className="ti ti-help"></i>
      </button>
    </div>
  );
};
