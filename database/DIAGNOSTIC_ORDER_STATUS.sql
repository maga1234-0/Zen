-- DIAGNOSTIC: Vérifier la commande qui cause l'erreur 500

-- 1. Vérifier la commande ORD-20260602-0001
SELECT 
    id,
    order_number,
    status,
    order_type,
    table_id,
    room_id,
    guest_id,
    server_id,
    created_by,
    created_at
FROM restaurant_orders 
WHERE order_number = 'ORD-20260602-0001';

-- 2. Vérifier toutes les commandes en attente
SELECT 
    id,
    order_number,
    status,
    order_type,
    table_id,
    room_id,
    total_amount,
    created_at
FROM restaurant_orders 
WHERE status = 'pending'
ORDER BY created_at DESC;

-- 3. Tester UPDATE manuellement
-- REMPLACEZ 'order-id-here' par l'ID réel de la commande
/*
UPDATE restaurant_orders 
SET status = 'preparing', 
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'order-id-here'
RETURNING *;
*/

-- 4. Vérifier les contraintes sur la table
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'restaurant_orders'::regclass;

-- 5. Vérifier les valeurs possibles pour status
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'restaurant_orders' 
AND column_name = 'status';

-- 6. Vérifier s'il y a un check constraint sur status
SELECT 
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'restaurant_orders';
