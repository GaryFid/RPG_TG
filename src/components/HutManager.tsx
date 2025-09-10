'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { Hut, HutUpgrade } from '@/types/game'

export default function HutManager() {
  const { character, setCurrentView } = useGameStore()
  const [huts, setHuts] = useState<Hut[]>([])
  const [selectedHut, setSelectedHut] = useState<Hut | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadPlayerHuts = useCallback(async () => {
    if (!character) return

    setIsLoading(true)
    try {
      // TODO: Загрузить хижины с сервера
      // const response = await fetch(`/api/huts/player/${character.userId}`)
      // const data = await response.json()
      // setHuts(data.huts)
      
      // Моковые данные
      setHuts([
        {
          id: 'hut_1',
          ownerId: character.userId,
          ownerName: character.name,
          name: 'Моя первая хижина',
          x: 50,
          y: 50,
          size: { width: 4, height: 4 },
          zone: {
            id: 'inner',
            name: 'Внутренняя зона',
            emoji: '🏘️',
            description: 'Близко к центру',
            basePrice: 5000,
            priceMultiplier: 0.7,
            maxHuts: 15,
            coordinates: { x: 100, y: 100 },
            radius: 100
          },
          level: 1,
          upgrades: [],
          resources: { wood: 150, stone: 75, metal: 30, gems: 8, food: 300, maxStorage: 1000 },
          lastVisited: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    } catch (error) {
      console.error('Failed to load huts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [character])

  // Загружаем хижины персонажа
  useEffect(() => {
    loadPlayerHuts()
  }, [loadPlayerHuts])

  const handleUpgradeHut = async (hutId: string, upgrade: HutUpgrade) => {
    try {
      // TODO: Отправить запрос на улучшение
      // const response = await fetch(`/api/huts/${hutId}/upgrade`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ upgradeId: upgrade.id })
      // })

      alert(`Улучшение "${upgrade.name}" добавлено!`)
    } catch (error) {
      console.error('Failed to upgrade hut:', error)
      alert('Ошибка улучшения хижины')
    }
  }

  const handleVisitHut = (hut: Hut) => {
    // TODO: Перейти к хижине на карте
    alert(`Переход к хижине "${hut.name}"`)
  }

  if (!character) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Персонаж не найден</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fantasy-gold mx-auto mb-4"></div>
          <p className="text-fantasy-gold">Загрузка хижин...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-fantasy-gold mb-2">
          🏠 Мои хижины
        </h1>
        <p className="text-gray-300">
          Управление вашими владениями
        </p>
      </div>

      {huts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏗️</div>
          <h2 className="text-2xl font-bold text-fantasy-gold mb-4">
            У вас пока нет хижин
          </h2>
          <p className="text-gray-400 mb-6">
            Постройте свою первую хижину на карте мира
          </p>
          <button
            onClick={() => setCurrentView('map')}
            className="px-6 py-3 bg-fantasy-gold hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors"
          >
            🗺️ Перейти к карте
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Список хижин */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Ваши хижины ({huts.length})
            </h2>
            {huts.map((hut) => (
              <div
                key={hut.id}
                className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                  selectedHut?.id === hut.id
                    ? 'ring-2 ring-fantasy-gold bg-gray-700'
                    : 'hover:bg-gray-700'
                }`}
                onClick={() => setSelectedHut(hut)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-fantasy-gold">
                      {hut.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {hut.zone.name} • Уровень {hut.level}
                    </p>
                    <p className="text-xs text-gray-500">
                      Позиция: ({hut.x}, {hut.y})
                    </p>
                  </div>
                  <div className="text-2xl">{hut.zone.emoji}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Детали выбранной хижины */}
          <div>
            {selectedHut ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">{selectedHut.zone.emoji}</div>
                  <h2 className="text-2xl font-bold text-fantasy-gold">
                    {selectedHut.name}
                  </h2>
                  <p className="text-gray-400">
                    {selectedHut.zone.name} • Уровень {selectedHut.level}
                  </p>
                </div>

                {/* Ресурсы */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    📦 Ресурсы
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700 rounded p-3">
                      <div className="flex justify-between text-sm">
                        <span>🪵 Дерево</span>
                        <span className="text-fantasy-gold">{selectedHut.resources.wood}</span>
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded p-3">
                      <div className="flex justify-between text-sm">
                        <span>🪨 Камень</span>
                        <span className="text-fantasy-gold">{selectedHut.resources.stone}</span>
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded p-3">
                      <div className="flex justify-between text-sm">
                        <span>⚒️ Металл</span>
                        <span className="text-fantasy-gold">{selectedHut.resources.metal}</span>
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded p-3">
                      <div className="flex justify-between text-sm">
                        <span>💎 Драгоценности</span>
                        <span className="text-fantasy-gold">{selectedHut.resources.gems}</span>
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded p-3">
                      <div className="flex justify-between text-sm">
                        <span>🍖 Еда</span>
                        <span className="text-fantasy-gold">{selectedHut.resources.food}</span>
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded p-3">
                      <div className="flex justify-between text-sm">
                        <span>📦 Хранилище</span>
                        <span className="text-fantasy-gold">
                          {Object.values(selectedHut.resources).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)}/{selectedHut.resources.maxStorage}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Улучшения */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    ⚡ Улучшения
                  </h3>
                  {selectedHut.upgrades.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      Пока нет улучшений
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedHut.upgrades.map((upgrade) => (
                        <div key={upgrade.id} className="bg-gray-700 rounded p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-white">{upgrade.name}</p>
                              <p className="text-xs text-gray-400">{upgrade.description}</p>
                            </div>
                            <span className="text-fantasy-gold">Уровень {upgrade.level}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Действия */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleVisitHut(selectedHut)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    🗺️ Посетить хижину
                  </button>
                  <button
                    onClick={() => alert('Улучшения скоро будут доступны!')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    ⚡ Улучшить хижину
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">👆</div>
                <p className="text-gray-400">
                  Выберите хижину для просмотра деталей
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Кнопка возврата */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setCurrentView('game')}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
        >
          ← Вернуться в игру
        </button>
      </div>
    </div>
  )
}
