-- Diagnostic des contraintes sur restaurant_orders.payment_status

-- 1. Voir toutes les contraintes CHECK sur restaurant_orders
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'restaurant_orders'::regclass
  AND contype = 'c';

-- 2. Voir les colonnes et leurs valeurs par défaut
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'restaurant_orders' 
  AND column_name = 'payment_status';

-- 3. Voir des exemples de valeurs existantes
SELECT DISTINCT payment_status
FROM restaurant_orders
ORDER BY payment_status;
