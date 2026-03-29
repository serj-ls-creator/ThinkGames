-- SQL скрипт для очистки дубликатов в game_progress
-- Удаляет старые записи, оставляя только самые новые для каждой пары user_id + category

-- Сначала создаем временную таблицу с уникальными записями (самые новые)
CREATE TEMPORARY TABLE temp_game_progress AS
SELECT t1.*
FROM game_progress t1
INNER JOIN (
    SELECT user_id, category, MAX(created_at) as max_created_at
    FROM game_progress
    GROUP BY user_id, category
) t2 ON t1.user_id = t2.user_id 
    AND t1.category = t2.category 
    AND t1.created_at = t2.max_created_at;

-- Удаляем все записи из основной таблицы
DELETE FROM game_progress;

-- Вставляем только уникальные записи (самые новые)
INSERT INTO game_progress 
SELECT * FROM temp_game_progress;

-- Удаляем временную таблицу
DROP TABLE temp_game_progress;

-- Проверяем результат
SELECT user_id, category, score, created_at 
FROM game_progress 
ORDER BY user_id, category, created_at;
