'use client'

import { useState } from 'react'
import { useGameStore } from '@/stores/gameStore'

interface InventoryItem {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'consumable' | 'misc'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  value: number
  description: string
  icon: string
  quantity?: number
  stats?: {
    attack?: number
    defense?: number
    health?: number
    mana?: number
  }
}

export default function Inventory() {
  const { character, setCurrentView: setGameView } = useGameStore()
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [filter, setFilter] = useState<'all' | 'weapon' | 'armor' | 'consumable' | 'misc'>('all')
  const [currentView, setCurrentView] = useState<'inventory' | 'shop'>('inventory')

  // Моковые данные инвентаря
  const inventoryItems: InventoryItem[] = [
    {
      id: 'sword_1',
      name: 'Стальной меч',
      type: 'weapon',
      rarity: 'common',
      value: 150,
      description: 'Простой стальной меч. Надежное оружие для начинающих воинов.',
      icon: '⚔️',
      stats: { attack: 15 }
    },
    {
      id: 'shield_1',
      name: 'Деревянный щит',
      type: 'armor',
      rarity: 'common',
      value: 80,
      description: 'Легкий деревянный щит. Обеспечивает базовую защиту.',
      icon: '🛡️',
      stats: { defense: 10 }
    },
    {
      id: 'potion_1',
      name: 'Зелье лечения',
      type: 'consumable',
      rarity: 'common',
      value: 25,
      description: 'Восстанавливает 50 единиц здоровья.',
      icon: '🧪',
      quantity: 3,
      stats: { health: 50 }
    },
    {
      id: 'staff_1',
      name: 'Посох магии',
      type: 'weapon',
      rarity: 'rare',
      value: 500,
      description: 'Древний посох, усиливающий магические способности.',
      icon: '🔮',
      stats: { mana: 30, attack: 8 }
    },
    {
      id: 'armor_1',
      name: 'Кольчуга',
      type: 'armor',
      rarity: 'uncommon',
      value: 200,
      description: 'Прочная кольчуга из железных колец.',
      icon: '🦺',
      stats: { defense: 20 }
    },
    {
      id: 'gem_1',
      name: 'Рубин',
      type: 'misc',
      rarity: 'epic',
      value: 1000,
      description: 'Драгоценный рубин. Можно продать за хорошую цену.',
      icon: '💎'
    }
  ]

  // Товары в магазине
  const shopItems: InventoryItem[] = [
    {
      id: 'iron_sword',
      name: 'Железный меч',
      type: 'weapon',
      rarity: 'uncommon',
      value: 300,
      description: 'Качественный железный меч. Острый и надежный.',
      icon: '⚔️',
      stats: { attack: 25 }
    },
    {
      id: 'leather_armor',
      name: 'Кожаная броня',
      type: 'armor',
      rarity: 'common',
      value: 200,
      description: 'Легкая кожаная броня. Обеспечивает базовую защиту.',
      icon: '🦺',
      stats: { defense: 15 }
    },
    {
      id: 'health_potion',
      name: 'Большое зелье лечения',
      type: 'consumable',
      rarity: 'uncommon',
      value: 50,
      description: 'Восстанавливает 100 единиц здоровья.',
      icon: '🧪',
      quantity: 10,
      stats: { health: 100 }
    },
    {
      id: 'magic_staff',
      name: 'Волшебный посох',
      type: 'weapon',
      rarity: 'epic',
      value: 800,
      description: 'Мощный посох, пропитанный древней магией.',
      icon: '🔮',
      stats: { mana: 50, attack: 15 }
    },
    {
      id: 'steel_helmet',
      name: 'Стальной шлем',
      type: 'armor',
      rarity: 'uncommon',
      value: 250,
      description: 'Прочный стальной шлем. Защищает голову от ударов.',
      icon: '⛑️',
      stats: { defense: 18 }
    },
    {
      id: 'diamond',
      name: 'Алмаз',
      type: 'misc',
      rarity: 'legendary',
      value: 2000,
      description: 'Редчайший алмаз невероятной чистоты.',
      icon: '💎'
    }
  ]

  const filteredItems = (currentView === 'inventory' ? inventoryItems : shopItems).filter(item => 
    filter === 'all' || item.type === filter
  )

  const handleBuyItem = (item: InventoryItem) => {
    if (!character || character.gold < item.value) {
      alert('Недостаточно золота!')
      return
    }
    
    if (confirm(`Купить ${item.name} за ${item.value} золота?`)) {
      alert(`Куплено: ${item.name} за ${item.value} золота`)
      // TODO: Implement buying logic
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400'
      case 'uncommon': return 'text-green-400'
      case 'rare': return 'text-blue-400'
      case 'epic': return 'text-purple-400'
      case 'legendary': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-800'
      case 'uncommon': return 'bg-green-900'
      case 'rare': return 'bg-blue-900'
      case 'epic': return 'bg-purple-900'
      case 'legendary': return 'bg-yellow-900'
      default: return 'bg-gray-800'
    }
  }

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item)
  }

  const handleUseItem = (item: InventoryItem) => {
    if (item.type === 'consumable') {
      alert(`Использовано: ${item.name}`)
      // TODO: Implement item usage logic
    } else {
      alert(`${item.name} нельзя использовать напрямую`)
    }
  }

  const handleSellItem = (item: InventoryItem) => {
    if (confirm(`Продать ${item.name} за ${item.value} золота?`)) {
      alert(`Продано: ${item.name} за ${item.value} золота`)
      // TODO: Implement selling logic
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-fantasy-gold mb-2">
          {currentView === 'inventory' ? '🎒 Инвентарь' : '🏪 Магазин'}
        </h1>
        <p className="text-gray-300">
          {currentView === 'inventory' ? 'Управление предметами персонажа' : 'Покупка снаряжения и предметов'}
        </p>
      </div>

      {/* Переключатель */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-700 rounded-lg p-1 flex">
          <button
            onClick={() => setCurrentView('inventory')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'inventory'
                ? 'bg-fantasy-gold text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🎒 Инвентарь
          </button>
          <button
            onClick={() => setCurrentView('shop')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'shop'
                ? 'bg-fantasy-gold text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🏪 Магазин
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список предметов */}
        <div className="lg:col-span-2">
          {/* Фильтры */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-fantasy-gold text-black'
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter('weapon')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'weapon'
                  ? 'bg-fantasy-gold text-black'
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              ⚔️ Оружие
            </button>
            <button
              onClick={() => setFilter('armor')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'armor'
                  ? 'bg-fantasy-gold text-black'
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              🛡️ Броня
            </button>
            <button
              onClick={() => setFilter('consumable')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'consumable'
                  ? 'bg-fantasy-gold text-black'
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              🧪 Расходники
            </button>
            <button
              onClick={() => setFilter('misc')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'misc'
                  ? 'bg-fantasy-gold text-black'
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              💎 Прочее
            </button>
          </div>

          {/* Сетка предметов */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`${getRarityBg(item.rarity)} border-2 border-gray-600 rounded-lg p-4 cursor-pointer hover:border-fantasy-gold transition-all duration-300 ${
                  selectedItem?.id === item.id ? 'ring-2 ring-fantasy-gold' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className={`font-bold text-sm ${getRarityColor(item.rarity)}`}>
                    {item.name}
                  </h3>
                  {item.quantity && (
                    <p className="text-xs text-gray-400 mt-1">
                      x{item.quantity}
                    </p>
                  )}
                  <p className="text-xs text-fantasy-gold mt-1">
                    {item.value} золота
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-400 text-lg">Нет предметов в этой категории</p>
            </div>
          )}
        </div>

        {/* Детали предмета */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{selectedItem.icon}</div>
                <h2 className={`text-xl font-bold ${getRarityColor(selectedItem.rarity)}`}>
                  {selectedItem.name}
                </h2>
                <p className="text-sm text-gray-400 capitalize">
                  {selectedItem.rarity} {selectedItem.type}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-gray-300 text-sm">
                  {selectedItem.description}
                </p>

                {selectedItem.stats && (
                  <div className="bg-gray-700 rounded p-3">
                    <h4 className="text-fantasy-gold font-bold mb-2">Характеристики:</h4>
                    <div className="space-y-1">
                      {selectedItem.stats.attack && (
                        <div className="flex justify-between text-sm">
                          <span>Атака:</span>
                          <span className="text-red-400">+{selectedItem.stats.attack}</span>
                        </div>
                      )}
                      {selectedItem.stats.defense && (
                        <div className="flex justify-between text-sm">
                          <span>Защита:</span>
                          <span className="text-blue-400">+{selectedItem.stats.defense}</span>
                        </div>
                      )}
                      {selectedItem.stats.health && (
                        <div className="flex justify-between text-sm">
                          <span>Здоровье:</span>
                          <span className="text-green-400">+{selectedItem.stats.health}</span>
                        </div>
                      )}
                      {selectedItem.stats.mana && (
                        <div className="flex justify-between text-sm">
                          <span>Мана:</span>
                          <span className="text-purple-400">+{selectedItem.stats.mana}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>Стоимость:</span>
                  <span className="text-fantasy-gold font-bold">
                    {selectedItem.value} золота
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {currentView === 'inventory' ? (
                  <>
                    <button
                      onClick={() => handleUseItem(selectedItem)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Использовать
                    </button>
                    <button
                      onClick={() => handleSellItem(selectedItem)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Продать
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleBuyItem(selectedItem)}
                    className="w-full bg-fantasy-gold hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-colors"
                  >
                    💰 Купить за {selectedItem.value} золота
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">👆</div>
              <p className="text-gray-400">
                Выберите предмет для просмотра деталей
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Кнопка возврата */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setGameView('game')}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
        >
          ← Вернуться в игру
        </button>
      </div>
    </div>
  )
}
