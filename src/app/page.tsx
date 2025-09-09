'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import CharacterCreation from '@/components/CharacterCreation'
import WorldMap from '@/components/WorldMap'
import CityShop from '@/components/CityShop'
import Inventory from '@/components/Inventory'
import HutManager from '@/components/HutManager'
import MainMenu from '@/components/MainMenu'
import CryptoWallet from '@/components/CryptoWallet'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const {
    user,
    isLoading,
    character,
    characterExists,
    currentView,
    isAuthenticated,
    initializeUser,
    showNotification,
    notificationMessage,
    notificationType,
    hideNotification
  } = useGameStore()

  useEffect(() => {
    // Initialize Telegram WebApp
    const initTelegramApp = async () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        
        // Expand the WebApp
        tg.expand()
        
        // Set theme colors
        tg.setHeaderColor('#1e3a8a')
        tg.setBackgroundColor('#1e3a8a')
        
        // Get user data and initialize
        if (tg.initDataUnsafe?.user) {
          await initializeUser(tg.initDataUnsafe.user)
        }
      } else {
        // For development/testing outside Telegram
        const testUser = {
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser'
        }
        await initializeUser(testUser)
      }
    }

    initTelegramApp()
  }, [initializeUser])

  // Handle notifications
  useEffect(() => {
    if (showNotification && notificationMessage) {
      const toastType = notificationType === 'success' ? toast.success
                      : notificationType === 'error' ? toast.error
                      : notificationType === 'warning' ? toast.error
                      : toast
      
      toastType(notificationMessage)
      hideNotification()
    }
  }, [showNotification, notificationMessage, notificationType, hideNotification])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-fantasy-gold mx-auto mb-4"></div>
          <p className="text-fantasy-gold text-lg">Загрузка игры...</p>
        </div>
      </div>
    )
  }

  // Show character creation if user doesn't have a character
  if (isAuthenticated && !characterExists && currentView === 'character-creation') {
    return (
      <div>
        <CryptoWallet />
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151'
            }
          }}
        />
        <CharacterCreation />
      </div>
    )
  }

  // Show different game views based on currentView
  if (isAuthenticated && characterExists && character) {
    return (
      <div>
        <CryptoWallet />
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151'
            }
          }}
        />
        {currentView === 'game' && <GameInterface character={character} />}
        {currentView === 'map' && <WorldMap />}
        {currentView === 'shop' && <CityShop />}
        {currentView === 'inventory' && <Inventory />}
        {currentView === 'huts' && <HutManager />}
        {/* Add other views as needed */}
      </div>
    )
  }

  // Fallback - show welcome screen
  return (
    <MainMenu user={user} />
  )
}

