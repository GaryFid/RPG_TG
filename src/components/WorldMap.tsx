'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { CITIES } from '@/lib/gameData'
import { City } from '@/types/game'
import CryptoWallet from './CryptoWallet'
import TiledMapViewer from './TiledMapViewer'
import { TiledMap } from '@/lib/tiledMapRenderer'

export default function WorldMap() {
  const { character, setSelectedCity, setCurrentView } = useGameStore()
  const [selectedCityInfo, setSelectedCityInfo] = useState<City | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mapData, setMapData] = useState<TiledMap | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [viewMode, setViewMode] = useState<'tiled' | 'cities'>('tiled')

  // Загружаем данные карты
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const response = await fetch('/assets/maps/my_world.json')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setMapData(data)
      } catch (error) {
        console.error('Failed to load map data:', error)
      }
    }
    
    loadMapData()
  }, [])

  const handleCityClick = (city: City) => {
    setSelectedCityInfo(city)
    setIsModalOpen(true)
  }

  const handleTileClick = (x: number, y: number, tileId: number) => {
    console.log(`Clicked tile at (${x}, ${y}) with ID: ${tileId}`)
    // Здесь можно добавить логику для взаимодействия с тайлами
  }

  const handleMapLoad = () => {
    setMapLoaded(true)
    console.log('Tiled map loaded successfully!')
  }

  const handleTravelToCity = (cityId: string) => {
    if (character && character.current_city !== cityId) {
      // TODO: Implement travel logic with time/cost
      setSelectedCity(cityId)
      setIsModalOpen(false)
      // For now, just show travel message
      alert(`Путешествие в ${CITIES.find(c => c.id === cityId)?.name} началось!`)
    } else {
      // Already in this city, go to city view
      setSelectedCity(cityId)
      setCurrentView('shop') // или другой view для города
      setIsModalOpen(false)
    }
  }

  if (!character) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Персонаж не найден</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 pr-0 sm:pr-24">
      <CryptoWallet />
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-fantasy-gold mb-2">
          🗺️ Карта Мира
        </h1>
        <p className="text-gray-300">
          Текущее местоположение: <span className="text-fantasy-gold">
            {CITIES.find(city => city.id === character.current_city)?.name}
          </span>
        </p>
      </div>


      {/* View Mode Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-700 rounded-lg p-1 flex">
          <button
            onClick={() => setViewMode('tiled')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'tiled'
                ? 'bg-fantasy-gold text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🗺️ Tiled Карта
          </button>
          <button
            onClick={() => setViewMode('cities')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'cities'
                ? 'bg-fantasy-gold text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🏰 Города
          </button>
        </div>
      </div>

      {/* World Map Container */}
      <div className="card mb-6">
        {viewMode === 'tiled' && mapData ? (
          <div className="relative">
            <TiledMapViewer
              mapData={mapData}
              onMapLoad={handleMapLoad}
              onTileClick={handleTileClick}
              enablePlayerControl={true}
              className="w-full"
            />
            
            {/* Overlay с информацией о карте */}
            {mapLoaded && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                <p className="text-sm">
                  <span className="text-fantasy-gold">Карта:</span> {mapData.width}×{mapData.height} тайлов
                </p>
                <p className="text-sm">
                  <span className="text-fantasy-gold">Размер тайла:</span> {mapData.tilewidth}×{mapData.tileheight}px
                </p>
                <p className="text-sm">
                  <span className="text-fantasy-gold">Слоев:</span> {mapData.layers.length}
                </p>
              </div>
            )}
          </div>
        ) : viewMode === 'cities' ? (
          <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 rounded-lg overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 text-6xl">🏔️</div>
              <div className="absolute top-20 right-20 text-4xl">🌲</div>
              <div className="absolute bottom-20 left-20 text-5xl">🌊</div>
              <div className="absolute bottom-10 right-10 text-3xl">🏜️</div>
              <div className="absolute top-1/3 left-1/3 text-4xl">⛰️</div>
              <div className="absolute top-2/3 right-1/3 text-3xl">🌳</div>
            </div>

            {/* Cities */}
            {CITIES.map((city) => {
              const isCurrentCity = character.current_city === city.id
              const isVisited = true // TODO: Track visited cities
              
              return (
                <button
                  key={city.id}
                  onClick={() => handleCityClick(city)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                    isCurrentCity 
                      ? 'ring-4 ring-fantasy-gold animate-pulse' 
                      : 'hover:ring-2 hover:ring-white'
                  }`}
                  style={{
                    left: `${city.coordinates.x}%`,
                    top: `${city.coordinates.y}%`
                  }}
                >
                  <div className="text-center">
                    <div className={`text-4xl md:text-5xl mb-1 ${
                      isCurrentCity ? 'animate-bounce' : ''
                    }`}>
                      {city.emoji}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold shadow-lg ${
                      isCurrentCity 
                        ? 'bg-fantasy-gold text-black' 
                        : isVisited
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-800 text-gray-400'
                    }`}>
                      {city.name}
                    </div>
                  </div>
                </button>
              )
            })}

            {/* Roads/Paths (decorative) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <defs>
                <path id="road" stroke="#8B4513" strokeWidth="2" fill="none" strokeDasharray="5,5" />
              </defs>
              {/* Example roads between cities */}
              <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#8B4513" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#8B4513" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#8B4513" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="30%" y1="70%" x2="60%" y2="30%" stroke="#8B4513" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fantasy-gold mx-auto mb-4"></div>
              <p className="text-gray-400">Загрузка карты...</p>
              {!mapData && (
                <p className="text-sm text-gray-500 mt-2">Загружаем данные карты...</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => setCurrentView('game')}
          className="btn-secondary text-center p-4 rounded-lg"
        >
          <div className="text-2xl mb-2">🏠</div>
          <div className="text-sm">Вернуться</div>
        </button>
        
        <button 
          onClick={() => alert('Быстрые путешествия скоро будут доступны!')}
          className="btn-secondary text-center p-4 rounded-lg opacity-50 cursor-not-allowed"
        >
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-sm">Телепорт</div>
        </button>
        
        <button 
          onClick={() => alert('Квесты в разработке!')}
          className="btn-secondary text-center p-4 rounded-lg opacity-50 cursor-not-allowed"
        >
          <div className="text-2xl mb-2">📜</div>
          <div className="text-sm">Квесты</div>
        </button>
        
        <button 
          onClick={() => alert('Торговые маршруты скоро!')}
          className="btn-secondary text-center p-4 rounded-lg opacity-50 cursor-not-allowed"
        >
          <div className="text-2xl mb-2">🚚</div>
          <div className="text-sm">Торговля</div>
        </button>
      </div>

      {/* City Info Modal */}
      {isModalOpen && selectedCityInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{selectedCityInfo.emoji}</div>
              <h3 className="text-2xl font-bold text-fantasy-gold mb-2">
                {selectedCityInfo.name}
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                {selectedCityInfo.description}
              </p>
            </div>

            {/* City Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded">
                <span>🏪 Магазины</span>
                <span className="text-fantasy-gold">Доступно</span>
              </div>
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded">
                <span>🛠️ Услуги</span>
                <span className="text-fantasy-gold">Доступно</span>
              </div>
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded opacity-50">
                <span>📜 Квесты</span>
                <span className="text-gray-400">Скоро</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Закрыть
              </button>
              
              {character.current_city === selectedCityInfo.id ? (
                <button
                  onClick={() => {
                    setSelectedCity(selectedCityInfo.id)
                    setCurrentView('shop') // Navigate to city
                    setIsModalOpen(false)
                  }}
                  className="btn-primary flex-1"
                >
                  🏪 Войти в город
                </button>
              ) : (
                <button
                  onClick={() => handleTravelToCity(selectedCityInfo.id)}
                  className="btn-primary flex-1"
                >
                  ✈️ Путешествовать
                </button>
              )}
            </div>

            {/* Travel Info */}
            {character.current_city !== selectedCityInfo.id && (
              <div className="mt-4 p-3 bg-blue-900 bg-opacity-30 rounded text-sm">
                <p className="text-blue-300">
                  🕐 Время путешествия: ~5 минут<br/>
                  💰 Стоимость: 10 золота<br/>
                  ⚡ Опыт: +5 XP за исследование
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
