import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET /api/huts - Получить все хижины
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: huts, error } = await supabase
      .from('huts')
      .select(`
        *,
        hut_zones!inner(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching huts:', error)
      return NextResponse.json({ error: 'Failed to fetch huts' }, { status: 500 })
    }

    return NextResponse.json({ huts })
  } catch (error) {
    console.error('Error in GET /api/huts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/huts - Создать новую хижину
export async function POST(request: NextRequest) {
  try {
    const { x, y, zoneId, characterId, characterName, hutName } = await request.json()

    if (!x || !y || !zoneId || !characterId || !characterName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Проверяем коллизии
    const { data: collisions, error: collisionError } = await supabase
      .from('huts')
      .select('id')
      .or(`and(x.lt.${x + 4},x.gt.${x - 4}),and(y.lt.${y + 4},y.gt.${y - 4})`)

    if (collisionError) {
      console.error('Error checking collisions:', collisionError)
      return NextResponse.json({ error: 'Failed to check collisions' }, { status: 500 })
    }

    if (collisions && collisions.length > 0) {
      return NextResponse.json({ error: 'Position is occupied by another hut' }, { status: 400 })
    }

    // Получаем данные зоны для расчета цены
    const { data: zone, error: zoneError } = await supabase
      .from('hut_zones')
      .select('*')
      .eq('id', zoneId)
      .single()

    if (zoneError || !zone) {
      return NextResponse.json({ error: 'Invalid zone' }, { status: 400 })
    }

    // Вычисляем стоимость
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - zone.center_x, 2) + Math.pow(y - zone.center_y, 2)
    )
    const distanceMultiplier = Math.max(0.1, 1 - (distanceFromCenter / zone.radius) * 0.9)
    const cost = Math.floor(zone.base_price * zone.price_multiplier * distanceMultiplier)

    // Создаем хижину
    const { data: hut, error: hutError } = await supabase
      .from('huts')
      .insert({
        id: `hut_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        owner_id: characterId,
        owner_name: characterName,
        name: hutName || `${characterName}'s Hut`,
        x,
        y,
        width: 4,
        height: 4,
        zone_id: zoneId,
        level: 1,
        wood: 0,
        stone: 0,
        metal: 0,
        gems: 0,
        food: 0,
        max_storage: 1000
      })
      .select()
      .single()

    if (hutError) {
      console.error('Error creating hut:', hutError)
      return NextResponse.json({ error: 'Failed to create hut' }, { status: 500 })
    }

    return NextResponse.json({ 
      hut,
      cost,
      message: 'Hut created successfully' 
    })
  } catch (error) {
    console.error('Error in POST /api/huts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