// Главный игровой интерфейс
function GameInterface({ character }: { character: any }) {
  const { setCurrentView } = useGameStore()
  
  return (
    <div className="container mx-auto px-4 py-8 pr-0 sm:pr-24">
      {/* Character Info Card */}
      <div className="card mb-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-fantasy-gold mb-2">
            {character.race === 'human' && '👨‍⚔️'}
            {character.race === 'elf' && '🧝‍♀️'}
            {character.race === 'undead' && '☠️'}
            {character.race === 'orc' && '👹'}
            {' '}{character.name}
          </h2>
          <p className="text-gray-300">
            Уровень {character.level} • {character.race}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* Health & Mana Bars */}
            <div className="space-y-2 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>❤️ Здоровье</span>
                  <span>{character.health}/{character.max_health}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full" 
                    style={{width: `${(character.health / character.max_health) * 100}%`}}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>💙 Мана</span>
                  <span>{character.mana}/{character.max_mana}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full" 
                    style={{width: `${(character.mana / character.max_mana) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Experience and Gold */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>⭐ Опыт</span>
                <span>{character.experience} XP</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>💰 Золото</span>
                <span className="text-fantasy-gold font-bold">{character.gold}</span>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-600 bg-opacity-30 p-3 rounded text-center">
              <p className="text-red-300 text-sm">💪 Сила</p>
              <p className="text-xl font-bold">{character.strength}</p>
            </div>
            <div className="bg-green-600 bg-opacity-30 p-3 rounded text-center">
              <p className="text-green-300 text-sm">🏃 Ловкость</p>
              <p className="text-xl font-bold">{character.agility}</p>
            </div>
            <div className="bg-blue-600 bg-opacity-30 p-3 rounded text-center">
              <p className="text-blue-300 text-sm">🧠 Интеллект</p>
              <p className="text-xl font-bold">{character.intelligence}</p>
            </div>
            <div className="bg-purple-600 bg-opacity-30 p-3 rounded text-center">
              <p className="text-purple-300 text-sm">❤️ Выносливость</p>
              <p className="text-xl font-bold">{character.vitality}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => setCurrentView('map')}
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer text-center p-6"
        >
          <div className="text-4xl mb-2">🗺️</div>
          <h3 className="text-lg font-semibold text-fantasy-gold mb-1">Карта мира</h3>
          <p className="text-sm text-gray-400">Путешествуй между городами</p>
        </button>

        <button 
          onClick={() => alert('Битвы скоро будут доступны!')}
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer text-center p-6 opacity-75"
        >
          <div className="text-4xl mb-2">⚔️</div>
          <h3 className="text-lg font-semibold text-fantasy-gold mb-1">Битвы</h3>
          <p className="text-sm text-gray-400">Сражайся с монстрами</p>
        </button>

        <button 
          onClick={() => setCurrentView('inventory')}
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer text-center p-6"
        >
          <div className="text-4xl mb-2">🎒</div>
          <h3 className="text-lg font-semibold text-fantasy-gold mb-1">Инвентарь</h3>
          <p className="text-sm text-gray-400">Управляй предметами</p>
        </button>

        <button 
          onClick={() => setCurrentView('huts')}
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer text-center p-6"
        >
          <div className="text-4xl mb-2">🏠</div>
          <h3 className="text-lg font-semibold text-fantasy-gold mb-1">Хижины</h3>
          <p className="text-sm text-gray-400">Управляй владениями</p>
        </button>

        <button 
          onClick={() => alert('Крафт скоро!')}
          className="card hover:shadow-lg transition-all duration-300 cursor-pointer text-center p-6 opacity-75"
        >
          <div className="text-4xl mb-2">🔨</div>
          <h3 className="text-lg font-semibold text-fantasy-gold mb-1">Крафт</h3>
          <p className="text-sm text-gray-400">Создавай предметы</p>
        </button>
      </div>

      {/* Recent Activity or Tips */}
      <div className="card">
        <h3 className="text-xl font-semibold text-fantasy-gold mb-4">
          🎯 Советы для новичков
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-600 bg-opacity-20 p-4 rounded">
            <h4 className="font-semibold text-blue-300 mb-2">🗺️ Исследование</h4>
            <p className="text-sm text-gray-300">
              Посети все 8 городов, каждый имеет уникальные товары и квесты
            </p>
          </div>
          <div className="bg-green-600 bg-opacity-20 p-4 rounded">
            <h4 className="font-semibold text-green-300 mb-2">💰 Торговля</h4>
            <p className="text-sm text-gray-300">
              Покупай дешево в одних городах, продавай дорого в других
            </p>
          </div>
          <div className="bg-red-600 bg-opacity-20 p-4 rounded">
            <h4 className="font-semibold text-red-300 mb-2">⚔️ Боевая система</h4>
            <p className="text-sm text-gray-300">
              Скоро: сражения с монстрами, получение опыта и лута
            </p>
          </div>
          <div className="bg-purple-600 bg-opacity-20 p-4 rounded">
            <h4 className="font-semibold text-purple-300 mb-2">🔨 Крафт</h4>
            <p className="text-sm text-gray-300">
              Создавай мощное оружие и броню из найденных материалов
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
