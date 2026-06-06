// src/components/LeftRail.tsx
import React from 'react'

interface Props {
  onExportPDF: () => void
}

export const LeftRail: React.FC<Props> = ({ onExportPDF }) => {
  return (
    <div
      style={{
        width: 48,
        height: '100%',
        background: '#1a1a22',
        borderRight: '1px solid #2a2a3a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 16,
        gap: 16,
        boxSizing: 'border-box',
      }}
    >
      {/* User Icon (no-op) */}
      <button
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: 'none',
          border: 'none',
          color: '#6b6880',
          cursor: 'default',
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="User Profile"
      >
        👤
      </button>

      {/* Download/Export PDF Icon */}
      <button
        onClick={onExportPDF}
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: 'none',
          border: 'none',
          color: '#6b6880',
          cursor: 'pointer',
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s',
        }}
        title="Export PDF"
        onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a96e')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#6b6880')}
      >
        📥
      </button>
    </div>
  )
}
