// Game Core Types
export type Race = 'human' | 'elf' | 'undead' | 'orc'

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
