// Tiled Map Renderer для отображения карт из Tiled Editor
import * as pako from 'pako'
export interface TiledMap {
  width: number
  height: number
  tilewidth: number
  tileheight: number
  layers: TiledLayer[]
  tilesets: TiledTileset[]
}

export interface TiledLayer {
  id: number
  name: string
  width: number
  height: number
  data: string
  encoding: string
  compression: string
  opacity: number
  visible: boolean
  type: string
}

export interface TiledTileset {
  firstgid: number
  name: string
  image: string
  imagewidth: number
  imageheight: number
  tilewidth: number
  tileheight: number
  tilecount: number
  columns: number
}

export class TiledMapRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private map: TiledMap
  private tilesets: Map<number, HTMLImageElement> = new Map()
  private loadedTilesets: number = 0
  private totalTilesets: number = 0
  private onLoadCallback?: () => void

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
  }

  async loadMap(mapData: TiledMap): Promise<void> {
    this.map = mapData
    this.totalTilesets = mapData.tilesets.length
    
    // Загружаем все тайлсеты
    const loadPromises = mapData.tilesets.map((tileset, index) => 
      this.loadTileset(tileset, index)
    )
    
    await Promise.all(loadPromises)
    
    // Рендерим карту
    this.renderMap()
    
    if (this.onLoadCallback) {
      this.onLoadCallback()
    }
  }

  private async loadTileset(tileset: TiledTileset, index: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.tilesets.set(tileset.firstgid, img)
        this.loadedTilesets++
        resolve()
      }
      img.onerror = () => {
        console.error(`Failed to load tileset: ${tileset.image}`)
        reject(new Error(`Failed to load tileset: ${tileset.image}`))
      }
      
      // Преобразуем путь к тайлсету
      const imagePath = this.getTilesetImagePath(tileset.image)
      img.src = imagePath
    })
  }

  private getTilesetImagePath(imagePath: string): string {
    // Извлекаем имя файла из пути
    const fileName = imagePath.split('/').pop() || imagePath.split('\\').pop()
    return `/assets/tilesets/${fileName}`
  }

  private renderMap(): void {
    if (this.loadedTilesets !== this.totalTilesets) {
      console.warn('Not all tilesets loaded yet')
      return
    }

    // Устанавливаем размер canvas
    this.canvas.width = this.map.width * this.map.tilewidth
    this.canvas.height = this.map.height * this.map.tileheight

    // Очищаем canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Рендерим каждый слой
    this.map.layers.forEach(layer => {
      if (layer.visible && layer.type === 'tilelayer') {
        this.renderLayer(layer)
      }
    })
  }

  private renderLayer(layer: TiledLayer): void {
    const tileData = this.decodeLayerData(layer.data, layer.compression, layer.encoding)
    
    for (let y = 0; y < layer.height; y++) {
      for (let x = 0; x < layer.width; x++) {
        const tileIndex = y * layer.width + x
        const gid = tileData[tileIndex]
        
        if (gid > 0) {
          this.renderTile(gid, x, y)
        }
      }
    }
  }

  private decodeLayerData(data: string, compression: string, encoding: string): number[] {
    if (encoding === 'base64') {
      const binaryString = atob(data)
      let bytes: Uint8Array
      
      if (compression === 'zlib') {
        try {
          // Декомпрессируем zlib данные
          const compressed = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            compressed[i] = binaryString.charCodeAt(i)
          }
          bytes = pako.inflate(compressed)
        } catch (error) {
          console.error('Failed to decompress zlib data:', error)
          return new Array(this.map.width * this.map.height).fill(0)
        }
      } else {
        bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
      }
      
      // Конвертируем bytes в массив чисел (little-endian)
      const result: number[] = []
      for (let i = 0; i < bytes.length; i += 4) {
        const gid = bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)
        result.push(gid)
      }
      
      return result
    }
    
    return []
  }

  private renderTile(gid: number, x: number, y: number): void {
    // Находим подходящий тайлсет
    let tileset: TiledTileset | null = null
    for (const ts of this.map.tilesets) {
      if (gid >= ts.firstgid) {
        tileset = ts
      } else {
        break
      }
    }

    if (!tileset) return

    const img = this.tilesets.get(tileset.firstgid)
    if (!img) return

    // Вычисляем позицию тайла в тайлсете
    const localId = gid - tileset.firstgid
    const tilesPerRow = tileset.columns
    const tileX = (localId % tilesPerRow) * tileset.tilewidth
    const tileY = Math.floor(localId / tilesPerRow) * tileset.tileheight

    // Позиция на canvas
    const canvasX = x * this.map.tilewidth
    const canvasY = y * this.map.tileheight

    // Рендерим тайл
    this.ctx.drawImage(
      img,
      tileX, tileY, tileset.tilewidth, tileset.tileheight,
      canvasX, canvasY, this.map.tilewidth, this.map.tileheight
    )
  }

  onLoad(callback: () => void): void {
    this.onLoadCallback = callback
  }

  // Метод для получения информации о тайле по координатам
  getTileAt(x: number, y: number): number {
    const tileX = Math.floor(x / this.map.tilewidth)
    const tileY = Math.floor(y / this.map.tileheight)
    
    if (tileX < 0 || tileX >= this.map.width || tileY < 0 || tileY >= this.map.height) {
      return 0
    }

    // Получаем данные из первого слоя (обычно это основной слой карты)
    const layer = this.map.layers[0]
    if (!layer) return 0

    const tileData = this.decodeLayerData(layer.data, layer.compression, layer.encoding)
    const tileIndex = tileY * layer.width + tileX
    
    return tileData[tileIndex] || 0
  }

  // Метод для проверки, можно ли пройти по координатам
  isWalkable(x: number, y: number): boolean {
    const tileId = this.getTileAt(x, y)
    // Здесь можно добавить логику для определения проходимости тайлов
    // Например, определенные ID тайлов могут быть непроходимыми
    return tileId > 0 // Пока что считаем все тайлы проходимыми
  }
}
