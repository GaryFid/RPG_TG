'use client'

import { useState, useEffect } from 'react'

export default function MapTest() {
  const [mapData, setMapData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testMapLoad = async () => {
      try {
        console.log('Testing map load...')
        const response = await fetch('/assets/maps/my_world.json')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Map test successful:', data)
        setMapData(data)
        setLoading(false)
      } catch (err) {
        console.error('Map test failed:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    testMapLoad()
  }, [])

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-bold text-fantasy-gold mb-2">Тест загрузки карты</h3>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-fantasy-gold"></div>
          <span className="text-gray-300">Загружаем...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900 rounded-lg">
        <h3 className="text-lg font-bold text-red-300 mb-2">Ошибка загрузки карты</h3>
        <p className="text-red-200">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-900 rounded-lg">
      <h3 className="text-lg font-bold text-green-300 mb-2">✅ Карта загружена успешно!</h3>
      <div className="text-sm text-green-200 space-y-1">
        <p>Размер: {mapData?.width}×{mapData?.height} тайлов</p>
        <p>Размер тайла: {mapData?.tilewidth}×{mapData?.tileheight}px</p>
        <p>Слоев: {mapData?.layers?.length}</p>
        <p>Тайлсетов: {mapData?.tilesets?.length}</p>
      </div>
    </div>
  )
}
