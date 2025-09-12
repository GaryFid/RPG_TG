'use client'

import { useState, useEffect, useCallback } from 'react'
import MapPlayer from './MapPlayer'

interface MapControllerProps {
  mapWidth: number
  mapHeight: number
  tileSize: number
  onPositionChange?: (x: number, y: number) => void
  className?: string
}

export default function MapController({ 
  mapWidth, 
  mapHeight, 
  tileSize, 
  onPositionChange,
  className = '' 
}: MapControllerProps) {
  const [playerX, setPlayerX] = useState(10) // Начальная позиция
  const [playerY, setPlayerY] = useState(10)
  const [isMoving, setIsMoving] = useState(false)

  const movePlayer = useCallback((deltaX: number, deltaY: number) => {
    if (isMoving) return

    const newX = Math.max(0, Math.min(mapWidth - 1, playerX + deltaX))
    const newY = Math.max(0, Math.min(mapHeight - 1, playerY + deltaY))

    if (newX !== playerX || newY !== playerY) {
      setPlayerX(newX)
      setPlayerY(newY)
      setIsMoving(true)
      
      if (onPositionChange) {
        onPositionChange(newX, newY)
      }

      // Сброс флага движения через анимацию
      setTimeout(() => setIsMoving(false), 300)
    }
  }, [isMoving, mapWidth, mapHeight, playerX, playerY, onPositionChange])

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isMoving) return

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault()
          movePlayer(0, -1)
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault()
          movePlayer(0, 1)
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault()
          movePlayer(-1, 0)
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault()
          movePlayer(1, 0)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [playerX, playerY, isMoving, movePlayer])

  return (
    <div className={`relative ${className}`}>
      {/* Игрок */}
      <MapPlayer 
        x={playerX} 
        y={playerY} 
        tileSize={tileSize}
      />

    </div>
  )
}
