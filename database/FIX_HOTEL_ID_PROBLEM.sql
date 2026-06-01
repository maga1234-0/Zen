-- =====================================================
-- DIAGNOSTIC ET CORRECTION DU PROBLÈME HOTEL_ID
-- =====================================================
-- Ce script vérifie et corrige le problème de hotel_id
-- =====================================================

-- ÉTAPE 1 : Vérifier si la table hotels existe et contient des données
SELECT 
    'DIAGNOSTIC: Table hotels' as etape,
    COUNT(*) as nombre_hotels,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ PROBLÈME: Aucun hôtel dans la base'
        ELSE '✅ OK: Hôtels trouvés'
    END as statut
FROM hotels;

-- ÉTAPE 2 : Afficher les hôtels existants
SELECT 
    'HOTELS EXISTANTS' as info,
    id,
    name,
    city,
    created_at
FROM hotels
ORDER BY created_at DESC;

-- ÉTAPE 3 : Vérifier les chambres sans hotel_id valide
SELECT 
    'CHAMBRES AVEC HOTEL_ID INVALIDE' as probleme,
    COUNT(*) as nombre_chambres_problematiques
FROM rooms r
WHERE NOT EXISTS (
    SELECT 1 FROM hotels h WHERE h.id = r.hotel_id
);

-- ÉTAPE 4 : Vérifier les réservations sans hotel_id valide
SELECT 
    'RESERVATIONS AVEC HOTEL_ID INVALIDE' as probleme,
    COUNT(*) as nombre_reservations_problematiques
FROM bookings b
WHERE NOT EXISTS (
    SELECT 1 FROM hotels h WHERE h.id = b.hotel_id
);

-- =====================================================
-- SOLUTION : Créer un hôtel si aucun n'existe
-- =====================================================

-- Vérifier si un hôtel existe déjà
DO $$
DECLARE
    hotel_count INTEGER;
    new_hotel_id UUID;
BEGIN
    -- Compter les hôtels
    SELECT COUNT(*) INTO hotel_count FROM hotels;
    
    IF hotel_count = 0 THEN
        -- Créer un hôtel par défaut
        INSERT INTO hotels (
            id,
            name,
            address,
            city,
            country,
            phone,
            email,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            'Zen Hotel',
            '123 Main Street',
            'Kinshasa',
            'RDC',
            '+243 123 456 789',
            'contact@zenhotel.com',
            NOW(),
            NOW()
        )
        RETURNING id INTO new_hotel_id;
        
        RAISE NOTICE '✅ Hôtel créé avec succès: %', new_hotel_id;
        
        -- Mettre à jour les chambres orphelines
        UPDATE rooms
        SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (
            SELECT 1 FROM hotels h WHERE h.id = rooms.hotel_id
        );
        
        RAISE NOTICE '✅ Chambres mises à jour';
        
        -- Mettre à jour les réservations orphelines
        UPDATE bookings
        SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (
            SELECT 1 FROM hotels h WHERE h.id = bookings.hotel_id
        );
        
        RAISE NOTICE '✅ Réservations mises à jour';
    ELSE
        RAISE NOTICE '✅ Un hôtel existe déjà, pas besoin d''en créer un nouveau';
        
        -- Récupérer l'ID du premier hôtel
        SELECT id INTO new_hotel_id FROM hotels ORDER BY created_at LIMIT 1;
        
        -- Mettre à jour les chambres orphelines avec le premier hôtel
        UPDATE rooms
        SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (
            SELECT 1 FROM hotels h WHERE h.id = rooms.hotel_id
        );
        
        -- Mettre à jour les réservations orphelines avec le premier hôtel
        UPDATE bookings
        SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (
            SELECT 1 FROM hotels h WHERE h.id = bookings.hotel_id
        );
        
        RAISE NOTICE '✅ Données orphelines mises à jour avec l''hôtel existant';
    END IF;
END $$;

-- =====================================================
-- VÉRIFICATION FINALE
-- =====================================================

-- Vérifier que tout est OK maintenant
SELECT 
    'VERIFICATION FINALE' as etape,
    (SELECT COUNT(*) FROM hotels) as nombre_hotels,
    (SELECT COUNT(*) FROM rooms WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = rooms.hotel_id)) as chambres_orphelines,
    (SELECT COUNT(*) FROM bookings WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = bookings.hotel_id)) as reservations_orphelines,
    CASE 
        WHEN (SELECT COUNT(*) FROM hotels) > 0 
         AND (SELECT COUNT(*) FROM rooms WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = rooms.hotel_id)) = 0
         AND (SELECT COUNT(*) FROM bookings WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = bookings.hotel_id)) = 0
        THEN '✅ TOUT EST OK !'
        ELSE '❌ Il reste des problèmes'
    END as statut_final;

-- Afficher l'hôtel qui sera utilisé
SELECT 
    'HOTEL QUI SERA UTILISE' as info,
    id,
    name,
    city,
    phone,
    email
FROM hotels
ORDER BY created_at
LIMIT 1;
