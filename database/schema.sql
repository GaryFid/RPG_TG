-- Создание базовых таблиц для tgRPG игры

-- Включение Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица персонажей
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    race VARCHAR(20) NOT NULL CHECK (race IN ('human', 'elf', 'undead', 'orc')),
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    health INTEGER DEFAULT 100,
    max_health INTEGER DEFAULT 100,
    mana INTEGER DEFAULT 50,
    max_mana INTEGER DEFAULT 50,
    strength INTEGER DEFAULT 10,
    agility INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    vitality INTEGER DEFAULT 10,
    gold INTEGER DEFAULT 100,
    current_city VARCHAR(50) DEFAULT 'kingdom_capital',
    equipment JSONB DEFAULT '{}',
    inventory JSONB DEFAULT '[]',
    skills JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id) -- Один персонаж на пользователя
);

-- Таблица битв
CREATE TABLE IF NOT EXISTS public.battles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
    monster_id VARCHAR(50) NOT NULL,
    result VARCHAR(20) CHECK (result IN ('victory', 'defeat')) NOT NULL,
    experience_gained INTEGER DEFAULT 0,
    gold_gained INTEGER DEFAULT 0,
    items_gained JSONB DEFAULT '[]',
    battle_log JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица квестов (активные квесты игроков)
CREATE TABLE IF NOT EXISTS public.character_quests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
    quest_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    progress JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    UNIQUE(character_id, quest_id)
);

-- Таблица торгов между игроками (для будущего использования)
CREATE TABLE IF NOT EXISTS public.trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
    item_id VARCHAR(50) NOT NULL,
    quantity INTEGER DEFAULT 1,
    price INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE NULL
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON public.users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON public.characters(user_id);
CREATE INDEX IF NOT EXISTS idx_battles_character_id ON public.battles(character_id);
CREATE INDEX IF NOT EXISTS idx_character_quests_character_id ON public.character_quests(character_id);
CREATE INDEX IF NOT EXISTS idx_trades_seller_id ON public.trades(seller_id);
CREATE INDEX IF NOT EXISTS idx_trades_buyer_id ON public.trades(buyer_id);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автообновления updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_characters_updated_at 
    BEFORE UPDATE ON public.characters 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security (RLS) политики
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Политики для пользователей (каждый пользователь видит только свои данные)
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (telegram_id = (current_setting('app.current_user_id'))::BIGINT);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (telegram_id = (current_setting('app.current_user_id'))::BIGINT);

-- Политики для персонажей
CREATE POLICY "Users can view own characters" ON public.characters
    FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE telegram_id = (current_setting('app.current_user_id'))::BIGINT));

CREATE POLICY "Users can update own characters" ON public.characters
    FOR UPDATE USING (user_id IN (SELECT id FROM public.users WHERE telegram_id = (current_setting('app.current_user_id'))::BIGINT));

CREATE POLICY "Users can insert own characters" ON public.characters
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE telegram_id = (current_setting('app.current_user_id'))::BIGINT));

-- Политики для битв
CREATE POLICY "Users can view own battles" ON public.battles
    FOR SELECT USING (character_id IN (
        SELECT id FROM public.characters 
        WHERE user_id IN (SELECT id FROM public.users WHERE telegram_id = (current_setting('app.current_user_id'))::BIGINT)
    ));

CREATE POLICY "Users can insert own battles" ON public.battles
    FOR INSERT WITH CHECK (character_id IN (
        SELECT id FROM public.characters 
        WHERE user_id IN (SELECT id FROM public.users WHERE telegram_id = (current_setting('app.current_user_id'))::BIGINT)
    ));

-- Функции для игровой логики
CREATE OR REPLACE FUNCTION get_character_by_telegram_id(telegram_user_id BIGINT)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    race VARCHAR,
    level INTEGER,
    experience INTEGER,
    health INTEGER,
    max_health INTEGER,
    mana INTEGER,
    max_mana INTEGER,
    strength INTEGER,
    agility INTEGER,
    intelligence INTEGER,
    vitality INTEGER,
    gold INTEGER,
    current_city VARCHAR,
    equipment JSONB,
    inventory JSONB,
    skills JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.name, c.race, c.level, c.experience, 
           c.health, c.max_health, c.mana, c.max_mana,
           c.strength, c.agility, c.intelligence, c.vitality,
           c.gold, c.current_city, c.equipment, c.inventory, c.skills
    FROM public.characters c
    JOIN public.users u ON c.user_id = u.id
    WHERE u.telegram_id = telegram_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для создания нового персонажа
CREATE OR REPLACE FUNCTION create_character(
    telegram_user_id BIGINT,
    character_name VARCHAR(50),
    character_race VARCHAR(20)
)
RETURNS UUID AS $$
DECLARE
    user_uuid UUID;
    character_uuid UUID;
    race_bonuses JSONB;
BEGIN
    -- Получаем ID пользователя
    SELECT id INTO user_uuid FROM public.users WHERE telegram_id = telegram_user_id;
    
    -- Если пользователя нет, создаем его
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Проверяем, нет ли уже персонажа у этого пользователя
    IF EXISTS (SELECT 1 FROM public.characters WHERE user_id = user_uuid) THEN
        RAISE EXCEPTION 'Character already exists for this user';
    END IF;
    
    -- Бонусы расы (упрощенная версия)
    CASE character_race
        WHEN 'human' THEN race_bonuses := '{"strength": 5, "agility": 5, "intelligence": 5, "vitality": 10}'::jsonb;
        WHEN 'elf' THEN race_bonuses := '{"strength": 0, "agility": 15, "intelligence": 10, "vitality": 0}'::jsonb;
        WHEN 'undead' THEN race_bonuses := '{"strength": 8, "agility": 2, "intelligence": 10, "vitality": 5}'::jsonb;
        WHEN 'orc' THEN race_bonuses := '{"strength": 20, "agility": 0, "intelligence": -5, "vitality": 10}'::jsonb;
        ELSE RAISE EXCEPTION 'Invalid race';
    END CASE;
    
    -- Создаем персонажа
    INSERT INTO public.characters (
        user_id, name, race,
        strength, agility, intelligence, vitality,
        max_health, health, max_mana, mana
    ) VALUES (
        user_uuid, character_name, character_race,
        10 + (race_bonuses->>'strength')::integer,
        10 + (race_bonuses->>'agility')::integer,
        10 + (race_bonuses->>'intelligence')::integer,
        10 + (race_bonuses->>'vitality')::integer,
        100 + (race_bonuses->>'vitality')::integer * 5,
        100 + (race_bonuses->>'vitality')::integer * 5,
        50 + (race_bonuses->>'intelligence')::integer * 2,
        50 + (race_bonuses->>'intelligence')::integer * 2
    ) RETURNING id INTO character_uuid;
    
    RETURN character_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
