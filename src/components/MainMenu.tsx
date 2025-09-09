'use client'

import { useState } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { TelegramUser } from '@/types/game'
import { Toaster } from 'react-hot-toast'
import CryptoWallet from './CryptoWallet'

interface MainMenuProps {
  user: TelegramUser | null
}

export default function MainMenu({ user }: MainMenuProps) {
  const [selectedView, setSelectedView] = useState<'menu' | 'about' | 'clans' | 'friends'>('menu')
  const { setCurrentView } = useGameStore()

  const handleStartNewGame = () => {
    setCurrentView('character-creation')
  }

  const handleSelectHero = () => {
    // TODO: Implement hero selection
    alert('Выбор героя скоро будет доступен!')
  }

  const menuItems = [
    {
      id: 'new-game',
      title: 'Начать новую игру',
      icon: '⚔️',
      description: 'Создай своего героя и начни эпическое приключение',
      action: handleStartNewGame,
      gradient: 'from-fantasy-blue-emerald to-blue-600'
    },
    {
      id: 'select-hero',
      title: 'Выбрать героя',
      icon: '👤',
      description: 'Продолжи игру за существующего персонажа',
      action: handleSelectHero,
      gradient: 'from-fantasy-emerald to-green-600'
    },
    {
      id: 'clans',
      title: 'Кланы',
      icon: '🏰',
      description: 'Присоединись к клану и сражайся вместе',
      action: () => setSelectedView('clans'),
      gradient: 'from-purple-600 to-purple-800'
    },
    {
      id: 'about',
      title: 'О игре',
      icon: '📖',
      description: 'Узнай больше о мире tgRPG',
      action: () => setSelectedView('about'),
      gradient: 'from-yellow-600 to-orange-600'
    },
    {
      id: 'friends',
      title: 'Друзья',
      icon: '👥',
      description: 'Пригласи друзей и играйте вместе',
      action: () => setSelectedView('friends'),
      gradient: 'from-blue-600 to-indigo-600'
    }
  ]

  if (selectedView === 'about') {
    return <AboutPage onBack={() => setSelectedView('menu')} />
  }

  if (selectedView === 'clans') {
    return <ClansPage onBack={() => setSelectedView('menu')} />
  }

  if (selectedView === 'friends') {
    return <FriendsPage onBack={() => setSelectedView('menu')} />
  }

  return (
    <div className="min-h-screen">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e3a8a',
            color: '#fff',
            border: '1px solid #1e40af'
          }
        }}
      />
      
      {/* Кошелек в верхней части */}
      <div className="fixed top-4 right-4 z-50">
        <CryptoWallet />
      </div>
      
      {/* Header */}
      <div className="text-center py-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">⚔️</div>
          <div className="absolute top-20 right-20 text-6xl">🏰</div>
          <div className="absolute bottom-20 left-20 text-7xl">🐉</div>
          <div className="absolute bottom-10 right-10 text-5xl">💎</div>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-fantasy-gold via-yellow-400 to-fantasy-gold bg-clip-text text-transparent">
            ⚔️ tgRPG ⚔️
          </h1>
          <p className="text-2xl text-gray-200 mb-6 font-semibold">
            Легендарная фэнтези RPG
          </p>
          
          {user && (
            <div className="bg-gradient-to-r from-fantasy-dark-blue/80 to-fantasy-emerald-dark/80 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-fantasy-gold/20 mr-20">
              <h2 className="text-xl font-semibold mb-2 text-fantasy-gold">
                🌟 Добро пожаловать, {user.first_name}!
              </h2>
              <p className="text-gray-300">
                Твоя судьба ждет в мире магии и приключений
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10 backdrop-blur-sm`}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-fantasy-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              {/* Corner Decoration */}
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-fantasy-gold/30 group-hover:border-fantasy-gold transition-colors"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-fantasy-gold/30 group-hover:border-fantasy-gold transition-colors"></div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-fantasy-dark-blue/50 to-fantasy-emerald-dark/50 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto border border-fantasy-gold/20">
            <p className="text-fantasy-gold text-lg font-semibold mb-2">
              🌟 Мир полон магии и опасностей 🌟
            </p>
            <p className="text-gray-300">
              Выбери свой путь: Люди 👨‍⚔️ | Эльфы 🧝‍♀️ | Нежить ☠️ | Орки 👹
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// About Page Component
function AboutPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen container mx-auto px-6 py-12">
      <CryptoWallet />
      <button 
        onClick={onBack}
        className="mb-8 bg-gradient-to-r from-fantasy-blue-emerald to-blue-600 hover:from-blue-600 hover:to-fantasy-blue-emerald px-6 py-3 rounded-xl font-bold transition-all duration-300"
      >
        ← Назад в меню
      </button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-fantasy-gold to-yellow-400 bg-clip-text text-transparent">
          📖 О игре tgRPG
        </h1>
        
        <div className="grid gap-8">
          <div className="bg-gradient-to-r from-fantasy-dark-blue/80 to-fantasy-emerald-dark/80 backdrop-blur-sm rounded-2xl p-8 border border-fantasy-gold/20">
            <h2 className="text-2xl font-bold mb-4 text-fantasy-gold">🌍 Мир Арканум</h2>
            <p className="text-gray-200 leading-relaxed mb-4">
              Добро пожаловать в мистический мир Арканум — землю, где магия течет в венах самой реальности, 
              а древние секреты скрыты в глубинах забытых подземелий. Здесь четыре великие расы борются 
              за власть и выживание в мире, полном чудес и опасностей.
            </p>
            <p className="text-gray-200 leading-relaxed">
              Твоя судьба начинается сегодня. Станешь ли ты легендарным героем, чье имя будут помнить века, 
              или падешь в забвение, как многие до тебя? Выбор за тобой, искатель приключений!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-900/80 to-fantasy-dark-red/80 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
              <h3 className="text-xl font-bold mb-3 text-red-400">⚔️ Эпические Битвы</h3>
              <p className="text-gray-300 text-sm">
                Сражайся с могущественными драконами, хитрыми гоблинами и древними личами. 
                Каждая битва — это тест твоей стратегии и мастерства.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-900/80 to-fantasy-emerald-dark/80 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
              <h3 className="text-xl font-bold mb-3 text-green-400">🏰 Восемь Городов</h3>
              <p className="text-gray-300 text-sm">
                Исследуй уникальные города, каждый со своей культурой, торговцами и тайнами. 
                От величественной Столицы до мрачного Некрополиса.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold mb-3 text-purple-400">🔮 Магия и Крафт</h3>
              <p className="text-gray-300 text-sm">
                Изучай древние заклинания и создавай легендарное оружие. 
                Твои творения могут изменить ход истории.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/80 to-orange-900/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">👥 Кланы и Альянсы</h3>
              <p className="text-gray-300 text-sm">
                Объединяйся с другими игроками, создавай могущественные кланы 
                и участвуй в масштабных войнах за территории.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Clans Page Component
function ClansPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen container mx-auto px-6 py-12">
      <CryptoWallet />
      <button 
        onClick={onBack}
        className="mb-8 bg-gradient-to-r from-fantasy-blue-emerald to-blue-600 hover:from-blue-600 hover:to-fantasy-blue-emerald px-6 py-3 rounded-xl font-bold transition-all duration-300"
      >
        ← Назад в меню
      </button>
      
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-fantasy-gold to-yellow-400 bg-clip-text text-transparent">
          🏰 Кланы
        </h1>
        
        <div className="bg-gradient-to-r from-fantasy-dark-red/80 to-fantasy-emerald-dark/80 backdrop-blur-sm rounded-2xl p-12 border border-fantasy-gold/20">
          <div className="text-8xl mb-6">⚒️</div>
          <h2 className="text-2xl font-bold mb-4 text-fantasy-gold">В разработке</h2>
          <p className="text-gray-300 text-lg mb-6">
            Система кланов находится в стадии разработки. Скоро вы сможете:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-3">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">Создавать и вступать в кланы</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">Участвовать в клановых войнах</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">Строить клановые замки</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">Торговать ресурсами</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Friends Page Component
function FriendsPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen container mx-auto px-6 py-12">
      <CryptoWallet />
      <button 
        onClick={onBack}
        className="mb-8 bg-gradient-to-r from-fantasy-blue-emerald to-blue-600 hover:from-blue-600 hover:to-fantasy-blue-emerald px-6 py-3 rounded-xl font-bold transition-all duration-300"
      >
        ← Назад в меню
      </button>
      
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-fantasy-gold to-yellow-400 bg-clip-text text-transparent">
          👥 Друзья
        </h1>
        
        <div className="bg-gradient-to-r from-fantasy-dark-red/80 to-fantasy-emerald-dark/80 backdrop-blur-sm rounded-2xl p-12 border border-fantasy-gold/20">
          <div className="text-8xl mb-6">🤝</div>
          <h2 className="text-2xl font-bold mb-4 text-fantasy-gold">Система друзей</h2>
          <p className="text-gray-300 text-lg mb-6">
            Пригласи своих друзей в мир tgRPG и получи эксклюзивные награды!
          </p>
          <div className="bg-fantasy-dark-red/50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-3 text-fantasy-gold">🎁 Награды за приглашения:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400">⭐</span>
                <span className="text-gray-300">1000 золота за каждого друга</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-purple-400">💎</span>
                <span className="text-gray-300">Редкие предметы</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">🏆</span>
                <span className="text-gray-300">Эксклюзивные титулы</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400">⚡</span>
                <span className="text-gray-300">Бонус к опыту</span>
              </div>
            </div>
          </div>
          <button className="bg-gradient-to-r from-fantasy-emerald to-green-600 hover:from-green-600 hover:to-fantasy-emerald px-8 py-3 rounded-xl font-bold transition-all duration-300">
            📱 Пригласить друзей
          </button>
        </div>
      </div>
    </div>
  )
}
