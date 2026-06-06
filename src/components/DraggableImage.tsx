// src/components/DraggableImage.tsx
import React, { useState, useEffect, useRef } from 'react'
import type { PlacedImage } from '../types'
import { PAGE_W, PAGE_H } from '../engine/constants'

interface Props {
  image: PlacedImage
  onMove: (id: string, x: number, y: number) => void
  onResize: (id: string, w: number, h: number) => void
}

export const DraggableImage: React.FC<Props> = ({ image, onMove, onResize }) => {
  const [localPos, setLocalPos] = useState({ x: image.x, y: image.y })
  const [localSize, setLocalSize] = useState({ w: image.width, h: image.height })

  const posRef = useRef({ x: image.x, y: image.y })
  const sizeRef = useRef({ w: image.width, h: image.height })

  useEffect(() => {
    setLocalPos({ x: image.x, y: image.y })
    posRef.current = { x: image.x, y: image.y }
  }, [image.x, image.y])

  useEffect(() => {
    setLocalSize({ w: image.width, h: image.height })
    sizeRef.current = { w: image.width, h: image.height }
  }, [image.width, image.height])

  const handleDragMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY
    const startImgX = posRef.current.x
    const startImgY = posRef.current.y

    const onMouseMove = (me: MouseEvent) => {
      const dx = me.clientX - startX
      const dy = me.clientY - startY
      // Restrict drag bounds to the page
      const newX = Math.max(0, Math.min(PAGE_W - sizeRef.current.w, startImgX + dx))
      const newY = Math.max(0, Math.min(PAGE_H - sizeRef.current.h, startImgY + dy))
      setLocalPos({ x: newX, y: newY })
      posRef.current = { x: newX, y: newY }
      // Direct drag update for real-time response
      onMove(image.id, newX, newY)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startW = sizeRef.current.w
    const aspectRatio = sizeRef.current.h / startW

    const onMouseMove = (me: MouseEvent) => {
      const dx = me.clientX - startX
      const newW = Math.max(60, Math.min(280, startW + dx))
      const newH = Math.round(newW * aspectRatio)
      setLocalSize({ w: newW, h: newH })
      sizeRef.current = { w: newW, h: newH }
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      onResize(image.id, sizeRef.current.w, sizeRef.current.h)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: localPos.x,
        top: localPos.y,
        width: localSize.w,
        height: localSize.h,
        userSelect: 'none',
        opacity: image.opacity,
        zIndex: 4,
      }}
    >
      <div
        onMouseDown={handleDragMouseDown}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          cursor: 'move',
          border: '1px dashed #c9a96e',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={image.src}
          alt={image.label || 'Asset'}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Resize handle: 10px gold circle at bottom-right corner */}
      <div
        onMouseDown={handleResizeMouseDown}
        style={{
          position: 'absolute',
          bottom: -5,
          right: -5,
          width: 10,
          height: 10,
          background: '#c9a96e',
          borderRadius: '50%',
          cursor: 'se-resize',
          zIndex: 5,
        }}
      />
    </div>
  )
}
