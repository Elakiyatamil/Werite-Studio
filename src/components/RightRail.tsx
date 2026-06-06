// src/components/RightRail.tsx
import React from 'react'

export const RightRail: React.FC = () => {
  return (
    <div
      style={{
        width: 48,
        height: '100%',
        background: '#1a1a22',
        borderLeft: '1px solid #2a2a3a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 16,
        gap: 16,
        boxSizing: 'border-box',
      }}
    >
      {/* Palette Icon */}
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
        title="Palette"
      >
        🎨
      </button>

      {/* Book Icon */}
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
        title="Chapters Book"
      >
        📖
      </button>
    </div>
  )
}
