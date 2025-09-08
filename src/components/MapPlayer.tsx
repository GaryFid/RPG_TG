'use client'

import { useEffect, useState } from 'react'

interface MapPlayerProps {
  x: number
  y: number
  tileSize: number
  className?: string
}

export default function MapPlayer({ x, y, tileSize, className = '' }: MapPlayerProps) {
  const [isMoving, setIsMoving] = useState(false)

  // Анимация движения
  useEffect(() => {
    setIsMoving(true)
    const timer = setTimeout(() => setIsMoving(false), 300)
    return () => clearTimeout(timer)
  }, [x, y])

  return (
    <div
      className={`absolute transition-all duration-300 ${isMoving ? 'scale-110' : 'scale-100'} ${className}`}
      style={{
        left: `${x * tileSize}px`,
        top: `${y * tileSize}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 1000
      }}
    >
      {/* Иконка персонажа */}
      <div className="relative">
        <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">👤</span>
        </div>
        
        {/* Эффект движения */}
        {isMoving && (
          <div className="absolute inset-0 animate-ping">
            <div className="w-full h-full bg-blue-400 rounded-full opacity-30"></div>
          </div>
        )}
        
        {/* Тень */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black bg-opacity-30 rounded-full blur-sm"></div>
      </div>
    </div>
  )
}
