-- FIX: Mise à jour de la contrainte CHECK pour restaurant_orders.status
-- Si la contrainte existe, on la supprime et on la recrée avec tous les statuts

-- 1. Supprimer l'ancienne contrainte si elle existe
ALTER TABLE restaurant_orders 
DROP CONSTRAINT IF EXISTS restaurant_orders_status_check;

-- 2. Ajouter la nouvelle contrainte avec TOUS les statuts
ALTER TABLE restaurant_orders 
ADD CONSTRAINT restaurant_orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'));

-- 3. Vérifier que la contrainte a été ajoutée
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'restaurant_orders'::regclass
AND conname = 'restaurant_orders_status_check';

-- 4. Test: Essayer de mettre à jour une commande (remplacer 'order-id' par un vrai ID)
-- SELECT id, order_number, status FROM restaurant_orders WHERE status = 'pending' LIMIT 1;
-- UPDATE restaurant_orders SET status = 'preparing' WHERE id = 'order-id-from-above';

SELECT '✅ Contrainte CHECK mise à jour pour accepter tous les statuts' AS message;
