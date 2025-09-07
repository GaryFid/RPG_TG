import { Race, RaceStats, City, Item, Monster, Skill } from '@/types/game'

// Расы и их характеристики
export const RACES: Record<Race, RaceStats> = {
  human: {
    name: 'Человек',
    emoji: '👨‍⚔️',
    bonuses: {
      strength: 5,
      agility: 5,
      intelligence: 5,
      vitality: 10
    },
    description: 'Универсальная раса с хорошей выносливостью и способностью к адаптации'
  },
  elf: {
    name: 'Эльф',
    emoji: '🧝‍♀️',
    bonuses: {
      strength: 0,
      agility: 15,
      intelligence: 10,
      vitality: 0
    },
    description: 'Быстрая и магически одаренная раса, мастера стрельбы и магии'
  },
  undead: {
    name: 'Нежить',
    emoji: '☠️',
    bonuses: {
      strength: 8,
      agility: 2,
      intelligence: 10,
      vitality: 5
    },
    description: 'Темная раса с устойчивостью к магии и способностями некромантии'
  },
  orc: {
    name: 'Орк',
    emoji: '👹',
    bonuses: {
      strength: 20,
      agility: 0,
      intelligence: -5,
      vitality: 10
    },
    description: 'Могучая воинственная раса с превосходной физической силой'
  }
}

// 8 городов мира
export const CITIES: City[] = [
  {
    id: 'kingdom_capital',
    name: 'Столица Королевства',
    emoji: '👑',
    race: 'human',
    description: 'Великая столица людей, центр торговли и политики',
    coordinates: { x: 50, y: 50 },
    shops: [],
    services: [],
    quests: []
  },
  {
    id: 'elvish_sanctuary',
    name: 'Эльфийское Святилище',
    emoji: '🌳',
    race: 'elf',
    description: 'Мистический город эльфов среди древних деревьев',
    coordinates: { x: 20, y: 20 },
    shops: [],
    services: [],
    quests: []
  },
  {
    id: 'necropolis',
    name: 'Некрополис',
    emoji: '🏚️',
    race: 'undead',
    description: 'Темный город нежити, окутанный туманом',
    coordinates: { x: 80, y: 20 },
    shops: [],
    services: [],
    quests: []
  },
  {
    id: 'orc_stronghold',
    name: 'Крепость Орков',
    emoji: '🏔️',
    race: 'orc',
    description: 'Суровая горная крепость орков',
    coordinates: { x: 80, y: 80 },
    shops: [],
    services: [],
    quests: []
  },
  {
    id: 'trading_port',
    name: 'Торговый Порт',
    emoji: '⚓',
    race: 'human',
    description: 'Нейтральный торговый город у моря',
    coordinates: { x: 30, y: 70 },
    shops: [],
    services: [],
    quests: []
  },
  {
    id: 'crystal_caverns',
    name: 'Хрустальные Пещеры',
    emoji: '💎',
    race: 'elf',
    description: 'Подземный город среди магических кристаллов',
    coordinates: { x: 60, y: 30 },
    shops: [],
    services: [],
    quests: []
  },
  {
    id: 'bone_citadel',
    name: 'Костяная Цитадель',
    emoji: '🦴',
    race: 'undead',
    description: 'Зловещая крепость из костей павших воинов',
    coordinates: { x: 70, y: 60 },
    shops: [],
    services: [],
    quests: []
  },
  {
    id: 'iron_mines',
    name: 'Железные Рудники',
    emoji: '⛏️',
    race: 'orc',
    description: 'Промышленный город орков с богатыми рудниками',
    coordinates: { x: 40, y: 80 },
    shops: [],
    services: [],
    quests: []
  }
]

