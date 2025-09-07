'use client'

import { useState } from 'react'
import { Race } from '@/types/game'
import { useGameStore } from '@/stores/gameStore'
import { RACES } from '@/lib/gameData'

export default function CharacterCreation() {
  const [characterName, setCharacterName] = useState('')
  const [selectedRace, setSelectedRace] = useState<Race | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  const { createCharacter, isLoading } = useGameStore()
  
  const handleCreateCharacter = async () => {
    if (!characterName.trim() || !selectedRace) {
      alert('Пожалуйста, введите имя персонажа и выберите расу')
      return
    }
    
    if (characterName.length < 2 || characterName.length > 20) {
      alert('Имя персонажа должно быть от 2 до 20 символов')
      return
    }
    
    setIsCreating(true)
    const success = await createCharacter(characterName.trim(), selectedRace)
    setIsCreating(false)
    
    if (!success) {
      alert('Ошибка создания персонажа. Попробуйте снова.')
    }
  }
  
  if (isLoading || isCreating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-fantasy-gold mx-auto mb-4"></div>
          <p className="text-fantasy-gold text-lg">
            {isCreating ? 'Создаем персонажа...' : 'Загрузка...'}
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-fantasy-gold mb-4">
          ⚔️ Создание Персонажа ⚔️
        </h1>
        <p className="text-gray-300">
          Выберите имя и расу для вашего героя
        </p>
      </div>
      
      {/* Character Name Input */}
      <div className="card mb-6">
        <h3 className="text-xl font-semibold mb-4 text-fantasy-gold">
          📝 Имя персонажа
        </h3>
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Введите имя героя..."
          maxLength={20}
          className="input-field text-lg"
        />
        <p className="text-sm text-gray-400 mt-2">
          От 2 до 20 символов
        </p>
      </div>
      
      {/* Race Selection */}
      <div className="card mb-6">
        <h3 className="text-xl font-semibold mb-4 text-fantasy-gold">
          🧬 Выбор расы
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(RACES).map(([raceKey, raceData]) => {
            const race = raceKey as Race
            const isSelected = selectedRace === race
            
            return (
              <div
                key={race}
                onClick={() => setSelectedRace(race)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-fantasy-gold bg-fantasy-gold bg-opacity-10 shadow-lg'
                    : 'border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{raceData.emoji}</div>
                  <h4 className="text-lg font-semibold text-fantasy-gold mb-2">
                    {raceData.name}
                  </h4>
                  <p className="text-sm text-gray-300 mb-3">
                    {raceData.description}
                  </p>
                  
                  {/* Race Bonuses */}
                  <div className="text-xs text-gray-400">
                    <p className="font-semibold mb-1">Бонусы:</p>
                    <div className="flex justify-center space-x-2 text-xs">
                      {raceData.bonuses.strength !== 0 && (
                        <span className={`px-2 py-1 rounded ${raceData.bonuses.strength > 0 ? 'bg-red-600' : 'bg-red-800'}`}>
                          💪 {raceData.bonuses.strength > 0 ? '+' : ''}{raceData.bonuses.strength}
                        </span>
                      )}
                      {raceData.bonuses.agility !== 0 && (
                        <span className={`px-2 py-1 rounded ${raceData.bonuses.agility > 0 ? 'bg-green-600' : 'bg-green-800'}`}>
                          🏃 {raceData.bonuses.agility > 0 ? '+' : ''}{raceData.bonuses.agility}
                        </span>
                      )}
                      {raceData.bonuses.intelligence !== 0 && (
                        <span className={`px-2 py-1 rounded ${raceData.bonuses.intelligence > 0 ? 'bg-blue-600' : 'bg-blue-800'}`}>
                          🧠 {raceData.bonuses.intelligence > 0 ? '+' : ''}{raceData.bonuses.intelligence}
                        </span>
                      )}
                      {raceData.bonuses.vitality !== 0 && (
                        <span className={`px-2 py-1 rounded ${raceData.bonuses.vitality > 0 ? 'bg-purple-600' : 'bg-purple-800'}`}>
                          ❤️ {raceData.bonuses.vitality > 0 ? '+' : ''}{raceData.bonuses.vitality}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Character Preview */}
      {characterName && selectedRace && (
        <div className="card mb-6">
          <h3 className="text-xl font-semibold mb-4 text-fantasy-gold">
            👁️ Предварительный просмотр
          </h3>
          <div className="text-center">
            <div className="text-6xl mb-4">{RACES[selectedRace].emoji}</div>
            <h4 className="text-2xl font-bold text-fantasy-gold mb-2">
              {characterName}
            </h4>
            <p className="text-lg text-gray-300 mb-4">
              {RACES[selectedRace].name}
            </p>
            
            {/* Base Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-red-600 bg-opacity-30 p-3 rounded">
                <p className="text-red-300">💪 Сила</p>
                <p className="text-xl font-bold">
                  {10 + RACES[selectedRace].bonuses.strength}
                </p>
              </div>
              <div className="bg-green-600 bg-opacity-30 p-3 rounded">
                <p className="text-green-300">🏃 Ловкость</p>
                <p className="text-xl font-bold">
                  {10 + RACES[selectedRace].bonuses.agility}
                </p>
              </div>
              <div className="bg-blue-600 bg-opacity-30 p-3 rounded">
                <p className="text-blue-300">🧠 Интеллект</p>
                <p className="text-xl font-bold">
                  {10 + RACES[selectedRace].bonuses.intelligence}
                </p>
              </div>
              <div className="bg-purple-600 bg-opacity-30 p-3 rounded">
                <p className="text-purple-300">❤️ Выносливость</p>
                <p className="text-xl font-bold">
                  {10 + RACES[selectedRace].bonuses.vitality}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Button */}
      <div className="text-center">
        <button
          onClick={handleCreateCharacter}
          disabled={!characterName.trim() || !selectedRace || isCreating}
          className={`px-8 py-4 text-lg font-bold rounded-lg shadow-lg transition-all duration-300 ${
            characterName.trim() && selectedRace && !isCreating
              ? 'bg-fantasy-gold text-black hover:bg-yellow-400 hover:shadow-xl'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isCreating ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Создание...
            </>
          ) : (
            '✨ Создать персонажа ✨'
          )}
        </button>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>🎮 После создания персонажа вы попадете в игровой мир</p>
        <p className="mt-2">⚡ Помните: персонажа можно создать только одного</p>
      </div>
    </div>
  )
}
