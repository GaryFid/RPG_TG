import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Character, TelegramUser, Race } from '@/types/game'
import { supabase } from '@/lib/supabase'

interface GameState {
  // User & Auth
  user: TelegramUser | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Character
  character: Character | null
  characterExists: boolean
  
  // Game State
  currentView: 'home' | 'character-creation' | 'game' | 'battle' | 'inventory' | 'map' | 'shop' | 'crafting'
  selectedCity: string | null
  selectedLocation: string | null
  
  // UI State
  showNotification: boolean
  notificationMessage: string
  notificationType: 'success' | 'error' | 'info' | 'warning'
  
  // Actions
  setUser: (user: TelegramUser) => void
  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void
  setCharacter: (character: Character | null) => void
  setCharacterExists: (exists: boolean) => void
  setCurrentView: (view: GameState['currentView']) => void
  setSelectedCity: (cityId: string | null) => void
  setSelectedLocation: (locationId: string | null) => void
  showNotif: (message: string, type: GameState['notificationType']) => void
  hideNotification: () => void
  
  // Game Actions
  initializeUser: (telegramUser: TelegramUser) => Promise<void>
  createCharacter: (name: string, race: Race) => Promise<boolean>
  loadCharacter: () => Promise<void>
  updateCharacter: (updates: Partial<Character>) => Promise<void>
  
  // Utility
  reset: () => void
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  character: null,
  characterExists: false,
  currentView: 'home' as const,
  selectedCity: null,
  selectedLocation: null,
  showNotification: false,
  notificationMessage: '',
  notificationType: 'info' as const,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Setters
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      setCharacter: (character) => set({ character }),
      setCharacterExists: (characterExists) => set({ characterExists }),
      setCurrentView: (currentView) => set({ currentView }),
      setSelectedCity: (selectedCity) => set({ selectedCity }),
      setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
      
      // Notifications
      showNotif: (message, type) => set({ 
        showNotification: true, 
        notificationMessage: message, 
        notificationType: type 
      }),
      hideNotification: () => set({ showNotification: false }),
      
      // Initialize user and check for existing character
      initializeUser: async (telegramUser: TelegramUser) => {
        set({ isLoading: true })
        
        try {
          // Check if user exists in database
          const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('telegram_id', telegramUser.id)
            .single()
          
          if (userError && userError.code !== 'PGRST116') {
            throw userError
          }
          
          // Create user if doesn't exist
          if (!existingUser) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                telegram_id: telegramUser.id,
                username: telegramUser.username || null,
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name || null
              })
            
            if (insertError) throw insertError
          }
          
          // Check for existing character
          const { data: character, error: characterError } = await supabase
            .from('characters')
            .select('*')
            .eq('user_id', existingUser?.id)
            .single()
          
          if (characterError && characterError.code !== 'PGRST116') {
            throw characterError
          }
          
          set({
            user: telegramUser,
            isAuthenticated: true,
            characterExists: !!character,
            character: character as Character | null,
            currentView: character ? 'game' : 'character-creation',
            isLoading: false
          })
          
        } catch (error) {
          console.error('Error initializing user:', error)
          get().showNotif('Ошибка инициализации пользователя', 'error')
          set({ isLoading: false })
        }
      },
      
      // Create new character
      createCharacter: async (name: string, race: Race): Promise<boolean> => {
        const { user } = get()
        if (!user) return false
        
        set({ isLoading: true })
        
        try {
          // Get user from database
          const { data: dbUser } = await supabase
            .from('users')
            .select('id')
            .eq('telegram_id', user.id)
            .single()
          
          if (!dbUser) throw new Error('User not found')
          
          // Race bonuses (matching gameData.ts)
          const raceBonuses = {
            human: { strength: 5, agility: 5, intelligence: 5, vitality: 10 },
            elf: { strength: 0, agility: 15, intelligence: 10, vitality: 0 },
            undead: { strength: 8, agility: 2, intelligence: 10, vitality: 5 },
            orc: { strength: 20, agility: 0, intelligence: -5, vitality: 10 }
          }
          
          const bonuses = raceBonuses[race]
          
          const newCharacter = {
            user_id: dbUser.id,
            name,
            race,
            level: 1,
            experience: 0,
            strength: 10 + bonuses.strength,
            agility: 10 + bonuses.agility,
            intelligence: 10 + bonuses.intelligence,
            vitality: 10 + bonuses.vitality,
            max_health: 100 + (bonuses.vitality * 5),
            health: 100 + (bonuses.vitality * 5),
            max_mana: 50 + (bonuses.intelligence * 2),
            mana: 50 + (bonuses.intelligence * 2),
            gold: 100,
            current_city: 'kingdom_capital',
            equipment: {},
            inventory: [],
            skills: []
          }
          
          const { data: character, error } = await supabase
            .from('characters')
            .insert(newCharacter)
            .select()
            .single()
          
          if (error) throw error
          
          set({
            character: character as Character,
            characterExists: true,
            currentView: 'game',
            isLoading: false
          })
          
          get().showNotif(`Персонаж ${name} создан успешно!`, 'success')
          return true
          
        } catch (error) {
          console.error('Error creating character:', error)
          get().showNotif('Ошибка создания персонажа', 'error')
          set({ isLoading: false })
          return false
        }
      },
      
      // Load character data
      loadCharacter: async () => {
        const { user } = get()
        if (!user) return
        
        try {
          const { data: dbUser } = await supabase
            .from('users')
            .select('id')
            .eq('telegram_id', user.id)
            .single()
          
          if (!dbUser) return
          
          const { data: character, error } = await supabase
            .from('characters')
            .select('*')
            .eq('user_id', dbUser.id)
            .single()
          
          if (error && error.code !== 'PGRST116') throw error
          
          if (character) {
            set({ 
              character: character as Character,
              characterExists: true 
            })
          }
          
        } catch (error) {
          console.error('Error loading character:', error)
          get().showNotif('Ошибка загрузки персонажа', 'error')
        }
      },
      
      // Update character
      updateCharacter: async (updates: Partial<Character>) => {
        const { character } = get()
        if (!character) return
        
        try {
          const { data, error } = await supabase
            .from('characters')
            .update(updates)
            .eq('id', character.id)
            .select()
            .single()
          
          if (error) throw error
          
          set({ character: data as Character })
          
        } catch (error) {
          console.error('Error updating character:', error)
          get().showNotif('Ошибка обновления персонажа', 'error')
        }
      },
      
      // Reset state
      reset: () => set(initialState),
    }),
    {
      name: 'tgrpg-game-store',
      partialize: (state) => ({
        user: state.user,
        character: state.character,
        characterExists: state.characterExists,
        currentView: state.currentView,
      }),
    }
  )
)
