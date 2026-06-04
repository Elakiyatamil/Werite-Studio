// src/components/LeftRail.tsx
import React from 'react';

interface LeftRailProps {
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  onExportPDF: () => void;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  isDrawerOpen,
  onToggleDrawer,
  onExportPDF,
}) => {
  return (
    <div className="left-rail">
      <button 
        className={`rail-icon-btn ${isDrawerOpen ? 'active' : ''}`} 
        title="Toggle Character Notes Sidebar"
        onClick={onToggleDrawer}
      >
        <i className="ti ti-layout-sidebar"></i>
      </button>
      <button className="rail-icon-btn" title="Manuscript Settings">
        <i className="ti ti-file-text"></i>
      </button>
      <button className="rail-icon-btn" title="Image Manager">
        <i className="ti ti-photo"></i>
      </button>
      <button className="rail-icon-btn" title="Export PDF" onClick={onExportPDF}>
        <i className="ti ti-download"></i>
      </button>
      <div className="rail-separator"></div>
      <button className="rail-icon-btn" title="Style Brush">
        <i className="ti ti-pencil"></i>
      </button>
      <button className="rail-icon-btn" title="Clear Formatting">
        <i className="ti ti-eraser"></i>
      </button>
    </div>
  );
};
