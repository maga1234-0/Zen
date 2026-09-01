-- ============================================
-- PHASE 1: AJOUTER SUPPORT PAIEMENTS RESTAURANT/SPA
-- ============================================
-- Ce script modifie les tables payments et invoices
-- pour supporter les paiements restaurant et spa
-- ============================================

-- 1. Ajouter colonnes à la table payments
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'room';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS restaurant_order_id UUID REFERENCES restaurant_orders(id) ON DELETE CASCADE;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS spa_booking_id UUID REFERENCES spa_bookings(id) ON DELETE CASCADE;

-- 2. Ajouter colonnes à la table invoices (si elle existe)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_type VARCHAR(50) DEFAULT 'room';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS restaurant_order_id UUID REFERENCES restaurant_orders(id) ON DELETE CASCADE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS spa_booking_id UUID REFERENCES spa_bookings(id) ON DELETE CASCADE;

-- 3. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_payments_payment_type ON payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_payments_restaurant_order ON payments(restaurant_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_spa_booking ON payments(spa_booking_id);

CREATE INDEX IF NOT EXISTS idx_invoices_invoice_type ON invoices(invoice_type);
CREATE INDEX IF NOT EXISTS idx_invoices_restaurant_order ON invoices(restaurant_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_spa_booking ON invoices(spa_booking_id);

-- 4. Mettre à jour les paiements existants pour avoir le type 'room'
UPDATE payments 
SET payment_type = 'room' 
WHERE payment_type IS NULL;

UPDATE invoices 
SET invoice_type = 'room' 
WHERE invoice_type IS NULL;

-- 5. Vérification: Afficher la structure modifiée
SELECT 
    'payments' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'payments' 
AND column_name IN ('payment_type', 'restaurant_order_id', 'spa_booking_id')
ORDER BY ordinal_position;

SELECT 
    'invoices' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'invoices' 
AND column_name IN ('invoice_type', 'restaurant_order_id', 'spa_booking_id')
ORDER BY ordinal_position;

-- 6. Afficher un résumé
DO $$
DECLARE
    payment_count INTEGER;
    invoice_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO payment_count FROM payments;
    SELECT COUNT(*) INTO invoice_count FROM invoices;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Script exécuté avec succès!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Modifications apportées:';
    RAISE NOTICE '  • Table payments: 3 colonnes ajoutées (payment_type, restaurant_order_id, spa_booking_id)';
    RAISE NOTICE '  • Table invoices: 3 colonnes ajoutées (invoice_type, restaurant_order_id, spa_booking_id)';
    RAISE NOTICE '  • 6 index créés pour améliorer les performances';
    RAISE NOTICE '';
    RAISE NOTICE '📈 Données actuelles:';
    RAISE NOTICE '  • Paiements existants: %', payment_count;
    RAISE NOTICE '  • Factures existantes: %', invoice_count;
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Prochaine étape:';
    RAISE NOTICE '  Vous pouvez maintenant enregistrer des paiements pour:';
    RAISE NOTICE '  - Réservations chambres (payment_type = ''room'')';
    RAISE NOTICE '  - Commandes restaurant (payment_type = ''restaurant'')';
    RAISE NOTICE '  - Réservations spa (payment_type = ''spa'')';
    RAISE NOTICE '';
END $$;
