-- 🔍 DIAGNOSTIC: Pourquoi les paiements ne s'affichent pas sur le Dashboard

-- ═══════════════════════════════════════════════════════════════════
-- 1️⃣ VÉRIFIER LA TABLE PAYMENTS
-- ═══════════════════════════════════════════════════════════════════

-- Vérifier si la table payments existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'payments'
) as table_payments_existe;

-- Lister TOUS les paiements enregistrés
SELECT 
    id,
    booking_id,
    amount,
    payment_method,
    status,
    payment_date,
    created_at
FROM payments
ORDER BY created_at DESC;

-- ═══════════════════════════════════════════════════════════════════
-- 2️⃣ VÉRIFIER LES PAIEMENTS AVEC STATUS 'completed'
-- ═══════════════════════════════════════════════════════════════════

SELECT 
    COUNT(*) as total_paiements,
    COUNT(*) FILTER (WHERE status = 'completed') as paiements_completed,
    COUNT(*) FILTER (WHERE status != 'completed') as paiements_autres,
    COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as montant_total_completed
FROM payments;

-- ═══════════════════════════════════════════════════════════════════
-- 3️⃣ VÉRIFIER LES PAIEMENTS DES 30 DERNIERS JOURS
-- ═══════════════════════════════════════════════════════════════════

SELECT 
    p.id,
    p.booking_id,
    p.amount,
    p.status,
    p.payment_date,
    p.payment_date >= NOW() - INTERVAL '30 days' as dans_30_derniers_jours,
    b.hotel_id,
    b.id as booking_existe
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
WHERE p.payment_date >= NOW() - INTERVAL '30 days'
ORDER BY p.payment_date DESC;

-- ═══════════════════════════════════════════════════════════════════
-- 4️⃣ SIMULER LA REQUÊTE DU DASHBOARD (Revenue last 30 days)
-- ═══════════════════════════════════════════════════════════════════

-- Vérifier l'hotel_id
SELECT id as hotel_id, name as hotel_name FROM hotels LIMIT 1;

-- Requête exacte du Dashboard
SELECT 
    COALESCE(SUM(p.amount), 0) as revenue,
    COUNT(*) as nombre_paiements
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE b.hotel_id = (SELECT id FROM hotels LIMIT 1)
AND p.payment_date >= NOW() - INTERVAL '30 days'
AND p.status = 'completed';

-- ═══════════════════════════════════════════════════════════════════
-- 5️⃣ DÉTAILS DES PAIEMENTS (pour debug)
-- ═══════════════════════════════════════════════════════════════════

SELECT 
    p.id as payment_id,
    p.amount,
    p.status as payment_status,
    p.payment_date,
    p.payment_method,
    b.id as booking_id,
    b.hotel_id,
    b.status as booking_status,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    -- Vérifications
    p.status = 'completed' as est_completed,
    p.payment_date >= NOW() - INTERVAL '30 days' as est_dans_30_jours,
    b.hotel_id IS NOT NULL as booking_existe
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
LEFT JOIN guests g ON b.guest_id = g.id
LEFT JOIN rooms r ON b.room_id = r.id
ORDER BY p.payment_date DESC;

-- ═══════════════════════════════════════════════════════════════════
-- 6️⃣ VÉRIFIER LES STATUS POSSIBLES
-- ═══════════════════════════════════════════════════════════════════

-- Lister tous les status différents dans la table payments
SELECT DISTINCT status, COUNT(*) as nombre
FROM payments
GROUP BY status;

-- ═══════════════════════════════════════════════════════════════════
-- 7️⃣ VÉRIFIER LA STRUCTURE DE LA TABLE PAYMENTS
-- ═══════════════════════════════════════════════════════════════════

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- ═══════════════════════════════════════════════════════════════════
-- 📊 RÉSUMÉ POUR DEBUG
-- ═══════════════════════════════════════════════════════════════════

SELECT 
    '🔍 Diagnostic Paiements Dashboard' as diagnostic,
    '' as separation,
    (SELECT COUNT(*) FROM payments) as total_paiements_en_base,
    (SELECT COUNT(*) FROM payments WHERE status = 'completed') as paiements_avec_status_completed,
    (SELECT COUNT(*) FROM payments WHERE payment_date >= NOW() - INTERVAL '30 days') as paiements_derniers_30_jours,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed' AND payment_date >= NOW() - INTERVAL '30 days') as montant_devrait_afficher,
    (SELECT id FROM hotels LIMIT 1) as hotel_id_utilise;

-- ═══════════════════════════════════════════════════════════════════
-- 🔧 SOLUTIONS POSSIBLES
-- ═══════════════════════════════════════════════════════════════════

/*
PROBLÈMES POSSIBLES:

1. ❌ Status du paiement n'est PAS 'completed'
   Solution: UPDATE payments SET status = 'completed' WHERE id = <votre_payment_id>;

2. ❌ payment_date est NULL ou dans le futur
   Solution: UPDATE payments SET payment_date = NOW() WHERE id = <votre_payment_id>;

3. ❌ Le booking_id n'existe pas dans la table bookings
   Solution: Vérifier que la réservation existe

4. ❌ Le hotel_id de la réservation ne correspond pas
   Solution: Vérifier que b.hotel_id correspond à l'hotel dans la table hotels

5. ❌ Le backend sur Render n'est pas à jour
   Solution: Attendre 3-5 minutes que Render redéploie

6. ❌ Le cache du navigateur
   Solution: Faire Ctrl+Shift+R pour rafraîchir

POUR FORCER L'AFFICHAGE D'UN PAIEMENT:

UPDATE payments 
SET 
    status = 'completed',
    payment_date = NOW()
WHERE id = <votre_payment_id>;

Puis rafraîchir le Dashboard (Ctrl+Shift+R)
*/
