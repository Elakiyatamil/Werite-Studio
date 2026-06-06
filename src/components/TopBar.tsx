// src/components/TopBar.tsx
import React from 'react'

interface Props {
  onExportPDF: () => void
}

export const TopBar: React.FC<Props> = ({ onExportPDF }) => {
  return (
    <div
      style={{
        height: 48,
        background: '#141418',
        borderBottom: '1px solid #2a2a3a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 20,
      }}
    >
      {/* Left Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b6880' }}>
        <span>Home</span>
        <span style={{ color: '#3e3e52' }}>/</span>
        <span>Fantasy</span>
        <span style={{ color: '#3e3e52' }}>/</span>
        <span style={{ color: '#c9a96e', fontWeight: 500 }}>Werite</span>
      </div>

      {/* Center Logo */}
      <div
        style={{
          color: '#c9a96e',
          fontWeight: 600,
          fontSize: 18,
          letterSpacing: 0.5,
          fontFamily: 'Georgia, serif',
        }}
      >
        ✦ Werite
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Cosmetic Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid #2a2a3a',
            borderRadius: 4,
            padding: '4px 8px',
          }}
        >
          <input
            placeholder="Search..."
            disabled
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#b8b4d0',
              fontSize: 12,
              width: 100,
              cursor: 'not-allowed',
            }}
          />
        </div>

        {/* Export PDF Button */}
        <button
          onClick={onExportPDF}
          style={{
            padding: '5px 14px',
            background: 'transparent',
            border: '1px solid #c9a96e',
            borderRadius: 5,
            color: '#c9a96e',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            transition: 'all 0.15s',
          }}
        >
          Export PDF
        </button>

        {/* Avatar circle "LS" */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c9a96e, #e8c87a)',
            color: '#141418',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: -0.5,
            userSelect: 'none',
          }}
        >
          LS
        </div>
      </div>
    </div>
  )
}
