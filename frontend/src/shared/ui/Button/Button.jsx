import React from 'react'

export default function Button({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        border: '1px solid #333',
        background: '#fff',
        cursor: 'pointer',
        ...style
      }}
    >
      {children}
    </button>
  )
}
