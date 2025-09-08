'use client'

import { useEffect, useRef, useState } from 'react'
import { TiledMapRenderer, TiledMap } from '@/lib/tiledMapRenderer'
import MapController from './MapController'

interface TiledMapViewerProps {
  mapData: TiledMap
  className?: string
  onMapLoad?: () => void
  onTileClick?: (x: number, y: number, tileId: number) => void
  enablePlayerControl?: boolean
}

export default function TiledMapViewer({ 
  mapData, 
  className = '', 
  onMapLoad,
  onTileClick,
  enablePlayerControl = false
}: TiledMapViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const rendererRef = useRef<TiledMapRenderer | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !mapData) return

    const canvas = canvasRef.current
    const renderer = new TiledMapRenderer(canvas)
    rendererRef.current = renderer

    const loadMap = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        await renderer.loadMap(mapData)
        
        setIsLoading(false)
        if (onMapLoad) {
          onMapLoad()
        }
      } catch (err) {
        console.error('Failed to load map:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map')
        setIsLoading(false)
      }
    }

    loadMap()

    // Cleanup
    return () => {
      rendererRef.current = null
    }
  }, [mapData, onMapLoad])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !onTileClick || !rendererRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const tileId = rendererRef.current.getTileAt(x, y)
    const tileX = Math.floor(x / mapData.tilewidth)
    const tileY = Math.floor(y / mapData.tileheight)

    onTileClick(tileX, tileY, tileId)
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fantasy-gold mx-auto mb-2"></div>
            <p className="text-fantasy-gold">Загрузка карты...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-50 z-10">
          <div className="text-center text-red-300">
            <p className="text-lg font-bold mb-2">Ошибка загрузки карты</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-auto border border-gray-600 rounded-lg cursor-pointer"
          style={{ 
            maxWidth: '100%',
            height: 'auto',
            imageRendering: 'pixelated' // Для четкого отображения пиксельной графики
          }}
        />
        
        {/* Контроллер игрока */}
        {enablePlayerControl && mapLoaded && (
          <MapController
            mapWidth={mapData.width}
            mapHeight={mapData.height}
            tileSize={mapData.tilewidth}
            onPositionChange={(x, y) => {
              console.log(`Player moved to: ${x}, ${y}`)
              // Здесь можно добавить логику для проверки коллизий, событий и т.д.
            }}
            className="absolute inset-0 pointer-events-none"
          />
        )}
      </div>
    </div>
  )
}
