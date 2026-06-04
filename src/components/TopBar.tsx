// src/components/TopBar.tsx
import React from 'react';

interface TopBarProps {
  onExportPDF: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onExportPDF }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="breadcrumb-muted">Home</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-muted">Fantasy</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-active">Pretext Studio</span>
      </div>
      <div className="topbar-center">
        Pretext Studio
      </div>
      <div className="topbar-right">
        <button className="topbar-icon" title="Refer a Friend">
          <i className="ti ti-users"></i>
        </button>
        <button className="topbar-icon" title="Undo">
          <i className="ti ti-arrow-back"></i>
        </button>
        <button className="topbar-icon" title="Redo">
          <i className="ti ti-arrow-forward"></i>
        </button>
        <button className="topbar-icon" title="Desktop mode">
          <i className="ti ti-device-desktop"></i>
        </button>
        <button className="topbar-icon" title="Help">
          <i className="ti ti-help"></i>
        </button>
        <div className="topbar-search-container">
          <i className="ti ti-search search-icon"></i>
          <input className="topbar-search" type="text" placeholder="Search..." />
        </div>
        <button className="topbar-icon" title="Settings">
          <i className="ti ti-settings"></i>
        </button>
        <button className="topbar-icon" title="Export PDF" onClick={onExportPDF} style={{ color: 'var(--accent-gold)' }}>
          <i className="ti ti-download"></i>
        </button>
        <div className="avatar" title="User Profile">
          JO
        </div>
      </div>
    </header>
  );
};
