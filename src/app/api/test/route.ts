import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Проверяем переменные окружения
    const envCheck = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
      NODE_ENV: process.env.NODE_ENV
    }

    // Тестируем подключение к Supabase
    let supabaseTest = null
    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.from('users').select('count').limit(1)
      supabaseTest = {
        success: !error,
        error: error?.message || null,
        data: data
      }
    } catch (err) {
      supabaseTest = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      supabase: supabaseTest
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
