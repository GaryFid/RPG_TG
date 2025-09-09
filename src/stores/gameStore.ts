import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Character, TelegramUser, Race } from '@/types/game'

interface GameState {
  // User & Auth
  user: TelegramUser | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Character
  character: Character | null
  characterExists: boolean
  
  // Game State
  currentView: 'home' | 'character-creation' | 'game' | 'battle' | 'inventory' | 'map' | 'shop' | 'crafting' | 'huts'
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
  clearCache: () => void
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
          // Проверяем, не сменился ли пользователь
          const { user: currentUser } = get()
          if (currentUser && currentUser.id !== telegramUser.id) {
            // Пользователь сменился - очищаем кеш и сбрасываем все данные
            console.log('User changed, clearing cache...', {
              oldUserId: currentUser.id,
              newUserId: telegramUser.id
            })
            get().clearCache()
          }
          
          const response = await fetch('/api/user/init', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ telegramUser })
          })

          if (!response.ok) {
            throw new Error('Failed to initialize user')
          }

          const data = await response.json()
          
          set({
            user: data.user,
            isAuthenticated: true,
            characterExists: data.characterExists,
            character: data.character,
            currentView: data.character ? 'game' : 'character-creation',
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
          const response = await fetch('/api/character/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              telegramUserId: user.id,
              name,
              race
            })
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to create character')
          }

          const data = await response.json()
          
          set({
            character: data.character as Character,
            characterExists: true,
            currentView: 'game',
            isLoading: false
          })
          
          get().showNotif(`Персонаж ${name} создан успешно!`, 'success')
          return true
          
        } catch (error) {
          console.error('Error creating character:', error)
          get().showNotif(error instanceof Error ? error.message : 'Ошибка создания персонажа', 'error')
          set({ isLoading: false })
          return false
        }
      },
      
      // Load character data (now handled by initializeUser)
      loadCharacter: async () => {
        // This function is now redundant as character loading is handled in initializeUser
        // Keeping for compatibility
      },
      
      // Update character
      updateCharacter: async (updates: Partial<Character>) => {
        const { character, user } = get()
        if (!character || !user) return
        
        try {
          const response = await fetch('/api/character/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              telegramUserId: user.id,
              characterId: character.id,
              updates
            })
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to update character')
          }

          const data = await response.json()
          set({ character: data.character as Character })
          
        } catch (error) {
          console.error('Error updating character:', error)
          get().showNotif(error instanceof Error ? error.message : 'Ошибка обновления персонажа', 'error')
        }
      },
      
      // Reset state
      reset: () => set(initialState),
      
      // Clear cache and reset
      clearCache: () => {
        // Очищаем localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tgrpg-game-store')
        }
        // Сбрасываем состояние
        set(initialState)
      },
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
