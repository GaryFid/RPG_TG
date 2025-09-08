'use client'

import { useState, useEffect } from 'react'
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

  const movePlayer = (deltaX: number, deltaY: number) => {
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
  }

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
  }, [playerX, playerY, isMoving])

  return (
    <div className={`relative ${className}`}>
      {/* Игрок */}
      <MapPlayer 
        x={playerX} 
        y={playerY} 
        tileSize={tileSize}
      />

      {/* Элементы управления */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {/* Кнопки направления */}
        <div className="grid grid-cols-3 gap-1">
          <div></div>
          <button
            onClick={() => movePlayer(0, -1)}
            disabled={isMoving}
            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg flex items-center justify-center text-white"
          >
            ↑
          </button>
          <div></div>
          
          <button
            onClick={() => movePlayer(-1, 0)}
            disabled={isMoving}
            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg flex items-center justify-center text-white"
          >
            ←
          </button>
          <div className="w-10 h-10"></div>
          <button
            onClick={() => movePlayer(1, 0)}
            disabled={isMoving}
            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg flex items-center justify-center text-white"
          >
            →
          </button>
          
          <div></div>
          <button
            onClick={() => movePlayer(0, 1)}
            disabled={isMoving}
            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg flex items-center justify-center text-white"
          >
            ↓
          </button>
          <div></div>
        </div>

        {/* Информация о позиции */}
        <div className="bg-black bg-opacity-50 text-white text-xs p-2 rounded">
          <div>Позиция: {playerX}, {playerY}</div>
          <div className="text-gray-300">Используйте WASD или стрелки</div>
        </div>
      </div>
    </div>
  )
}
