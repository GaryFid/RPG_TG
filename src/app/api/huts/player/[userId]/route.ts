import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// GET /api/huts/player/[userId] - Получить хижины конкретного игрока
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const supabase = createClient()
    
    const { data: huts, error } = await supabase
      .from('huts')
      .select(`
        *,
        hut_zones!inner(*),
        hut_upgrades(*)
      `)
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching player huts:', error)
      return NextResponse.json({ error: 'Failed to fetch player huts' }, { status: 500 })
    }

    return NextResponse.json({ huts })
  } catch (error) {
    console.error('Error in GET /api/huts/player/[userId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
