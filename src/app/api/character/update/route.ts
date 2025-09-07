import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function PUT(request: NextRequest) {
  try {
    const { telegramUserId, characterId, updates } = await request.json()
    
    if (!telegramUserId || !characterId || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Проверяем что персонаж принадлежит пользователю
    const { data: character, error: characterError } = await supabase
      .from('characters')
      .select('id, user_id')
      .eq('id', characterId)
      .single()

    if (characterError || !character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 })
    }

    // Проверяем что пользователь имеет право редактировать этого персонажа
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', telegramUserId)
      .eq('id', character.user_id)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Обновляем персонажа
    const { data: updatedCharacter, error: updateError } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', characterId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating character:', updateError)
      return NextResponse.json({ error: 'Failed to update character' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      character: updatedCharacter
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
