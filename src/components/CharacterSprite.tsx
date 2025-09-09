'use client'

import { useState, useEffect } from 'react'

interface CharacterSpriteProps {
  characterId: string
  x: number
  y: number
  className?: string
  onClick?: () => void
  isSelected?: boolean
  isVisible?: boolean
}

interface CharacterData {
  id: string
  name: string
  class: string
  level: number
  sprite: string
  animations: {
    idle: string
    walk: string
    attack: string
    death: string
  }
}

// Моковые данные персонажей
const CHARACTERS: CharacterData[] = [
  {
    id: 'warrior_1',
    name: 'Sir Galahad',
    class: 'Warrior',
    level: 5,
    sprite: '/assets/characters/classes/warrior/idle.png',
    animations: {
      idle: '/assets/characters/classes/warrior/idle.png',
      walk: '/assets/characters/classes/warrior/walk.png',
      attack: '/assets/characters/classes/warrior/attack.png',
      death: '/assets/characters/classes/warrior/death.png'
    }
  },
  {
    id: 'mage_1',
    name: 'Merlin',
    class: 'Mage',
    level: 7,
    sprite: '/assets/characters/classes/mage/idle.png',
    animations: {
      idle: '/assets/characters/classes/mage/idle.png',
      walk: '/assets/characters/classes/mage/walk.png',
      attack: '/assets/characters/classes/mage/attack.png',
      death: '/assets/characters/classes/mage/death.png'
    }
  },
  {
    id: 'archer_1',
    name: 'Legolas',
    class: 'Archer',
    level: 4,
    sprite: '/assets/characters/classes/archer/idle.png',
    animations: {
      idle: '/assets/characters/classes/archer/idle.png',
      walk: '/assets/characters/classes/archer/walk.png',
      attack: '/assets/characters/classes/archer/attack.png',
      death: '/assets/characters/classes/archer/death.png'
    }
  },
  {
    id: 'rogue_1',
    name: 'Shadow',
    class: 'Rogue',
    level: 6,
    sprite: '/assets/characters/classes/rogue/idle.png',
    animations: {
      idle: '/assets/characters/classes/rogue/idle.png',
      walk: '/assets/characters/classes/rogue/walk.png',
      attack: '/assets/characters/classes/rogue/attack.png',
      death: '/assets/characters/classes/rogue/death.png'
    }
  }
]

export default function CharacterSprite({ 
  characterId, 
  x, 
  y, 
  className = '', 
  onClick,
  isSelected = false,
  isVisible = true
}: CharacterSpriteProps) {
  const [character, setCharacter] = useState<CharacterData | null>(null)
  const [currentAnimation, setCurrentAnimation] = useState('idle')
  const [animationFrame, setAnimationFrame] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Находим данные персонажа
  useEffect(() => {
    const char = CHARACTERS.find(c => c.id === characterId)
    setCharacter(char || null)
  }, [characterId])

  // Анимация idle
  useEffect(() => {
    if (!character || currentAnimation !== 'idle') return

    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 4) // 4 кадра анимации
    }, 500) // Смена кадра каждые 500мс

    return () => clearInterval(interval)
  }, [character, currentAnimation])

  // Обработка загрузки изображения
  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  const handleImageError = () => {
    console.warn(`Failed to load character sprite: ${character?.sprite}`)
    setIsLoaded(false)
  }

  if (!character || !isVisible) return null

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-4 ring-fantasy-gold animate-pulse' : 'hover:ring-2 hover:ring-white'
      } ${className}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 10
      }}
      onClick={onClick}
    >
      {/* Спрайт персонажа */}
      <div className="relative">
        {isLoaded ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={character.sprite}
            alt={character.name}
            className="w-8 h-8 object-none"
            style={{
              imageRendering: 'pixelated',
              filter: isSelected ? 'brightness(1.2)' : 'none'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          // Заглушка пока загружается спрайт
          <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-xs">
            {character.class.charAt(0)}
          </div>
        )}

        {/* Индикатор уровня */}
        <div className="absolute -top-1 -right-1 bg-fantasy-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {character.level}
        </div>

        {/* Имя персонажа */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
          <div className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {character.name}
          </div>
        </div>

        {/* Класс персонажа */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6">
          <div className="bg-gray-800 bg-opacity-70 text-fantasy-gold text-xs px-2 py-1 rounded whitespace-nowrap">
            {character.class}
          </div>
        </div>
      </div>
    </div>
  )
}

// Хук для управления персонажами на карте
export function useCharacterSprites() {
  const [characters, setCharacters] = useState<CharacterData[]>(CHARACTERS)
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

  const addCharacter = (character: Omit<CharacterData, 'id'>) => {
    const newCharacter: CharacterData = {
      ...character,
      id: `${character.class.toLowerCase()}_${Date.now()}`
    }
    setCharacters(prev => [...prev, newCharacter])
  }

  const removeCharacter = (characterId: string) => {
    setCharacters(prev => prev.filter(c => c.id !== characterId))
  }

  const updateCharacter = (characterId: string, updates: Partial<CharacterData>) => {
    setCharacters(prev => 
      prev.map(c => c.id === characterId ? { ...c, ...updates } : c)
    )
  }

  const selectCharacter = (characterId: string | null) => {
    setSelectedCharacter(characterId)
  }

  return {
    characters,
    selectedCharacter,
    addCharacter,
    removeCharacter,
    updateCharacter,
    selectCharacter
  }
}
