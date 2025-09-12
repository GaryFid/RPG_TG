'use client'

import { useState, useMemo } from 'react'
import { useGameStore } from '@/stores/gameStore'

interface CraftingRecipe {
  id: string
  name: string
  description: string
  emoji: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  ingredients: {
    id: string
    name: string
    emoji: string
    quantity: number
  }[]
  result: {
    id: string
    name: string
    emoji: string
    quantity: number
    stats?: {
      attack?: number
      defense?: number
      health?: number
      mana?: number
    }
  }
  craftingTime: number // в секундах
  requiredLevel: number
  goldCost: number
}

interface CraftingSlot {
  id: number
  item: {
    id: string
    name: string
    emoji: string
    quantity: number
  } | null
}

export default function CraftingSystem() {
  const { character, setCurrentView } = useGameStore()
  const [craftingSlots, setCraftingSlots] = useState<CraftingSlot[]>([
    { id: 1, item: null },
    { id: 2, item: null },
    { id: 3, item: null },
    { id: 4, item: null },
    { id: 5, item: null }
  ])
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null)
  const [isCrafting, setIsCrafting] = useState(false)

  // Доступные предметы для крафта (моковые данные)
  const availableItems = [
    { id: 'wood', name: 'Дерево', emoji: '🪵', quantity: 50 },
    { id: 'stone', name: 'Камень', emoji: '🪨', quantity: 30 },
    { id: 'iron', name: 'Железо', emoji: '⚙️', quantity: 20 },
    { id: 'leather', name: 'Кожа', emoji: '🦬', quantity: 15 },
    { id: 'magic_crystal', name: 'Магический кристалл', emoji: '💎', quantity: 5 },
    { id: 'herb', name: 'Трава', emoji: '🌿', quantity: 25 },
    { id: 'old_sword', name: 'Старый меч', emoji: '⚔️', quantity: 1 },
    { id: 'old_armor', name: 'Старая броня', emoji: '🛡️', quantity: 1 }
  ]

  // Рецепты крафта
  const recipes: CraftingRecipe[] = useMemo(() => [
    {
      id: 'iron_sword',
      name: 'Железный меч',
      description: 'Прочный меч из качественного железа',
      emoji: '⚔️',
      rarity: 'uncommon',
      ingredients: [
        { id: 'iron', name: 'Железо', emoji: '⚙️', quantity: 3 },
        { id: 'wood', name: 'Дерево', emoji: '🪵', quantity: 2 }
      ],
      result: {
        id: 'iron_sword',
        name: 'Железный меч',
        emoji: '⚔️',
        quantity: 1,
        stats: { attack: 25 }
      },
      craftingTime: 300,
      requiredLevel: 5,
      goldCost: 100
    },
    {
      id: 'leather_armor',
      name: 'Кожаная броня',
      description: 'Легкая и гибкая защита',
      emoji: '🦺',
      rarity: 'common',
      ingredients: [
        { id: 'leather', name: 'Кожа', emoji: '🦬', quantity: 4 },
        { id: 'iron', name: 'Железо', emoji: '⚙️', quantity: 1 }
      ],
      result: {
        id: 'leather_armor',
        name: 'Кожаная броня',
        emoji: '🦺',
        quantity: 1,
        stats: { defense: 15 }
      },
      craftingTime: 240,
      requiredLevel: 3,
      goldCost: 75
    },
    {
      id: 'health_potion',
      name: 'Зелье лечения',
      description: 'Восстанавливает здоровье',
      emoji: '🧪',
      rarity: 'common',
      ingredients: [
        { id: 'herb', name: 'Трава', emoji: '🌿', quantity: 3 },
        { id: 'magic_crystal', name: 'Магический кристалл', emoji: '💎', quantity: 1 }
      ],
      result: {
        id: 'health_potion',
        name: 'Зелье лечения',
        emoji: '🧪',
        quantity: 2,
        stats: { health: 50 }
      },
      craftingTime: 120,
      requiredLevel: 2,
      goldCost: 50
    },
    {
      id: 'magic_sword',
      name: 'Магический меч',
      description: 'Меч, наполненный магической силой',
      emoji: '✨',
      rarity: 'epic',
      ingredients: [
        { id: 'old_sword', name: 'Старый меч', emoji: '⚔️', quantity: 1 },
        { id: 'magic_crystal', name: 'Магический кристалл', emoji: '💎', quantity: 3 },
        { id: 'iron', name: 'Железо', emoji: '⚙️', quantity: 5 }
      ],
      result: {
        id: 'magic_sword',
        name: 'Магический меч',
        emoji: '✨',
        quantity: 1,
        stats: { attack: 45, mana: 20 }
      },
      craftingTime: 600,
      requiredLevel: 10,
      goldCost: 500
    },
    {
      id: 'reinforced_armor',
      name: 'Усиленная броня',
      description: 'Броня с железными пластинами',
      emoji: '🛡️',
      rarity: 'rare',
      ingredients: [
        { id: 'old_armor', name: 'Старая броня', emoji: '🛡️', quantity: 1 },
        { id: 'iron', name: 'Железо', emoji: '⚙️', quantity: 4 },
        { id: 'leather', name: 'Кожа', emoji: '🦬', quantity: 2 }
      ],
      result: {
        id: 'reinforced_armor',
        name: 'Усиленная броня',
        emoji: '🛡️',
        quantity: 1,
        stats: { defense: 35, health: 25 }
      },
      craftingTime: 450,
      requiredLevel: 8,
      goldCost: 300
    }
  ], [])

  // Находим подходящие рецепты по ингредиентам
  const possibleRecipes = useMemo(() => {
    const filledSlots = craftingSlots.filter(slot => slot.item !== null)
    if (filledSlots.length < 2) return []

    return recipes.filter(recipe => {
      // Проверяем, есть ли все необходимые ингредиенты
      return recipe.ingredients.every(ingredient => {
        const slotWithIngredient = filledSlots.find(slot => 
          slot.item?.id === ingredient.id && slot.item.quantity >= ingredient.quantity
        )
        return slotWithIngredient !== undefined
      }) && recipe.ingredients.length <= filledSlots.length
    })
  }, [craftingSlots, recipes])

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

  const addItemToSlot = (slotId: number, item: typeof availableItems[0]) => {
    setCraftingSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, item } : slot
    ))
  }

  const removeItemFromSlot = (slotId: number) => {
    setCraftingSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, item: null } : slot
    ))
  }

  const clearAllSlots = () => {
    setCraftingSlots(prev => prev.map(slot => ({ ...slot, item: null })))
    setSelectedRecipe(null)
  }

  const handleCraft = async () => {
    if (!selectedRecipe || !character) return

    setIsCrafting(true)
    try {
      // Симуляция крафта
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Создано: ${selectedRecipe.result.emoji} ${selectedRecipe.result.name}!`)
      clearAllSlots()
    } catch (error) {
      alert('Ошибка крафта!')
    } finally {
      setIsCrafting(false)
    }
  }

  if (!character) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-400">Персонаж не найден</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-fantasy-gold mb-2">
          🔨 Мастерская крафта
        </h1>
        <p className="text-gray-300">
          Создавайте новые предметы, комбинируя ресурсы
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая панель - доступные предметы */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">📦 Ресурсы</h2>
          <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    const emptySlot = craftingSlots.find(slot => slot.item === null)
                    if (emptySlot) {
                      addItemToSlot(emptySlot.id, item)
                    }
                  }}
                >
                  <div className="text-2xl text-center mb-1">{item.emoji}</div>
                  <div className="text-xs text-center text-white">{item.name}</div>
                  <div className="text-xs text-center text-fantasy-gold">×{item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Центральная панель - крафтинг */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">⚗️ Крафт-стол</h2>
          
          {/* Слоты для крафта */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-5 gap-2 mb-4">
              {craftingSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="aspect-square border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => slot.item && removeItemFromSlot(slot.id)}
                >
                  {slot.item ? (
                    <div className="text-center">
                      <div className="text-2xl">{slot.item.emoji}</div>
                      <div className="text-xs text-fantasy-gold">×{slot.item.quantity}</div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-2xl">+</div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={clearAllSlots}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
              >
                Очистить
              </button>
              {selectedRecipe && (
                <button
                  onClick={handleCraft}
                  disabled={isCrafting}
                  className="flex-1 px-4 py-2 bg-fantasy-gold hover:bg-yellow-500 text-black font-bold rounded transition-colors disabled:opacity-50"
                >
                  {isCrafting ? 'Создаем...' : 'Создать'}
                </button>
              )}
            </div>
          </div>

          {/* Результат крафта */}
          {selectedRecipe && (
            <div className={`${getRarityBg(selectedRecipe.rarity)} rounded-lg p-4 border border-gray-600`}>
              <h3 className="text-lg font-semibold text-white mb-2">🎯 Результат</h3>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{selectedRecipe.result.emoji}</div>
                <div>
                  <div className={`font-semibold ${getRarityColor(selectedRecipe.rarity)}`}>
                    {selectedRecipe.result.name} ×{selectedRecipe.result.quantity}
                  </div>
                  <div className="text-sm text-gray-400">{selectedRecipe.description}</div>
                  {selectedRecipe.result.stats && (
                    <div className="text-xs text-fantasy-gold mt-1">
                      {Object.entries(selectedRecipe.result.stats).map(([stat, value]) => (
                        <span key={stat} className="mr-2">
                          {stat === 'attack' && '⚔️'}{stat === 'defense' && '🛡️'}
                          {stat === 'health' && '❤️'}{stat === 'mana' && '💙'}
                          +{value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Правая панель - доступные рецепты */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">📜 Рецепты</h2>
          <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
            {possibleRecipes.length > 0 ? (
              <div className="space-y-2">
                {possibleRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRecipe?.id === recipe.id
                        ? 'bg-fantasy-gold bg-opacity-20 border border-fantasy-gold'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{recipe.result.emoji}</span>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${getRarityColor(recipe.rarity)}`}>
                          {recipe.result.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          💰 {recipe.goldCost} | ⏱️ {Math.floor(recipe.craftingTime / 60)}м
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">🔍</div>
                <p>Добавьте предметы в слоты для поиска рецептов</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