// Базовые предметы
export const BASE_ITEMS: Item[] = [
  // Оружие
  {
    id: 'wooden_sword',
    name: 'Деревянный меч',
    type: 'weapon',
    rarity: 'common',
    emoji: '🗡️',
    description: 'Простой деревянный меч для начинающих',
    stats: { attack: 5 },
    requirements: { level: 1 },
    value: 10,
    craftable: true,
    craftingRecipe: {
      materials: [{ itemId: 'wood', quantity: 3 }],
      gold: 5
    }
  },
  {
    id: 'iron_sword',
    name: 'Железный меч',
    type: 'weapon',
    rarity: 'uncommon',
    emoji: '⚔️',
    description: 'Качественный железный меч',
    stats: { attack: 15 },
    requirements: { level: 5 },
    value: 50,
    craftable: true,
    craftingRecipe: {
      materials: [
        { itemId: 'iron_ingot', quantity: 2 },
        { itemId: 'wood', quantity: 1 }
      ],
      gold: 25
    }
  },
  {
    id: 'steel_sword',
    name: 'Стальной меч',
    type: 'weapon',
    rarity: 'rare',
    emoji: '🗡️',
    description: 'Острый стальной клинок высокого качества',
    stats: { attack: 25 },
    requirements: { level: 10 },
    value: 150,
    craftable: true,
    craftingRecipe: {
      materials: [
        { itemId: 'steel_ingot', quantity: 2 },
        { itemId: 'leather', quantity: 1 }
      ],
      gold: 75
    }
  },

  // Броня
  {
    id: 'leather_armor',
    name: 'Кожаная броня',
    type: 'armor',
    rarity: 'common',
    emoji: '🥾',
    description: 'Простая кожаная защита',
    stats: { defense: 8 },
    requirements: { level: 1 },
    value: 25,
    craftable: true,
    craftingRecipe: {
      materials: [{ itemId: 'leather', quantity: 4 }],
      gold: 15
    }
  },
  {
    id: 'chain_mail',
    name: 'Кольчуга',
    type: 'armor',
    rarity: 'uncommon',
    emoji: '🛡️',
    description: 'Кольчужная броня средней защиты',
    stats: { defense: 18 },
    requirements: { level: 5 },
    value: 100,
    craftable: true,
    craftingRecipe: {
      materials: [{ itemId: 'iron_ingot', quantity: 3 }],
      gold: 50
    }
  },

  // Материалы
  {
    id: 'wood',
    name: 'Дерево',
    type: 'material',
    rarity: 'common',
    emoji: '🪵',
    description: 'Обычная древесина для крафта',
    value: 1,
    craftable: false
  },
  {
    id: 'leather',
    name: 'Кожа',
    type: 'material',
    rarity: 'common',
    emoji: '🦴',
    description: 'Обработанная кожа животных',
    value: 3,
    craftable: false
  },
  {
    id: 'iron_ore',
    name: 'Железная руда',
    type: 'material',
    rarity: 'common',
    emoji: '⛰️',
    description: 'Сырая железная руда',
    value: 5,
    craftable: false
  },
  {
    id: 'iron_ingot',
    name: 'Железный слиток',
    type: 'material',
    rarity: 'uncommon',
    emoji: '🔩',
    description: 'Переплавленное железо',
    value: 12,
    craftable: true,
    craftingRecipe: {
      materials: [{ itemId: 'iron_ore', quantity: 2 }],
      gold: 3
    }
  },
  {
    id: 'steel_ingot',
    name: 'Стальной слиток',
    type: 'material',
    rarity: 'rare',
    emoji: '⚙️',
    description: 'Высококачественная сталь',
    value: 30,
    craftable: true,
    craftingRecipe: {
      materials: [
        { itemId: 'iron_ingot', quantity: 2 },
        { itemId: 'coal', quantity: 1 }
      ],
      gold: 10
    }
  },
  {
    id: 'coal',
    name: 'Уголь',
    type: 'material',
    rarity: 'common',
    emoji: '⚫',
    description: 'Горючий уголь для плавки',
    value: 2,
    craftable: false
  },

  // Расходники
  {
    id: 'health_potion',
    name: 'Зелье здоровья',
    type: 'consumable',
    rarity: 'common',
    emoji: '🧪',
    description: 'Восстанавливает здоровье',
    stats: { health: 50 },
    value: 15,
    craftable: true,
    craftingRecipe: {
      materials: [
        { itemId: 'herbs', quantity: 2 },
        { itemId: 'water', quantity: 1 }
      ],
      gold: 5
    }
  },
  {
    id: 'mana_potion',
    name: 'Зелье маны',
    type: 'consumable',
    rarity: 'common',
    emoji: '💙',
    description: 'Восстанавливает ману',
    stats: { mana: 30 },
    value: 12,
    craftable: true,
    craftingRecipe: {
      materials: [
        { itemId: 'magic_herbs', quantity: 2 },
        { itemId: 'water', quantity: 1 }
      ],
      gold: 4
    }
  },
  {
    id: 'herbs',
    name: 'Травы',
    type: 'material',
    rarity: 'common',
    emoji: '🌿',
    description: 'Лечебные травы',
    value: 2,
    craftable: false
  },
  {
    id: 'magic_herbs',
    name: 'Магические травы',
    type: 'material',
    rarity: 'uncommon',
    emoji: '🍀',
    description: 'Редкие магические растения',
    value: 5,
    craftable: false
  },
  {
    id: 'water',
    name: 'Чистая вода',
    type: 'material',
    rarity: 'common',
    emoji: '💧',
    description: 'Кристально чистая вода',
    value: 1,
    craftable: false
  }
]

