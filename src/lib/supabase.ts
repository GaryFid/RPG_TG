import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

// Database types for type safety
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          telegram_id: number
          username: string | null
          first_name: string
          last_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telegram_id: number
          username?: string | null
          first_name: string
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number
          username?: string | null
          first_name?: string
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      characters: {
        Row: {
          id: string
          user_id: string
          name: string
          race: string
          level: number
          experience: number
          health: number
          max_health: number
          mana: number
          max_mana: number
          strength: number
          agility: number
          intelligence: number
          vitality: number
          gold: number
          current_city: string
          equipment: any
          inventory: any
          skills: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          race: string
          level?: number
          experience?: number
          health?: number
          max_health?: number
          mana?: number
          max_mana?: number
          strength?: number
          agility?: number
          intelligence?: number
          vitality?: number
          gold?: number
          current_city?: string
          equipment?: any
          inventory?: any
          skills?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          race?: string
          level?: number
          experience?: number
          health?: number
          max_health?: number
          mana?: number
          max_mana?: number
          strength?: number
          agility?: number
          intelligence?: number
          vitality?: number
          gold?: number
          current_city?: string
          equipment?: any
          inventory?: any
          skills?: any
          created_at?: string
          updated_at?: string
        }
      }
      battles: {
        Row: {
          id: string
          character_id: string
          monster_id: string
          result: 'victory' | 'defeat'
          experience_gained: number
          gold_gained: number
          items_gained: any
          battle_log: any
          created_at: string
        }
        Insert: {
          id?: string
          character_id: string
          monster_id: string
          result: 'victory' | 'defeat'
          experience_gained?: number
          gold_gained?: number
          items_gained?: any
          battle_log?: any
          created_at?: string
        }
        Update: {
          id?: string
          character_id?: string
          monster_id?: string
          result?: 'victory' | 'defeat'
          experience_gained?: number
          gold_gained?: number
          items_gained?: any
          battle_log?: any
          created_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
