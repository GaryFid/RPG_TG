# tgRPG - Fantasy Strategy Game for Telegram WebApp

Стратегическая фэнтези RPG игра для Telegram WebApp с интеграцией Web3.

## 🎮 Особенности игры

- **4 уникальные расы**: Люди 👨‍⚔️, Эльфы 🧝‍♀️, Нежить ☠️, Орки 👹
- **8 городов**: Каждый с уникальными магазинами, услугами и квестами
- **Открытый мир**: Локации с монстрами, аренами и сокровищами
- **Система крафта**: Создание оружия и экипировки
- **Боевая система**: Пошаговые сражения с монстрами
- **Торговля**: Обмен ресурсами между городами
- **Web3 интеграция**: Криптовалютные платежи (в планах)

## 🚀 Технологический стек

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Telegram WebApp
- **Deployment**: Vercel
- **Web3**: Будет добавлено позднее

## 📦 Установка и запуск

### Предварительные требования

- Node.js 18+
- npm или yarn
- Аккаунт Supabase
- Telegram Bot (для продакшена)

### 1. Клонирование репозитория

\`\`\`bash
git clone <your-repo-url>
cd tgrpg
\`\`\`

### 2. Установка зависимостей

\`\`\`bash
npm install
\`\`\`

### 3. Настройка переменных окружения

Создайте файл \`.env.local\` в корне проекта:

\`\`\`env
# Telegram Bot Configuration
NEXT_PUBLIC_BOT_USERNAME=your_bot_username
TELEGRAM_BOT_TOKEN=your_bot_token

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Web3 Configuration (для будущего использования)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_NETWORK=polygon

# Redis Configuration (если потребуется)
REDIS_URL=redis://localhost:6379
\`\`\`

### 4. Настройка базы данных Supabase

1. Создайте новый проект в [Supabase](https://supabase.com)
2. Выполните SQL-скрипт из файла \`database/schema.sql\` в SQL Editor
3. Включите Row Level Security для всех таблиц
4. Скопируйте URL проекта и anon key в \`.env.local\`

### 5. Запуск приложения

\`\`\`bash
npm run dev
\`\`\`

Приложение будет доступно по адресу: http://localhost:3000

## 🤖 Настройка Telegram Bot

### Создание бота

1. Напишите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте \`/newbot\` и следуйте инструкциям
3. Получите токен бота и сохраните его в \`.env.local\`

### Настройка WebApp

1. Отправьте \`/setmenubutton\` BotFather'у
2. Выберите ваш бот
3. Укажите URL вашего приложения (для продакшена)
4. Отправьте название кнопки: "🎮 Играть"

### Команды для бота

\`\`\`
start - 🚀 Начать игру
help - ❓ Справка по командам
profile - 👤 Профиль персонажа
stats - 📊 Статистика
\`\`\`

## 📁 Структура проекта

\`\`\`
tgrpg/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── globals.css   # Глобальные стили
│   │   ├── layout.tsx    # Корневой layout
│   │   └── page.tsx      # Главная страница
│   ├── components/       # React компоненты
│   │   └── CharacterCreation.tsx
│   ├── lib/              # Утилиты и конфигурация
│   │   ├── gameData.ts   # Игровые данные
│   │   └── supabase.ts   # Конфигурация Supabase
│   ├── stores/           # Zustand store
│   │   └── gameStore.ts  # Главный store игры
│   ├── types/            # TypeScript типы
│   │   ├── game.ts       # Игровые типы
│   │   └── telegram.ts   # Telegram WebApp типы
│   ├── hooks/            # React hooks
│   └── utils/            # Вспомогательные функции
├── database/
│   └── schema.sql        # SQL схема базы данных
├── public/               # Статические файлы
└── ...конфигурационные файлы
\`\`\`

## 🎯 Игровые механики

### Расы и их бонусы

| Раса | Сила | Ловкость | Интеллект | Выносливость |
|------|------|----------|-----------|--------------|
| Люди 👨‍⚔️ | +5 | +5 | +5 | +10 |
| Эльфы 🧝‍♀️ | 0 | +15 | +10 | 0 |
| Нежить ☠️ | +8 | +2 | +10 | +5 |
| Орки 👹 | +20 | 0 | -5 | +10 |

### Города

1. **Столица Королевства** 👑 - Центр торговли людей
2. **Эльфийское Святилище** 🌳 - Магический город эльфов
3. **Некрополис** 🏚️ - Темный город нежити
4. **Крепость Орков** 🏔️ - Горная твердыня орков
5. **Торговый Порт** ⚓ - Нейтральный торговый центр
6. **Хрустальные Пещеры** 💎 - Подземный город
7. **Костяная Цитадель** 🦴 - Крепость нежити
8. **Железные Рудники** ⛏️ - Промышленный город

## 🚀 Деплой на Vercel

### 1. Подготовка репозитория

\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### 2. Настройка Vercel

1. Зайдите на [Vercel](https://vercel.com)
2. Подключите ваш GitHub репозиторий
3. Добавьте переменные окружения:
   - \`NEXT_PUBLIC_SUPABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   - \`SUPABASE_SERVICE_ROLE_KEY\`
   - \`NEXT_PUBLIC_APP_URL\` (ваш Vercel URL)

### 3. Обновление Telegram Bot

После деплоя обновите URL WebApp у BotFather на ваш Vercel URL.

## 🔧 Разработка

### Запуск в режиме разработки

\`\`\`bash
npm run dev
\`\`\`

### Билд для продакшена

\`\`\`bash
npm run build
npm start
\`\`\`

### Линтинг

\`\`\`bash
npm run lint
\`\`\`

## 📊 База данных

### Основные таблицы

- \`users\` - Пользователи Telegram
- \`characters\` - Персонажи игроков
- \`battles\` - История битв
- \`character_quests\` - Активные квесты
- \`trades\` - Торговые операции

### Важные функции

- \`get_character_by_telegram_id()\` - Получение персонажа по Telegram ID
- \`create_character()\` - Создание нового персонажа

## 🛠️ TODO List

### ✅ Выполнено
- [x] Базовая структура Next.js проекта
- [x] Интеграция с Telegram WebApp
- [x] Настройка Supabase
- [x] Система создания персонажей
- [x] Игровые типы и данные
- [x] State management с Zustand

### 🔄 В процессе
- [ ] Карта мира с 8 городами
- [ ] Боевая система
- [ ] Торговая система
- [ ] Система крафта

### 📋 Планируется
- [ ] Web3 интеграция
- [ ] Система квестов
- [ ] Мультиплеер функции
- [ ] Достижения и рейтинги

## 🤝 Участие в разработке

1. Fork проекта
2. Создайте feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit изменения (\`git commit -m 'Add some AmazingFeature'\`)
4. Push в branch (\`git push origin feature/AmazingFeature\`)
5. Откройте Pull Request

## 📄 Лицензия

Распространяется под лицензией MIT. Подробности в файле \`LICENSE\`.

## 📞 Контакты

Telegram: [@your_username](https://t.me/your_username)

---

**🌟 Добро пожаловать в мир tgRPG! Пусть ваши приключения будут эпическими! ⚔️**
