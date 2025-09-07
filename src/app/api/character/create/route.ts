import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Race } from '@/types/game'

export async function POST(request: NextRequest) {
  try {
    const { telegramUserId, name, race } = await request.json()
    
    if (!telegramUserId || !name || !race) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (name.length < 2 || name.length > 20) {
      return NextResponse.json({ error: 'Name must be 2-20 characters' }, { status: 400 })
    }

    const validRaces: Race[] = ['human', 'elf', 'undead', 'orc']
    if (!validRaces.includes(race)) {
      return NextResponse.json({ error: 'Invalid race' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Получаем пользователя
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', telegramUserId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Проверяем что у пользователя еще нет персонажа
    const { data: existingCharacter } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingCharacter) {
      return NextResponse.json({ error: 'Character already exists' }, { status: 400 })
    }

    // Бонусы рас
    const raceBonuses = {
      human: { strength: 5, agility: 5, intelligence: 5, vitality: 10 },
      elf: { strength: 0, agility: 15, intelligence: 10, vitality: 0 },
      undead: { strength: 8, agility: 2, intelligence: 10, vitality: 5 },
      orc: { strength: 20, agility: 0, intelligence: -5, vitality: 10 }
    }

    const bonuses = raceBonuses[race]

    const newCharacter = {
      user_id: user.id,
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

    const { data: character, error: createError } = await supabase
      .from('characters')
      .insert(newCharacter)
      .select()
      .single()

    if (createError) {
      console.error('Error creating character:', createError)
      return NextResponse.json({ error: 'Failed to create character' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      character
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
