-- 🔧 FIX PAIEMENTS DASHBOARD - VERSION SIMPLE
-- ═══════════════════════════════════════════════════════════════════

-- ÉTAPE 1: Voir la structure de la table payments
SELECT 
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- ═══════════════════════════════════════════════════════════════════

-- ÉTAPE 2: Lister TOUS les paiements (peu importe les colonnes)
SELECT * FROM payments ORDER BY id DESC LIMIT 10;

-- ═══════════════════════════════════════════════════════════════════

-- ÉTAPE 3: Corriger TOUS les paiements
-- (sans utiliser created_at qui n'existe peut-être pas)

UPDATE payments 
SET 
    status = 'completed',
    payment_date = COALESCE(payment_date, NOW())
WHERE status IS NULL 
   OR status != 'completed' 
   OR payment_date IS NULL;

-- ═══════════════════════════════════════════════════════════════════

-- ÉTAPE 4: Vérifier le résultat
SELECT 
    COUNT(*) as nombre_paiements_total,
    COUNT(*) FILTER (WHERE status = 'completed') as paiements_completed,
    COALESCE(SUM(amount), 0) as montant_total
FROM payments;

-- ═══════════════════════════════════════════════════════════════════

-- ÉTAPE 5: Calcul exact du Dashboard (Revenue 30 derniers jours)
SELECT 
    COUNT(*) as nombre_paiements,
    COALESCE(SUM(p.amount), 0) as revenue_devrait_afficher,
    '💰 Ce montant devrait apparaître sur le Dashboard' as note
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE b.hotel_id = (SELECT id FROM hotels LIMIT 1)
AND p.payment_date >= NOW() - INTERVAL '30 days'
AND p.status = 'completed';

-- ═══════════════════════════════════════════════════════════════════

-- ÉTAPE 6: Détails des paiements qui seront comptés
SELECT 
    p.id,
    p.amount,
    p.status,
    p.payment_date,
    p.payment_method,
    b.id as booking_id,
    '✅ Compté dans Dashboard' as statut
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE p.status = 'completed'
AND p.payment_date >= NOW() - INTERVAL '30 days'
AND b.hotel_id = (SELECT id FROM hotels LIMIT 1)
ORDER BY p.payment_date DESC;

-- ═══════════════════════════════════════════════════════════════════
-- 📝 INSTRUCTIONS
-- ═══════════════════════════════════════════════════════════════════

/*
RÉSULTATS ATTENDUS:

Table 1: Structure de la table payments (voir quelles colonnes existent)
Table 2: Vos 10 derniers paiements
Table 3: Nombre de paiements corrigés
Table 4: Total des paiements
Table 5: MONTANT QUI DEVRAIT S'AFFICHER SUR LE DASHBOARD ⭐
Table 6: Détails des paiements comptés

Après avoir exécuté ce script:
1. Noter le "revenue_devrait_afficher" de la Table 5
2. Rafraîchir le Dashboard (Ctrl+Shift+R)
3. Vérifier que ce montant s'affiche

SI REVENUE = 0 dans la Table 5:
Cela signifie qu'aucun paiement ne remplit toutes les conditions:
- status = 'completed'
- payment_date dans les 30 derniers jours
- booking_id valide avec hotel_id correct

SOLUTION: Créer un paiement test avec toutes les bonnes valeurs
*/
