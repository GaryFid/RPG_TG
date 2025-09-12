// Game Core Types
export type Race = 'human' | 'elf' | 'undead' | 'orc'

// Telegram User Type
export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface Character {
  id: string
  userId: number
  name: string
  race: Race
  level: number
  experience: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  strength: number
  agility: number
  intelligence: number
  vitality: number
  gold: number
  diamonds: number
  current_city: string
  equipment: Equipment
  inventory: InventoryItem[]
  skills: Skill[]
  createdAt: Date
  updatedAt: Date
}

export interface RaceStats {
  name: string
  emoji: string
  bonuses: {
    strength: number
    agility: number
    intelligence: number
    vitality: number
  }
  description: string
}

// Cities and Locations
export interface City {
  id: string
  name: string
  emoji: string
  race: Race
  description: string
  shops: Shop[]
  services: Service[]
  quests: Quest[]
  coordinates: { x: number; y: number }
}

export interface Reward {
  id: string
  type: 'experience' | 'gold' | 'item'
  value: number
  itemId?: string
  chance: number // 0-100
}

export interface Location {
  id: string
  name: string
  type: 'dungeon' | 'arena' | 'forest' | 'mountain' | 'cave' | 'ruins'
  emoji: string
  description: string
  levelRange: { min: number; max: number }
  monsters: Monster[]
  rewards: Reward[]
  coordinates: { x: number; y: number }
}

// Items and Equipment
export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'quest'
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface Item {
  id: string
  name: string
  type: ItemType
  rarity: ItemRarity
  emoji: string
  description: string
  stats?: {
    attack?: number
    defense?: number
    health?: number
    mana?: number
    strength?: number
    agility?: number
    intelligence?: number
    vitality?: number
  }
  requirements?: {
    level?: number
    race?: Race[]
  }
  value: number
  craftable: boolean
  craftingRecipe?: CraftingRecipe
}

export interface InventoryItem {
  item: Item
  quantity: number
}

export interface Equipment {
  weapon?: Item
  armor?: Item
  helmet?: Item
  boots?: Item
  gloves?: Item
  accessory1?: Item
  accessory2?: Item
}

export interface CraftingRecipe {
  materials: { itemId: string; quantity: number }[]
  gold: number
  skillRequired?: { skillId: string; level: number }
}

// Combat System
export interface Monster {
  id: string
  name: string
  emoji: string
  level: number
  health: number
  attack: number
  defense: number
  experience: number
  goldReward: number
  lootTable: LootDrop[]
}

export interface LootDrop {
  itemId: string
  chance: number // 0-100
  quantity: { min: number; max: number }
}

export interface BattleResult {
  victory: boolean
  experienceGained: number
  goldGained: number
  itemsGained: InventoryItem[]
  damageDealt: number
  damageTaken: number
  turns: BattleTurn[]
}

export interface BattleTurn {
  actor: 'player' | 'monster'
  action: 'attack' | 'defend' | 'skill' | 'item'
  damage: number
  effect?: string
}

// Skills System
export interface Skill {
  id: string
  name: string
  emoji: string
  description: string
  level: number
  experience: number
  maxLevel: number
  type: 'combat' | 'crafting' | 'gathering' | 'magic'
  effects: SkillEffect[]
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'craft_bonus'
  value: number
  duration?: number
  target: 'self' | 'enemy' | 'all'
}

// Trading and Economy
export interface Shop {
  id: string
  name: string
  type: 'weapons' | 'armor' | 'consumables' | 'materials' | 'general'
  emoji: string
  items: ShopItem[]
  refreshInterval: number // hours
  lastRefresh: Date
}

export interface ShopItem {
  item: Item
  price: number
  stock: number
  refreshes: boolean
}

export interface Service {
  id: string
  name: string
  type: 'training' | 'healing' | 'repair' | 'storage'
  emoji: string
  description: string
  cost: number
}

// Quests System
export type QuestType = 'kill' | 'collect' | 'deliver' | 'explore' | 'craft'
export type QuestStatus = 'available' | 'active' | 'completed' | 'failed'

export interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  emoji: string
  requirements: QuestRequirement
  objectives: QuestObjective[]
  rewards: QuestReward
  timeLimit?: number // hours
  repeatable: boolean
  status: QuestStatus
  progress: { [key: string]: number }
}

export interface QuestRequirement {
  level?: number
  race?: Race[]
  completedQuests?: string[]
  items?: { itemId: string; quantity: number }[]
}

export interface QuestObjective {
  id: string
  description: string
  type: QuestType
  target: string // monster id, item id, location id, etc.
  quantity: number
  currentProgress: number
}

export interface QuestReward {
  experience: number
  gold: number
  items?: { itemId: string; quantity: number }[]
  unlocks?: string[] // new areas, quests, etc.
}

// World Map
export interface WorldMap {
  cities: City[]
  locations: Location[]
  roads: Road[]
  size: { width: number; height: number }
}

export interface Road {
  from: string // city/location id
  to: string   // city/location id
  distance: number
  travelTime: number // minutes
  encounters: Encounter[]
}

export interface Encounter {
  type: 'monster' | 'treasure' | 'trader' | 'event'
  chance: number // 0-100
  data: any // specific to encounter type
}

