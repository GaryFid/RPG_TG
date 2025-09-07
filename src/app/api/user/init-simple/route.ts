import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { telegramUser } = await request.json()
    
    if (!telegramUser || !telegramUser.id) {
      return NextResponse.json({ error: 'Invalid telegram user data' }, { status: 400 })
    }

    // Простой ответ без базы данных для тестирования
    return NextResponse.json({
      user: telegramUser,
      characterExists: false,
      character: null,
      test: true
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
