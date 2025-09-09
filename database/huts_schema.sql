-- Таблица зон для строительства хижин
CREATE TABLE IF NOT EXISTS hut_zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    description TEXT,
    base_price INTEGER NOT NULL DEFAULT 0,
    price_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    max_huts INTEGER NOT NULL DEFAULT 10,
    center_x INTEGER NOT NULL DEFAULT 0,
    center_y INTEGER NOT NULL DEFAULT 0,
    radius INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица хижин
CREATE TABLE IF NOT EXISTS huts (
    id VARCHAR(50) PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    width INTEGER NOT NULL DEFAULT 4,
    height INTEGER NOT NULL DEFAULT 4,
    zone_id VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    wood INTEGER NOT NULL DEFAULT 0,
    stone INTEGER NOT NULL DEFAULT 0,
    metal INTEGER NOT NULL DEFAULT 0,
    gems INTEGER NOT NULL DEFAULT 0,
    food INTEGER NOT NULL DEFAULT 0,
    max_storage INTEGER NOT NULL DEFAULT 1000,
    last_visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zone_id) REFERENCES hut_zones(id),
    INDEX idx_owner_id (owner_id),
    INDEX idx_position (x, y),
    INDEX idx_zone (zone_id)
);

-- Таблица улучшений хижин
CREATE TABLE IF NOT EXISTS hut_upgrades (
    id VARCHAR(50) PRIMARY KEY,
    hut_id VARCHAR(50) NOT NULL,
    upgrade_type VARCHAR(50) NOT NULL, -- 'storage', 'defense', 'decoration', 'utility'
    name VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    cost INTEGER NOT NULL DEFAULT 0,
    effects JSON, -- JSON объект с эффектами улучшения
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hut_id) REFERENCES huts(id) ON DELETE CASCADE,
    INDEX idx_hut_id (hut_id),
    INDEX idx_upgrade_type (upgrade_type)
);

-- Вставляем базовые зоны
INSERT INTO hut_zones (id, name, emoji, description, base_price, price_multiplier, max_huts, center_x, center_y, radius) VALUES
('center', 'Центральная зона', '🏰', 'Престижная зона в центре карты', 10000, 1.0, 5, 100, 100, 50),
('inner', 'Внутренняя зона', '🏘️', 'Близко к центру, хорошее расположение', 5000, 0.7, 15, 100, 100, 100),
('outer', 'Внешняя зона', '🏕️', 'Дальше от центра, но доступнее по цене', 2000, 0.4, 30, 100, 100, 200),
('wilderness', 'Дикая зона', '🌲', 'Самые дешевые участки на окраинах', 500, 0.1, 50, 100, 100, 300);

-- Создаем индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_huts_zone_position ON huts(zone_id, x, y);
CREATE INDEX IF NOT EXISTS idx_huts_owner_zone ON huts(owner_id, zone_id);
CREATE INDEX IF NOT EXISTS idx_huts_last_visited ON huts(last_visited);

-- Функция для проверки коллизий при строительстве
DELIMITER //
CREATE FUNCTION check_hut_collision(
    new_x INT,
    new_y INT,
    new_width INT,
    new_height INT,
    exclude_hut_id VARCHAR(50)
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE collision_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO collision_count
    FROM huts
    WHERE id != exclude_hut_id
    AND new_x < x + width
    AND new_x + new_width > x
    AND new_y < y + height
    AND new_y + new_height > y;
    
    RETURN collision_count > 0;
END//
DELIMITER ;

-- Функция для расчета стоимости хижины
DELIMITER //
CREATE FUNCTION calculate_hut_price(
    hut_x INT,
    hut_y INT,
    zone_id VARCHAR(50)
) RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE base_price INT;
    DECLARE price_multiplier DECIMAL(3,2);
    DECLARE center_x INT;
    DECLARE center_y INT;
    DECLARE radius INT;
    DECLARE distance_from_center DECIMAL(10,2);
    DECLARE distance_multiplier DECIMAL(3,2);
    DECLARE final_price INT;
    
    -- Получаем данные зоны
    SELECT hz.base_price, hz.price_multiplier, hz.center_x, hz.center_y, hz.radius
    INTO base_price, price_multiplier, center_x, center_y, radius
    FROM hut_zones hz
    WHERE hz.id = zone_id;
    
    -- Вычисляем расстояние от центра
    SET distance_from_center = SQRT(POW(hut_x - center_x, 2) + POW(hut_y - center_y, 2));
    
    -- Вычисляем множитель расстояния (ближе к центру = дороже)
    SET distance_multiplier = GREATEST(0.1, 1 - (distance_from_center / radius) * 0.9);
    
    -- Вычисляем финальную цену
    SET final_price = FLOOR(base_price * price_multiplier * distance_multiplier);
    
    RETURN final_price;
END//
DELIMITER ;