// Castle Types
export interface CastleType {
  id: string
  name: string
  emoji: string
  description: string
  basePrice: number
  image?: string // путь к изображению
  bonuses: {
    production?: number
    defense?: number
    capacity?: number
  }
}

// Castle Buildings System
export interface CastleBuilding {
  id: string
  type: BuildingType
  name: string
  emoji: string
  description: string
  level: number
  maxLevel: number
  x: number
  y: number
  width: number
  height: number
  cost: {
    wood?: number
    stone?: number
    iron?: number
    gold?: number
    diamonds?: number
  }
  upgradeCost: {
    wood?: number
    stone?: number
    iron?: number
    gold?: number
    diamonds?: number
  }
  production?: {
    resourceType: ResourceType
    amount: number
    interval: number // в секундах (24 часа = 86400)
    lastCollected: Date
  }
  requirements?: {
    level?: number
    buildings?: { type: BuildingType; level: number }[]
  }
  stats?: {
    attack?: number
    defense?: number
    capacity?: number
    training?: number
  }
  createdAt: Date
  updatedAt: Date
}

export type BuildingType = 
  | 'main_castle'      // Главный замок
  | 'lumber_mill'      // Лесопилка
  | 'stone_quarry'     // Каменоломня  
  | 'iron_mine'        // Железная шахта
  | 'gold_mine'        // Золотая шахта
  | 'farm'             // Ферма
  | 'barracks'         // Казармы
  | 'archery_range'    // Лучники
  | 'stable'           // Конюшня
  | 'magic_tower'      // Башня магии
  | 'library'          // Библиотека
  | 'workshop'         // Мастерская
  | 'wall'             // Стена
  | 'gate'             // Ворота
  | 'watchtower'       // Сторожевая башня
  | 'market'           // Рынок
  | 'temple'           // Храм
  | 'tavern'           // Таверна

export type ResourceType = 'wood' | 'stone' | 'iron' | 'gold' | 'food' | 'mana'

// Army System
export interface Unit {
  id: string
  type: UnitType
  name: string
  emoji: string
  level: number
  count: number
  stats: {
    attack: number
    defense: number
    health: number
    speed: number
  }
  cost: {
    wood?: number
    stone?: number
    iron?: number
    gold?: number
    food?: number
  }
  trainingTime: number // в секундах
  requirements?: {
    building: BuildingType
    buildingLevel: number
  }
}

export type UnitType = 
  | 'warrior'    // Воин
  | 'archer'     // Лучник
  | 'knight'     // Рыцарь
  | 'mage'       // Маг
  | 'scout'      // Разведчик
  | 'catapult'   // Катапульта

// Magic System
export interface Spell {
  id: string
  name: string
  emoji: string
  description: string
  level: number
  maxLevel: number
  type: SpellType
  cost: {
    mana: number
    gold?: number
    reagents?: { id: string; quantity: number }[]
  }
  cooldown: number // в секундах
  effect: {
    type: 'damage' | 'heal' | 'buff' | 'debuff' | 'utility'
    value: number
    duration?: number
    target: 'self' | 'ally' | 'enemy' | 'area'
  }
  requirements: {
    level: number
    building?: { type: BuildingType; level: number }
    spells?: string[] // prerequisite spells
  }
}

export type SpellType = 'combat' | 'support' | 'production' | 'defense'

// World Races System
export interface RaceWorld {
  id: string
  race: Race
  name: string
  emoji: string
  description: string
  environment: string
  unlockLevel: number
  isUnlocked: boolean
  mapData?: any // Tiled map data
  specialResources: ResourceType[]
  bonuses: {
    production?: { [key in ResourceType]?: number }
    combat?: { attack?: number; defense?: number }
    magic?: { mana?: number; spellPower?: number }
  }
}

// Hut System
export interface Hut {
  id: string
  ownerId: number
  ownerName: string
  name: string
  x: number // tile position
  y: number // tile position
  size: { width: number; height: number } // always 4x4
  zone: HutZone
  castleType: CastleType // тип замка
  level: number
  upgrades: HutUpgrade[]
  resources: HutResources
  lastVisited: Date
  createdAt: Date
  updatedAt: Date
}

export interface HutZone {
  id: string
  name: string
  emoji: string
  description: string
  basePrice: number
  priceMultiplier: number // multiplier based on distance from center
  maxHuts: number
  coordinates: { x: number; y: number }
  radius: number
}

export interface HutUpgrade {
  id: string
  name: string
  type: 'storage' | 'defense' | 'decoration' | 'utility'
  level: number
  cost: number
  effects: HutUpgradeEffect[]
  description: string
}

export interface HutUpgradeEffect {
  type: 'storage_capacity' | 'defense_bonus' | 'resource_generation' | 'visitor_bonus'
  value: number
}

export interface HutResources {
  wood: number
  stone: number
  metal: number
  gems: number
  food: number
  maxStorage: number
}

export interface HutConstruction {
  x: number
  y: number
  zone: HutZone
  cost: number
  canBuild: boolean
  reason?: string // why can't build (collision, insufficient funds, etc.)
}