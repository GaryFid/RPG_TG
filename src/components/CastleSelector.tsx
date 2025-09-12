'use client'

import { useState } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { CastleType } from '@/types/game'

interface CastleSelectorProps {
  onClose: () => void
  onSelectCastle: (castleType: CastleType) => void
}

export default function CastleSelector({ onClose, onSelectCastle }: CastleSelectorProps) {
  const { character } = useGameStore()
  const [selectedCastle, setSelectedCastle] = useState<CastleType | null>(null)

  // Доступные типы замков
  const castleTypes: CastleType[] = [
    {
      id: 'wooden_castle',
      name: 'Деревянный замок',
      emoji: '🏰',
      description: 'Простой деревянный замок. Быстро строится и дешевый в обслуживании.',
      basePrice: 500,
      bonuses: {
        production: 10,
        defense: 5,
        capacity: 100
      }
    },
    {
      id: 'stone_castle',
      name: 'Каменный замок',
      emoji: '🏛️',
      description: 'Прочный каменный замок с высокой защитой.',
      basePrice: 1000,
      bonuses: {
        production: 15,
        defense: 20,
        capacity: 200
      }
    },
    {
      id: 'magic_castle',
      name: 'Магический замок',
      emoji: '✨',
      description: 'Замок, пропитанный магией. Увеличивает производство ресурсов.',
      basePrice: 1500,
      bonuses: {
        production: 30,
        defense: 15,
        capacity: 150
      }
    }
  ]

  const handleContinue = () => {
    if (selectedCastle) {
      onSelectCastle(selectedCastle)
    }
  }

  if (!character) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-white">Персонаж не найден</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-2xl font-bold text-fantasy-gold">
            👑 Строительство королевства
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Player info */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-fantasy-gold mb-2">
              {character.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>💰 Золото: <span className="text-fantasy-gold font-bold">{character.gold}</span></span>
              <span>💎 Алмазы: <span className="text-blue-400 font-bold">{character.diamonds}</span></span>
            </div>
          </div>

          {/* Castle selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-fantasy-gold mb-4">
              🏰 Выберите тип замка
            </h3>
            <div className="space-y-3">
              {castleTypes.map((castle) => {
                const canAfford = character.gold >= castle.basePrice
                return (
                  <div
                    key={castle.id}
                    onClick={() => canAfford && setSelectedCastle(castle)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCastle?.id === castle.id
                        ? 'border-fantasy-gold bg-fantasy-gold bg-opacity-20'
                        : canAfford
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                          : 'border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{castle.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-white">{castle.name}</h4>
                          <p className="text-sm text-gray-400">{castle.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${canAfford ? 'text-fantasy-gold' : 'text-red-400'}`}>
                          {castle.basePrice} 💰
                        </div>
                        {!canAfford && (
                          <div className="text-xs text-red-400">Недостаточно золота</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 text-sm">
                      <span className="flex items-center">
                        <span className="mr-1">⚡</span>
                        Производство: {castle.bonuses.production}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">🛡️</span>
                        Защита: {castle.bonuses.defense}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-1">📦</span>
                        Вместимость: {castle.bonuses.capacity}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedCastle}
              className="flex-1 px-6 py-3 bg-fantasy-gold hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedCastle ? `Выбрать место для ${selectedCastle.name}` : 'Выберите замок'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
