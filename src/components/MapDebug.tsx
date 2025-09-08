'use client'

import { useState, useEffect } from 'react'

export default function MapDebug() {
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
        
        // Проверяем структуру данных
        const tilesetsWithImages = data.tilesets?.filter((ts: any) => ts.image) || []
        console.log('Tilesets with images:', tilesetsWithImages)
        
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
      <div className="p-4 bg-blue-900 rounded-lg">
        <h3 className="text-lg font-bold text-blue-300 mb-2">🔍 Отладка карты</h3>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
          <span className="text-blue-200">Загружаем...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900 rounded-lg">
        <h3 className="text-lg font-bold text-red-300 mb-2">❌ Ошибка загрузки карты</h3>
        <p className="text-red-200 mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-white text-sm"
        >
          Перезагрузить
        </button>
      </div>
    )
  }

  const tilesetsWithImages = mapData?.tilesets?.filter((ts: any) => ts.image) || []

  return (
    <div className="p-4 bg-green-900 rounded-lg">
      <h3 className="text-lg font-bold text-green-300 mb-2">✅ Карта загружена успешно!</h3>
      <div className="text-sm text-green-200 space-y-1">
        <p>Размер: {mapData?.width}×{mapData?.height} тайлов</p>
        <p>Размер тайла: {mapData?.tilewidth}×{mapData?.tileheight}px</p>
        <p>Слоев: {mapData?.layers?.length}</p>
        <p>Всего тайлсетов: {mapData?.tilesets?.length}</p>
        <p>Тайлсетов с изображениями: {tilesetsWithImages.length}</p>
        <div className="mt-2">
          <p className="font-bold">Доступные тайлсеты:</p>
          <ul className="list-disc list-inside ml-2">
            {tilesetsWithImages.map((ts: any, index: number) => (
              <li key={index} className="text-xs">
                {ts.name} (ID: {ts.firstgid}) - {ts.image?.split('/').pop()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
