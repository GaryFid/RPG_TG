'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { TiledMap } from '@/lib/tiledMapRenderer'
import TiledMapViewer from './TiledMapViewer'
import CharacterSprite, { useCharacterSprites } from './CharacterSprite'

interface FullscreenWorldMapProps {
  onClose: () => void
}

export default function FullscreenWorldMap({ onClose }: FullscreenWorldMapProps) {
  const { character } = useGameStore()
  const [mapData, setMapData] = useState<TiledMap | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const { characters, selectedCharacter, selectCharacter } = useCharacterSprites()

  // Загружаем данные карты
  useEffect(() => {
    const loadMapData = async () => {
      try {
        console.log('Loading fullscreen map data...')
        const response = await fetch('/assets/maps/my_world.json')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Fullscreen map data loaded:', data)
        setMapData(data)
      } catch (error) {
        console.error('Failed to load map data:', error)
        setError('Ошибка загрузки карты')
      }
    }
    
    loadMapData()
  }, [])

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true)
    console.log('Fullscreen Tiled map loaded successfully!')
  }, [])

  const handleTileClick = useCallback((x: number, y: number, tileId: number) => {
    console.log(`Clicked tile at (${x}, ${y}) with ID: ${tileId}`)
    // Здесь можно добавить логику для взаимодействия с тайлами
  }, [])

  // Обработка мыши для панорамирования
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Левая кнопка мыши
      setIsDragging(true)
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }, [panOffset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Обработка колесика мыши для масштабирования
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(0.1, Math.min(3, scale * delta))
    setScale(newScale)
  }, [scale])

  // Обработка касаний для мобильных устройств
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y })
    }
  }, [panOffset])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0]
      setPanOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Сброс позиции и масштаба
  const resetView = useCallback(() => {
    setPanOffset({ x: 0, y: 0 })
    setScale(1)
  }, [])

  // Центрирование карты
  const centerMap = useCallback(() => {
    if (containerRef.current && mapRef.current) {
      const container = containerRef.current
      const map = mapRef.current
      
      const containerRect = container.getBoundingClientRect()
      const mapRect = map.getBoundingClientRect()
      
      setPanOffset({
        x: (containerRect.width - mapRect.width * scale) / 2,
        y: (containerRect.height - mapRect.height * scale) / 2
      })
    }
  }, [scale])

  if (!character) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <p className="text-gray-400">Персонаж не найден</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Верхняя панель с кнопками */}
      <div className="flex items-center justify-between p-4 bg-gray-900 bg-opacity-90 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-fantasy-gold">
            🗺️ Карта Мира
          </h1>
          <span className="text-sm text-gray-300">
            {character.name} - {character.current_city}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Кнопка сброса */}
          <button
            onClick={resetView}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
            title="Сбросить вид"
          >
            🎯 Центр
          </button>
          
          {/* Кнопка масштаба */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setScale(Math.max(0.1, scale - 0.1))}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
            >
              −
            </button>
            <span className="text-white text-sm min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(Math.min(3, scale + 0.1))}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
            >
              +
            </button>
          </div>
          
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-medium"
          >
            ✕ Закрыть
          </button>
        </div>
      </div>

      {/* Основная область карты */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-gray-800"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-50 z-10">
            <div className="text-center text-red-300">
              <p className="text-lg font-bold mb-2">Ошибка загрузки карты</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-white"
              >
                Перезагрузить
              </button>
            </div>
          </div>
        )}

        {mapData && (
          <div
            ref={mapRef}
            className="absolute"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <TiledMapViewer
              mapData={mapData}
              onMapLoad={handleMapLoad}
              onTileClick={handleTileClick}
              enablePlayerControl={false}
              className="w-full h-auto"
            />
            
            {/* Персонажи на карте */}
            {characters.map((character, index) => (
              <CharacterSprite
                key={character.id}
                characterId={character.id}
                x={100 + index * 80} // Временное размещение
                y={100 + index * 60}
                isSelected={selectedCharacter === character.id}
                onClick={() => selectCharacter(character.id)}
                className="pointer-events-auto"
              />
            ))}
          </div>
        )}

        {/* Индикатор загрузки */}
        {!mapLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fantasy-gold mx-auto mb-4"></div>
              <p className="text-fantasy-gold text-lg">Загрузка карты мира...</p>
            </div>
          </div>
        )}

        {/* Информационная панель */}
        {mapLoaded && mapData && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg backdrop-blur-sm">
            <p className="text-sm">
              <span className="text-fantasy-gold">Размер:</span> {mapData.width}×{mapData.height} тайлов
            </p>
            <p className="text-sm">
              <span className="text-fantasy-gold">Тайл:</span> {mapData.tilewidth}×{mapData.tileheight}px
            </p>
            <p className="text-sm">
              <span className="text-fantasy-gold">Слоев:</span> {mapData.layers.length}
            </p>
            <p className="text-sm">
              <span className="text-fantasy-gold">Масштаб:</span> {Math.round(scale * 100)}%
            </p>
            <p className="text-sm">
              <span className="text-fantasy-gold">Персонажи:</span> {characters.length}
            </p>
            {selectedCharacter && (
              <p className="text-sm">
                <span className="text-fantasy-gold">Выбран:</span> {characters.find(c => c.id === selectedCharacter)?.name}
              </p>
            )}
          </div>
        )}

        {/* Инструкции */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg backdrop-blur-sm text-sm">
          <p className="text-fantasy-gold font-bold mb-1">Управление:</p>
          <p>• Перетаскивание: панорамирование</p>
          <p>• Колесико: масштабирование</p>
          <p>• Касание: панорамирование (мобильные)</p>
          <p>• Клик по персонажу: выбор</p>
        </div>
      </div>
    </div>
  )
}
