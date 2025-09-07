'use client'

import { useState } from 'react'
import { useGameStore } from '@/stores/gameStore'

interface CryptoBalance {
  symbol: string
  name: string
  balance: number
  icon: string
  color: string
  usdValue: number
}

export default function CryptoWallet() {
  const [isOpen, setIsOpen] = useState(false)
  const { character } = useGameStore()

  // Моковые данные для криптовалют (в реальном приложении будут из API)
  const cryptoBalances: CryptoBalance[] = [
    {
      symbol: 'TON',
      name: 'Toncoin',
      balance: 1250.75,
      icon: '🟡',
      color: 'text-yellow-400',
      usdValue: 1250.75 * 2.5 // Примерный курс
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      balance: 89.25,
      icon: '🟣',
      color: 'text-purple-400',
      usdValue: 89.25 * 95.5
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.125,
      icon: '🟠',
      color: 'text-orange-400',
      usdValue: 0.125 * 45000
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 2.75,
      icon: '🔵',
      color: 'text-blue-400',
      usdValue: 2.75 * 3200
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      balance: 5000.00,
      icon: '🟢',
      color: 'text-green-400',
      usdValue: 5000.00
    }
  ]

  const totalUsdValue = cryptoBalances.reduce((sum, crypto) => sum + crypto.usdValue, 0)

  const handleDeposit = (symbol: string) => {
    // TODO: Implement deposit logic
    alert(`Пополнение ${symbol} скоро будет доступно!`)
  }

  const handleWithdraw = (symbol: string) => {
    // TODO: Implement withdrawal logic
    alert(`Вывод ${symbol} скоро будет доступно!`)
  }

  return (
    <div className="relative">
      {/* Burger Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-fantasy-blue-emerald to-blue-600 hover:from-blue-600 hover:to-fantasy-blue-emerald p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-fantasy-gold/20 group"
      >
        <div className="flex items-center space-x-2">
          <div className="text-2xl">💰</div>
          <div className="text-right">
            <div className="text-xs text-gray-300">Кошелек</div>
            <div className="text-sm font-bold text-fantasy-gold">
              ${totalUsdValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-fantasy-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="fixed top-20 right-4 z-40 w-80 bg-gradient-to-br from-fantasy-dark-blue/95 to-fantasy-emerald-dark/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-fantasy-gold/20 p-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-fantasy-gold flex items-center">
              💎 Криптокошелек
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Total Portfolio Value */}
          <div className="bg-gradient-to-r from-fantasy-gold/20 to-yellow-400/20 rounded-xl p-4 mb-6 border border-fantasy-gold/30">
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-1">Общая стоимость портфеля</div>
              <div className="text-2xl font-bold text-fantasy-gold">
                ${totalUsdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Crypto Balances */}
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {cryptoBalances.map((crypto) => (
              <div
                key={crypto.symbol}
                className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-gray-600/30 hover:border-fantasy-gold/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{crypto.icon}</div>
                    <div>
                      <div className="font-bold text-white">{crypto.symbol}</div>
                      <div className="text-xs text-gray-400">{crypto.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${crypto.color}`}>
                      {crypto.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                    </div>
                    <div className="text-xs text-gray-400">
                      ${crypto.usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setIsOpen(false)
                alert('Пополнение кошелька скоро будет доступно!')
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>💳</span>
              <span>Пополнить</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false)
                alert('Вывод средств скоро будет доступен!')
              }}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>💸</span>
              <span>Вывод</span>
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-400">
              💡 Подключите Web3 кошелек для управления средствами
            </div>
          </div>
        </div>
  )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
