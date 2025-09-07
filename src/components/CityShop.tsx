'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { BASE_ITEMS, getCityById } from '@/lib/gameData'
import { Item, ShopItem } from '@/types/game'
import toast from 'react-hot-toast'

export default function CityShop() {
  const { character, selectedCity, updateCharacter, setCurrentView } = useGameStore()
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [selectedTab, setSelectedTab] = useState<'buy' | 'sell'>('buy')

  const city = selectedCity ? getCityById(selectedCity) : null

  useEffect(() => {
    // Generate shop items based on city
    if (city) {
      const cityItems = generateCityShopItems(city.race)
      setShopItems(cityItems)
    }
  }, [city])

  const generateCityShopItems = (cityRace: string): ShopItem[] => {
    // Filter items based on city race and add random prices
    const relevantItems = BASE_ITEMS.filter(item => {
      if (item.type === 'material') return true // All cities sell materials
      if (item.type === 'consumable') return true // All cities sell consumables
      
      // Race-specific items
      if (cityRace === 'human') return item.type === 'weapon' || item.type === 'armor'
      if (cityRace === 'elf') return item.type === 'weapon' && item.id.includes('staff') || item.type === 'armor'
      if (cityRace === 'orc') return item.type === 'weapon' && item.id.includes('axe') || item.type === 'armor'
      if (cityRace === 'undead') return item.type === 'weapon' && item.id.includes('dark') || item.type === 'armor'
      
      return true
    })

    return relevantItems.slice(0, 8).map(item => ({
      item,
      price: Math.round(item.value * (1 + Math.random() * 0.5)), // 100% to 150% of base value
      stock: Math.floor(Math.random() * 10) + 1,
      refreshes: true
    }))
  }

  const handleBuyItem = async (shopItem: ShopItem) => {
    if (!character) return

    if (character.gold < shopItem.price) {
      toast.error('Недостаточно золота!')
      return
    }

    if (shopItem.stock <= 0) {
      toast.error('Товар закончился!')
      return
    }

    try {
      // Add item to inventory
      const existingItem = character.inventory.find(invItem => invItem.item.id === shopItem.item.id)
      let newInventory

      if (existingItem) {
        newInventory = character.inventory.map(invItem =>
          invItem.item.id === shopItem.item.id
            ? { ...invItem, quantity: invItem.quantity + 1 }
            : invItem
        )
      } else {
        newInventory = [...character.inventory, { item: shopItem.item, quantity: 1 }]
      }

      // Update character
      await updateCharacter({
        gold: character.gold - shopItem.price,
        inventory: newInventory
      })

      // Update shop stock
      setShopItems(prev => prev.map(item =>
        item.item.id === shopItem.item.id
          ? { ...item, stock: item.stock - 1 }
          : item
      ))

      toast.success(`Куплен: ${shopItem.item.name}!`)

    } catch (error) {
      toast.error('Ошибка покупки!')
      console.error(error)
    }
  }

  const handleSellItem = async (inventoryItem: any) => {
    if (!character) return

    const sellPrice = Math.round(inventoryItem.item.value * 0.7) // 70% of base value

    try {
      // Remove item from inventory
      let newInventory
      if (inventoryItem.quantity > 1) {
        newInventory = character.inventory.map(invItem =>
          invItem.item.id === inventoryItem.item.id
            ? { ...invItem, quantity: invItem.quantity - 1 }
            : invItem
        )
      } else {
        newInventory = character.inventory.filter(invItem => invItem.item.id !== inventoryItem.item.id)
      }

      // Update character
      await updateCharacter({
        gold: character.gold + sellPrice,
        inventory: newInventory
      })

      toast.success(`Продано: ${inventoryItem.item.name} за ${sellPrice} золота!`)

    } catch (error) {
      toast.error('Ошибка продажи!')
      console.error(error)
    }
  }

  if (!character || !city) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Город не найден</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={() => setCurrentView('map')}
            className="btn-secondary mr-4"
          >
            ← Назад
          </button>
          <div className="text-center">
            <div className="text-4xl mb-2">{city.emoji}</div>
            <h1 className="text-2xl font-bold text-fantasy-gold">
              🏪 Магазин • {city.name}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center">
            <span className="text-fantasy-gold mr-1">💰</span>
            <span className="font-bold">{character.gold}</span>
            <span className="text-gray-400 ml-1">золота</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => setSelectedTab('buy')}
          className={`flex-1 py-3 px-6 font-bold rounded-l-lg transition-colors ${
            selectedTab === 'buy'
              ? 'bg-fantasy-gold text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🛒 Покупка
        </button>
        <button
          onClick={() => setSelectedTab('sell')}
          className={`flex-1 py-3 px-6 font-bold rounded-r-lg transition-colors ${
            selectedTab === 'sell'
              ? 'bg-fantasy-gold text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          💰 Продажа
        </button>
      </div>

      {/* Shop Content */}
      {selectedTab === 'buy' ? (
        // Buy Tab
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems.map((shopItem, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{shopItem.item.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-fantasy-gold">
                      {shopItem.item.name}
                    </h3>
                    <p className="text-xs text-gray-400 capitalize">
                      {shopItem.item.type} • {shopItem.item.rarity}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-3">
                {shopItem.item.description}
              </p>

              {/* Item Stats */}
              {shopItem.item.stats && (
                <div className="mb-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {shopItem.item.stats.attack && (
                      <div className="bg-red-600 bg-opacity-30 p-2 rounded">
                        ⚔️ Атака: +{shopItem.item.stats.attack}
                      </div>
                    )}
                    {shopItem.item.stats.defense && (
                      <div className="bg-blue-600 bg-opacity-30 p-2 rounded">
                        🛡️ Защита: +{shopItem.item.stats.defense}
                      </div>
                    )}
                    {shopItem.item.stats.health && (
                      <div className="bg-green-600 bg-opacity-30 p-2 rounded">
                        ❤️ Здоровье: +{shopItem.item.stats.health}
                      </div>
                    )}
                    {shopItem.item.stats.mana && (
                      <div className="bg-purple-600 bg-opacity-30 p-2 rounded">
                        💙 Мана: +{shopItem.item.stats.mana}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-fantasy-gold">
                    💰 {shopItem.price}
                  </p>
                  <p className="text-xs text-gray-400">
                    В наличии: {shopItem.stock}
                  </p>
                </div>
                <button
                  onClick={() => handleBuyItem(shopItem)}
                  disabled={character.gold < shopItem.price || shopItem.stock <= 0}
                  className={`px-4 py-2 rounded font-bold transition-colors ${
                    character.gold >= shopItem.price && shopItem.stock > 0
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Купить
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Sell Tab
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {character.inventory.length > 0 ? (
            character.inventory.map((inventoryItem, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{inventoryItem.item.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-fantasy-gold">
                        {inventoryItem.item.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Количество: {inventoryItem.quantity}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-3">
                  {inventoryItem.item.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-fantasy-gold">
                      💰 {Math.round(inventoryItem.item.value * 0.7)}
                    </p>
                    <p className="text-xs text-gray-400">
                      70% от базовой цены
                    </p>
                  </div>
                  <button
                    onClick={() => handleSellItem(inventoryItem)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors"
                  >
                    Продать
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                Инвентарь пуст
              </h3>
              <p className="text-gray-500">
                Сначала купите предметы или найдите их в приключениях!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
