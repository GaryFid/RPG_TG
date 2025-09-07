-- Создание таблиц для tgRPG игры в Supabase

-- Удаляем существующие таблицы если есть (осторожно!)
-- DROP TABLE IF EXISTS public.character_quests;
-- DROP TABLE IF EXISTS public.trades;
-- DROP TABLE IF EXISTS public.battles;
-- DROP TABLE IF EXISTS public.characters;
-- DROP TABLE IF EXISTS public.users;

-- Создаем таблицу пользователей
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу персонажей
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
    UNIQUE(user_id)
);

-- Создаем таблицу битв
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

-- Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON public.users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON public.characters(user_id);
CREATE INDEX IF NOT EXISTS idx_battles_character_id ON public.battles(character_id);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автообновления updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_characters_updated_at ON public.characters;
CREATE TRIGGER update_characters_updated_at 
    BEFORE UPDATE ON public.characters 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Включаем Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики если есть
DROP POLICY IF EXISTS "Enable all operations for service role" ON public.users;
DROP POLICY IF EXISTS "Enable all operations for service role" ON public.characters;
DROP POLICY IF EXISTS "Enable all operations for service role" ON public.battles;

-- Создаем простые политики для service role (API будет использовать service key)
CREATE POLICY "Enable all operations for service role" ON public.users
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for service role" ON public.characters
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for service role" ON public.battles
    FOR ALL USING (true);

-- Даем права на таблицы
GRANT ALL ON public.users TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.characters TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.battles TO postgres, anon, authenticated, service_role;

-- Даем права на последовательности
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
