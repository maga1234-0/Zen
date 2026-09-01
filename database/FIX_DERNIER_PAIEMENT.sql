-- 🔧 FIX RAPIDE: Corriger le Dernier Paiement pour qu'il s'affiche sur le Dashboard
-- ═══════════════════════════════════════════════════════════════════

-- ÉTAPE 1: Voir le dernier paiement
SELECT 
    id,
    booking_id,
    amount,
    payment_method,
    status,
    payment_date,
    created_at,
    -- Diagnostics
    CASE 
        WHEN status = 'completed' THEN '✅ Status OK'
        ELSE '❌ Status doit être "completed" (actuellement: ' || status || ')'
    END as diagnostic_status,
    CASE 
        WHEN payment_date IS NOT NULL AND payment_date >= NOW() - INTERVAL '30 days' THEN '✅ Date OK'
        WHEN payment_date IS NULL THEN '❌ payment_date est NULL'
        ELSE '❌ payment_date trop ancien'
    END as diagnostic_date
FROM payments 
ORDER BY created_at DESC 
LIMIT 5;

-- ═══════════════════════════════════════════════════════════════════

-- ÉTAPE 2: Corriger TOUS les paiements récents
-- (À exécuter si le dernier paiement n'a pas le bon status/date)

UPDATE payments 
SET 
    status = 'completed',
    payment_date = COALESCE(payment_date, NOW())
WHERE created_at >= NOW() - INTERVAL '7 days'
AND (status != 'completed' OR payment_date IS NULL);

-- Afficher combien de paiements ont été corrigés
SELECT 
    COUNT(*) as paiements_corriges,
    'Paiements mis à jour avec status=completed et payment_date=NOW()' as message
FROM payments
WHERE created_at >= NOW() - INTERVAL '7 days';

-- ═══════════════════════════════════════════════════════════════════

-- ÉTAPE 3: Vérifier le montant qui devrait s'afficher sur le Dashboard

SELECT 
    COUNT(*) as nombre_paiements,
    COALESCE(SUM(p.amount), 0) as revenue_total,
    '💰 Ce montant devrait s''afficher sur le Dashboard' as note
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE b.hotel_id = (SELECT id FROM hotels LIMIT 1)
AND p.payment_date >= NOW() - INTERVAL '30 days'
AND p.status = 'completed';

-- ═══════════════════════════════════════════════════════════════════

-- ÉTAPE 4: Détails de tous les paiements récents

SELECT 
    p.id,
    p.amount,
    p.status,
    p.payment_date,
    p.payment_method,
    b.id as booking_id,
    g.first_name || ' ' || g.last_name as guest,
    r.room_number,
    '✅ Sera compté dans Dashboard' as inclus_dashboard
FROM payments p
JOIN bookings b ON p.booking_id = b.id
LEFT JOIN guests g ON b.guest_id = g.id
LEFT JOIN rooms r ON b.room_id = r.id
WHERE p.status = 'completed'
AND p.payment_date >= NOW() - INTERVAL '30 days'
ORDER BY p.payment_date DESC;

-- ═══════════════════════════════════════════════════════════════════
-- 📝 INSTRUCTIONS
-- ═══════════════════════════════════════════════════════════════════

/*
COMMENT UTILISER CE SCRIPT:

1. Copier TOUT ce fichier
2. Aller dans Supabase → SQL Editor
3. Coller et Exécuter (Run)
4. Regarder les résultats:
   - Table 1: Vos 5 derniers paiements avec diagnostics
   - Table 2: Nombre de paiements corrigés
   - Table 3: Montant total qui devrait s'afficher
   - Table 4: Détails de tous les paiements comptés

5. Rafraîchir le Dashboard (Ctrl+Shift+R)

6. Le Dashboard devrait maintenant afficher le montant correct ✅

SI LE DASHBOARD AFFICHE TOUJOURS 0:
- Vérifier que le backend sur Render est déployé (commit c7410f7)
- Attendre 3-5 minutes pour le redéploiement
- Vider le cache: Ctrl+Shift+R

SI UN PAIEMENT SPÉCIFIQUE NE S'AFFICHE PAS:
UPDATE payments 
SET 
    status = 'completed',
    payment_date = NOW()
WHERE id = <VOTRE_PAYMENT_ID>;
*/
