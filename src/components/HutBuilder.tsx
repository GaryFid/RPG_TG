'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { Hut, HutZone, HutConstruction, CastleType } from '@/types/game'

interface HutBuilderProps {
  onClose: () => void
  mapWidth: number
  mapHeight: number
  tileSize: number
  selectedCastleType: CastleType
}

export default function HutBuilder({ onClose, mapWidth, mapHeight, tileSize, selectedCastleType }: HutBuilderProps) {
  const { character } = useGameStore()
  const [selectedZone, setSelectedZone] = useState<HutZone | null>(null)
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null)
  const [construction, setConstruction] = useState<HutConstruction | null>(null)
  const [huts, setHuts] = useState<Hut[]>([])
  const [isBuilding, setIsBuilding] = useState(false)

  // Зоны для строительства
  const hutZones: HutZone[] = useMemo(() => [
    {
      id: 'center',
      name: 'Центральная зона',
      emoji: '🏰',
      description: 'Престижная зона в центре карты',
      basePrice: 10000,
      priceMultiplier: 1.0,
      maxHuts: 5,
      coordinates: { x: mapWidth / 2, y: mapHeight / 2 },
      radius: 50
    },
    {
      id: 'inner',
      name: 'Внутренняя зона',
      emoji: '🏘️',
      description: 'Близко к центру, хорошее расположение',
      basePrice: 5000,
      priceMultiplier: 0.7,
      maxHuts: 15,
      coordinates: { x: mapWidth / 2, y: mapHeight / 2 },
      radius: 100
    },
    {
      id: 'outer',
      name: 'Внешняя зона',
      emoji: '🏕️',
      description: 'Дальше от центра, но доступнее по цене',
      basePrice: 2000,
      priceMultiplier: 0.4,
      maxHuts: 30,
      coordinates: { x: mapWidth / 2, y: mapHeight / 2 },
      radius: 200
    },
    {
      id: 'wilderness',
      name: 'Дикая зона',
      emoji: '🌲',
      description: 'Самые дешевые участки на окраинах',
      basePrice: 500,
      priceMultiplier: 0.1,
      maxHuts: 50,
      coordinates: { x: mapWidth / 2, y: mapHeight / 2 },
      radius: 300
    }
  ], [mapWidth, mapHeight])

  const loadHuts = useCallback(async () => {
    try {
      // TODO: Загрузить хижины с сервера
      // const response = await fetch('/api/huts')
      // const data = await response.json()
      // setHuts(data.huts)
      
      // Моковые данные для тестирования
      setHuts([
        {
          id: 'hut_1',
          ownerId: 123456789,
          ownerName: 'TestPlayer',
          name: 'Моя хижина',
          x: 50,
          y: 50,
          size: { width: 4, height: 4 },
          zone: hutZones[1],
          castleType: selectedCastleType, // Используем выбранный тип замка
          level: 1,
          upgrades: [],
          resources: { wood: 100, stone: 50, metal: 25, gems: 5, food: 200, maxStorage: 1000 },
          lastVisited: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    } catch (error) {
      console.error('Failed to load huts:', error)
    }
  }, [hutZones, selectedCastleType])

  // Загружаем существующие хижины
  useEffect(() => {
    loadHuts()
  }, [loadHuts])

  const getZoneForPosition = useCallback((x: number, y: number): HutZone | null => {
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - mapWidth / 2, 2) + Math.pow(y - mapHeight / 2, 2)
    )

    for (const zone of hutZones) {
      if (distanceFromCenter <= zone.radius) {
        return zone
      }
    }
    return null
  }, [mapWidth, mapHeight, hutZones])

  const calculatePrice = useCallback((x: number, y: number, zone: HutZone, castleType?: CastleType): number => {
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - mapWidth / 2, 2) + Math.pow(y - mapHeight / 2, 2)
    )
    const distanceMultiplier = Math.max(0.1, 1 - (distanceFromCenter / zone.radius) * 0.9)
    const basePrice = zone.basePrice * zone.priceMultiplier * distanceMultiplier
    const castlePrice = castleType ? castleType.basePrice : 0
    
    return Math.floor(basePrice + castlePrice)
  }, [mapWidth, mapHeight])

  const checkCollision = useCallback((x: number, y: number): boolean => {
    const hutSize = 4
    for (const hut of huts) {
      if (
        x < hut.x + hut.size.width &&
        x + hutSize > hut.x &&
        y < hut.y + hut.size.height &&
        y + hutSize > hut.y
      ) {
        return true
      }
    }
    return false
  }, [huts])

  const buildHut = useCallback(async (x: number, y: number, zone: HutZone, castleType: CastleType, cost: number) => {
    if (!character) return

    setIsBuilding(true)
    try {
      // Моковое строительство
      const newHut: Hut = {
        id: `hut_${Date.now()}`,
        ownerId: character.userId,
        ownerName: character.name,
        name: `${castleType.name} ${character.name}`,
        x,
        y,
        size: { width: 4, height: 4 },
        zone,
        castleType,
        level: 1,
        upgrades: [],
        resources: { wood: 0, stone: 0, metal: 0, gems: 0, food: 0, maxStorage: 1000 },
        lastVisited: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setHuts(prev => [...prev, newHut])
      
      // Обновляем золото персонажа
      // TODO: Обновить через API
      
      alert(`${castleType.name} основан за ${cost} золота!`)
      onClose()
    } catch (error) {
      console.error('Failed to build hut:', error)
      alert('Ошибка строительства замка')
    } finally {
      setIsBuilding(false)
    }
  }, [character, onClose])

  const handleTileHover = useCallback((x: number, y: number) => {
    setHoveredTile({ x, y })
    
    const zone = getZoneForPosition(x, y)
    if (!zone) {
      setConstruction(null)
      return
    }

    const cost = calculatePrice(x, y, zone, selectedCastleType)
    const hasCollision = checkCollision(x, y)
    const canAfford = character ? character.gold >= cost : false

    setConstruction({
      x,
      y,
      zone,
      cost,
      canBuild: !hasCollision && canAfford,
      reason: hasCollision ? 'Занято другим игроком' : !canAfford ? 'Недостаточно золота' : undefined
    })
  }, [character, getZoneForPosition, calculatePrice, checkCollision, selectedCastleType])

  const handleTileClick = useCallback((x: number, y: number) => {
    if (!construction || !construction.canBuild || !character) return

    buildHut(x, y, construction.zone, selectedCastleType, construction.cost)
  }, [construction, character, selectedCastleType, buildHut])

  if (!character) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-gray-400">Персонаж не найден</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <div>
            <h2 className="text-2xl font-bold text-fantasy-gold">
              {selectedCastleType.emoji} Размещение: {selectedCastleType.name}
            </h2>
            <p className="text-sm text-gray-400">Выберите место на карте</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Левая панель - информация */}
          <div className="w-80 p-4 border-r border-gray-600 overflow-y-auto">
            <div className="space-y-4">
              {/* Информация о персонаже */}
              <div className="bg-gray-700 rounded-lg p-3">
                <h3 className="text-lg font-semibold text-fantasy-gold mb-2">
                  {character.name}
                </h3>
                <p className="text-sm text-gray-300">
                  Золото: <span className="text-fantasy-gold font-bold">{character.gold}</span>
                </p>
              </div>

              {/* Информация о выбранном замке */}
              <div className="bg-gray-700 rounded-lg p-3">
                <h3 className="text-lg font-semibold text-fantasy-gold mb-3">
                  {selectedCastleType.emoji} {selectedCastleType.name}
                </h3>
                <p className="text-sm text-gray-300 mb-3">{selectedCastleType.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>⚡ Производство:</span>
                    <span className="text-fantasy-gold">{selectedCastleType.bonuses.production}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🛡️ Защита:</span>
                    <span className="text-fantasy-gold">{selectedCastleType.bonuses.defense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📦 Вместимость:</span>
                    <span className="text-fantasy-gold">{selectedCastleType.bonuses.capacity}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>💰 Базовая стоимость:</span>
                    <span className="text-fantasy-gold">{selectedCastleType.basePrice}</span>
                  </div>
                </div>
              </div>

              {/* Зоны строительства */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Зоны строительства</h3>
                <div className="space-y-2">
                  {hutZones.map((zone) => (
                    <div
                      key={zone.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedZone?.id === zone.id
                          ? 'border-fantasy-gold bg-fantasy-gold bg-opacity-20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedZone(zone)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{zone.emoji}</span>
                        <div>
                          <p className="font-semibold text-white">{zone.name}</p>
                          <p className="text-xs text-gray-400">{zone.description}</p>
                          <p className="text-xs text-fantasy-gold">
                            От {zone.basePrice} золота
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Информация о строительстве */}
              {construction && (
                <div className="bg-gray-700 rounded-lg p-3">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Выбранное место
                  </h3>
                  <p className="text-sm text-gray-300">
                    Позиция: ({construction.x}, {construction.y})
                  </p>
                  <p className="text-sm text-gray-300">
                    Зона: {construction.zone.name}
                  </p>
                  <p className="text-sm text-fantasy-gold">
                    Стоимость: {construction.cost} золота
                  </p>
                  {construction.reason && (
                    <p className="text-sm text-red-400">
                      {construction.reason}
                    </p>
                  )}
                  {construction.canBuild && (
                    <button
                      onClick={() => handleTileClick(construction.x, construction.y)}
                      disabled={isBuilding}
                      className="w-full mt-2 bg-fantasy-gold hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                    >
                      {isBuilding ? 'Основываем...' : `${selectedCastleType.emoji} Построить ${selectedCastleType.name}`}
                    </button>
                  )}
                </div>
              )}

              {/* Инструкции */}
              <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-blue-300 mb-2">
                  Как строить:
                </h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Выберите зону строительства</li>
                  <li>• Наведите курсор на карту</li>
                  <li>• Зеленая область - можно строить</li>
                  <li>• Красная область - занято</li>
                  <li>• Размер королевства: 4×4 тайла</li>
                </ul>
              </div>
            </div>
          </div>

              {/* Правая панель - карта */}
          <div className="flex-1 p-4">
            <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
              {/* Мини-карта для выбора позиции */}
              <div className="w-full h-full relative">
                {/* Зональная раскраска */}
                <div className="absolute inset-0">
                  {Array.from({ length: Math.ceil(mapHeight / 10) }).map((_, row) =>
                    Array.from({ length: Math.ceil(mapWidth / 10) }).map((_, col) => {
                      const x = col * 10
                      const y = row * 10
                      const zone = getZoneForPosition(x, y)
                      const distanceFromCenter = Math.sqrt(
                        Math.pow(x - mapWidth / 2, 2) + Math.pow(y - mapHeight / 2, 2)
                      )
                      const maxDistance = Math.sqrt(Math.pow(mapWidth / 2, 2) + Math.pow(mapHeight / 2, 2))
                      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1)
                      
                      // Цвет от зеленого (дешево, далеко) до красного (дорого, близко к центру)
                      const red = Math.floor(normalizedDistance * 100 + 155)
                      const green = Math.floor((1 - normalizedDistance) * 100 + 155)
                      const blue = 50
                      
                      return (
                        <div
                          key={`${row}-${col}`}
                          className="absolute opacity-30 hover:opacity-50 transition-opacity cursor-pointer"
                          style={{
                            left: x,
                            top: y,
                            width: 10,
                            height: 10,
                            backgroundColor: `rgb(${red}, ${green}, ${blue})`,
                            border: zone ? `1px solid ${zone.emoji === '🏰' ? '#FFD700' : '#666'}` : '1px solid #333'
                          }}
                          onMouseEnter={() => handleTileHover(x, y)}
                          onClick={() => handleTileClick(x, y)}
                        />
                      )
                    })
                  )}
                </div>

                {/* Существующие хижины */}
                {huts.map((hut) => (
                  <div
                    key={hut.id}
                    className="absolute bg-red-500 bg-opacity-70 border border-red-400 flex items-center justify-center"
                    style={{
                      left: (hut.x / mapWidth) * 100 + '%',
                      top: (hut.y / mapHeight) * 100 + '%',
                      width: (hut.size.width / mapWidth) * 100 + '%',
                      height: (hut.size.height / mapHeight) * 100 + '%'
                    }}
                    title={`${hut.ownerName} - ${hut.name}`}
                  >
                    <div className="text-white text-xl">
                      {hut.castleType?.emoji || '🏠'}
                    </div>
                  </div>
                ))}

                {/* Предварительный просмотр строительства */}
                {hoveredTile && construction && (
                  <div
                    className={`absolute border-2 ${
                      construction.canBuild
                        ? 'border-green-400 bg-green-500 bg-opacity-30'
                        : 'border-red-400 bg-red-500 bg-opacity-30'
                    }`}
                    style={{
                      left: (construction.x / mapWidth) * 100 + '%',
                      top: (construction.y / mapHeight) * 100 + '%',
                      width: (4 / mapWidth) * 100 + '%',
                      height: (4 / mapHeight) * 100 + '%'
                    }}
                  />
                )}

                {/* Центр карты */}
                <div
                  className="absolute w-2 h-2 bg-fantasy-gold rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
