import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { telegramUser } = await request.json()
    
    if (!telegramUser || !telegramUser.id) {
      return NextResponse.json({ error: 'Invalid telegram user data' }, { status: 400 })
    }

    // Проверяем переменные окружения
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createServerSupabaseClient()

    // Проверяем существует ли пользователь
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error checking user:', userError)
      return NextResponse.json({ 
        error: 'Database error', 
        details: userError.message,
        code: userError.code 
      }, { status: 500 })
    }

    let user = existingUser

    // Создаем пользователя если не существует
    if (!user) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          telegram_id: telegramUser.id,
          username: telegramUser.username || null,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || null
        })
        .select('*')
        .single()

      if (insertError) {
        console.error('Error creating user:', insertError)
        return NextResponse.json({ 
          error: 'Failed to create user', 
          details: insertError.message,
          code: insertError.code 
        }, { status: 500 })
      }

      user = newUser
    }

    // Проверяем существует ли персонаж
    const { data: character, error: characterError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (characterError && characterError.code !== 'PGRST116') {
      console.error('Error checking character:', characterError)
      return NextResponse.json({ 
        error: 'Database error', 
        details: characterError.message,
        code: characterError.code 
      }, { status: 500 })
    }

    return NextResponse.json({
      user: telegramUser,
      characterExists: !!character,
      character: character || null
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
