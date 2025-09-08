# Интеграция карты Tiled в Telegram WebApp

## Обзор

Успешно интегрирована карта, созданная в Tiled Editor, в ваш Telegram WebApp проект. Карта поддерживает:

- ✅ Отображение многослойных карт из Tiled
- ✅ Поддержка zlib сжатия данных
- ✅ Интерактивное управление персонажем
- ✅ Переключение между режимами просмотра
- ✅ Оптимизированная загрузка тайлсетов

## Структура файлов

```
public/
├── assets/
│   ├── maps/
│   │   └── my_world.json          # JSON карта из Tiled
│   └── tilesets/
│       ├── castle_outside.png
│       ├── Castle2.png
│       ├── grass.png
│       ├── jungle-ruins-preview.png
│       └── terrain-map-v7.png

src/
├── components/
│   ├── TiledMapViewer.tsx         # Основной компонент карты
│   ├── MapController.tsx          # Управление персонажем
│   ├── MapPlayer.tsx              # Визуализация персонажа
│   └── WorldMap.tsx               # Обновленный компонент карты мира
└── lib/
    └── tiledMapRenderer.ts        # Рендерер карт Tiled
```

## Возможности

### 1. Отображение карты
- Автоматическая загрузка и рендеринг карты из JSON
- Поддержка всех слоев карты
- Корректное отображение тайлсетов

### 2. Управление персонажем
- Движение стрелками или WASD
- Визуальная анимация движения
- Ограничения границ карты
- Отображение текущей позиции

### 3. Режимы просмотра
- **Tiled Карта**: Интерактивная карта с управлением
- **Города**: Классический вид с городами

## Использование

### Базовое использование
```tsx
import TiledMapViewer from '@/components/TiledMapViewer'

<TiledMapViewer
  mapData={mapData}
  enablePlayerControl={true}
  onTileClick={(x, y, tileId) => console.log(`Clicked: ${x}, ${y}`)}
/>
```

### Расширенное использование
```tsx
import { TiledMapRenderer } from '@/lib/tiledMapRenderer'

const renderer = new TiledMapRenderer(canvas)
await renderer.loadMap(mapData)

// Проверка проходимости тайла
const isWalkable = renderer.isWalkable(x, y)

// Получение ID тайла
const tileId = renderer.getTileAt(x, y)
```

## Технические детали

### Поддерживаемые форматы
- **TMJ (JSON)**: Рекомендуемый формат
- **TMX (XML)**: Поддерживается, но JSON предпочтительнее
- **JS**: Модульный формат для прямого импорта

### Сжатие данных
- ✅ Base64 кодирование
- ✅ Zlib сжатие (через библиотеку pako)
- ❌ Gzip сжатие (не поддерживается)

### Тайлсеты
- Автоматическая загрузка изображений
- Поддержка множественных тайлсетов
- Оптимизированное кэширование

## Настройка

### Изменение путей к ресурсам
```typescript
// В tiledMapRenderer.ts
private getTilesetImagePath(imagePath: string): string {
  const fileName = imagePath.split('/').pop() || imagePath.split('\\').pop()
  return `/assets/tilesets/${fileName}` // Измените путь здесь
}
```

### Добавление новых карт
1. Экспортируйте карту из Tiled в JSON формат
2. Поместите файл в `public/assets/maps/`
3. Обновите путь в `WorldMap.tsx`:
```typescript
const response = await fetch('/assets/maps/your_map.json')
```

## Производительность

### Оптимизации
- Ленивая загрузка тайлсетов
- Кэширование декомпрессированных данных
- Оптимизированный рендеринг canvas

### Рекомендации
- Используйте карты размером до 100x100 тайлов для мобильных устройств
- Оптимизируйте размер тайлсетов (рекомендуется до 1024x1024px)
- Используйте zlib сжатие для больших карт

## Расширения

### Добавление коллизий
```typescript
// В MapController.tsx
const movePlayer = (deltaX: number, deltaY: number) => {
  const newX = Math.max(0, Math.min(mapWidth - 1, playerX + deltaX))
  const newY = Math.max(0, Math.min(mapHeight - 1, playerY + deltaY))
  
  // Проверка коллизий
  if (rendererRef.current?.isWalkable(newX * tileSize, newY * tileSize)) {
    // Разрешить движение
  }
}
```

### Добавление событий
```typescript
// В TiledMapViewer.tsx
const handleTileClick = (x: number, y: number, tileId: number) => {
  if (tileId === SPECIAL_TILE_ID) {
    // Обработка специального события
  }
}
```

## Отладка

### Консольные сообщения
- Загрузка карты: `"Tiled map loaded successfully!"`
- Движение персонажа: `"Player moved to: x, y"`
- Ошибки загрузки: `"Failed to load map data"`

### Проверка данных
```typescript
console.log('Map data:', mapData)
console.log('Tilesets loaded:', renderer.loadedTilesets)
console.log('Total tilesets:', renderer.totalTilesets)
```

## Следующие шаги

1. **Добавление коллизий**: Определите непроходимые тайлы
2. **События на карте**: Добавьте интерактивные элементы
3. **Анимации**: Создайте анимированные тайлы
4. **Множественные карты**: Реализуйте переходы между картами
5. **Сохранение позиции**: Интегрируйте с системой сохранений

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что все файлы загружены в `public/assets/`
3. Проверьте корректность JSON структуры карты
4. Убедитесь, что все тайлсеты доступны по указанным путям