// Базовые монстры
export const BASE_MONSTERS: Monster[] = [
  {
    id: 'goblin',
    name: 'Гоблин',
    emoji: '👺',
    level: 1,
    health: 25,
    attack: 8,
    defense: 2,
    experience: 15,
    goldReward: 5,
    lootTable: [
      { itemId: 'wood', chance: 50, quantity: { min: 1, max: 2 } },
      { itemId: 'leather', chance: 30, quantity: { min: 1, max: 1 } }
    ]
  },
  {
    id: 'wolf',
    name: 'Волк',
    emoji: '🐺',
    level: 3,
    health: 45,
    attack: 12,
    defense: 4,
    experience: 25,
    goldReward: 8,
    lootTable: [
      { itemId: 'leather', chance: 70, quantity: { min: 1, max: 3 } },
      { itemId: 'herbs', chance: 20, quantity: { min: 1, max: 1 } }
    ]
  },
  {
    id: 'orc_warrior',
    name: 'Орк-воин',
    emoji: '⚔️',
    level: 5,
    health: 80,
    attack: 18,
    defense: 8,
    experience: 45,
    goldReward: 15,
    lootTable: [
      { itemId: 'iron_ore', chance: 40, quantity: { min: 1, max: 2 } },
      { itemId: 'wooden_sword', chance: 20, quantity: { min: 1, max: 1 } }
    ]
  },
  {
    id: 'skeleton',
    name: 'Скелет',
    emoji: '💀',
    level: 4,
    health: 60,
    attack: 14,
    defense: 6,
    experience: 35,
    goldReward: 12,
    lootTable: [
      { itemId: 'bone_dust', chance: 60, quantity: { min: 1, max: 2 } },
      { itemId: 'iron_ore', chance: 25, quantity: { min: 1, max: 1 } }
    ]
  }
]

// Базовые навыки
export const BASE_SKILLS: Skill[] = [
  {
    id: 'combat',
    name: 'Боевые искусства',
    emoji: '⚔️',
    description: 'Увеличивает урон в ближнем бою',
    level: 1,
    experience: 0,
    maxLevel: 100,
    type: 'combat',
    effects: [
      {
        type: 'damage',
        value: 5,
        target: 'enemy'
      }
    ]
  },
  {
    id: 'magic',
    name: 'Магия',
    emoji: '🔮',
    description: 'Позволяет использовать заклинания',
    level: 1,
    experience: 0,
    maxLevel: 100,
    type: 'magic',
    effects: [
      {
        type: 'damage',
        value: 8,
        target: 'enemy'
      }
    ]
  },
  {
    id: 'archery',
    name: 'Стрельба',
    emoji: '🏹',
    description: 'Мастерство владения луком',
    level: 1,
    experience: 0,
    maxLevel: 100,
    type: 'combat',
    effects: [
      {
        type: 'damage',
        value: 6,
        target: 'enemy'
      }
    ]
  },
  {
    id: 'crafting',
    name: 'Ремесло',
    emoji: '🔨',
    description: 'Улучшает качество создаваемых предметов',
    level: 1,
    experience: 0,
    maxLevel: 100,
    type: 'crafting',
    effects: [
      {
        type: 'craft_bonus',
        value: 10,
        target: 'self'
      }
    ]
  }
]

// Функции для получения данных
export const getRaceByName = (race: Race): RaceStats => RACES[race]
export const getCityById = (id: string): City | undefined => CITIES.find(city => city.id === id)
export const getItemById = (id: string): Item | undefined => BASE_ITEMS.find(item => item.id === id)
export const getMonsterById = (id: string): Monster | undefined => BASE_MONSTERS.find(monster => monster.id === id)
export const getSkillById = (id: string): Skill | undefined => BASE_SKILLS.find(skill => skill.id === id)
