-- ============================================
-- MODIFIER LES PRIX DES TYPES DE CHAMBRES
-- ============================================
-- Ce script vous permet de modifier facilement les prix
-- de tous les types de chambres après leur création
--
-- INSTRUCTIONS:
-- 1. Modifier les prix ci-dessous selon vos besoins
-- 2. Copier TOUT ce script
-- 3. Coller dans Supabase SQL Editor
-- 4. Cliquer RUN
-- ============================================

-- 1. Chambre simple
UPDATE room_types 
SET base_price = 80.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre simple';

-- 2. Chambre double
UPDATE room_types 
SET base_price = 100.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre double';

-- 3. Chambre twin
UPDATE room_types 
SET base_price = 100.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre twin';

-- 4. Chambre triple
UPDATE room_types 
SET base_price = 130.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre triple';

-- 5. Chambre quadruple
UPDATE room_types 
SET base_price = 160.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre quadruple';

-- 6. Chambre familiale
UPDATE room_types 
SET base_price = 180.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre familiale';

-- 7. Chambre communicante
UPDATE room_types 
SET base_price = 200.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre communicante';

-- 8. Chambre accessible PMR
UPDATE room_types 
SET base_price = 100.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre accessible PMR';

-- 9. Chambre standard
UPDATE room_types 
SET base_price = 90.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre standard';

-- 10. Chambre supérieure
UPDATE room_types 
SET base_price = 130.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre supérieure';

-- 11. Chambre de luxe
UPDATE room_types 
SET base_price = 180.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre de luxe';

-- 12. Chambre exécutive
UPDATE room_types 
SET base_price = 150.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre exécutive';

-- 13. Junior Suite
UPDATE room_types 
SET base_price = 200.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Junior Suite';

-- 14. Suite
UPDATE room_types 
SET base_price = 280.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Suite';

-- 15. Suite présidentielle
UPDATE room_types 
SET base_price = 500.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Suite présidentielle';

-- 16. Studio
UPDATE room_types 
SET base_price = 120.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Studio';

-- 17. Appartement hôtelier
UPDATE room_types 
SET base_price = 220.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Appartement hôtelier';

-- 18. Bungalow
UPDATE room_types 
SET base_price = 250.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Bungalow';

-- 19. Villa
UPDATE room_types 
SET base_price = 450.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Villa';

-- 20. Chambre avec vue mer
UPDATE room_types 
SET base_price = 160.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre avec vue mer';

-- 21. Chambre avec vue jardin
UPDATE room_types 
SET base_price = 110.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre avec vue jardin';

-- 22. Chambre avec balcon
UPDATE room_types 
SET base_price = 120.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre avec balcon';

-- 23. Chambre avec terrasse
UPDATE room_types 
SET base_price = 150.00  -- ⚠️ MODIFIEZ CE PRIX
WHERE name = 'Chambre avec terrasse';

-- ============================================
-- VÉRIFICATION DES NOUVEAUX PRIX
-- ============================================

SELECT 
    name AS "Type de chambre",
    base_price AS "Prix ($)",
    max_occupancy AS "Capacité (pers.)"
FROM room_types
ORDER BY base_price;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ ============================================';
    RAISE NOTICE '✅ PRIX MIS À JOUR AVEC SUCCÈS!';
    RAISE NOTICE '✅ ============================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Vérifiez les nouveaux prix dans le tableau ci-dessus';
    RAISE NOTICE '';
    RAISE NOTICE '💡 ASTUCE:';
    RAISE NOTICE '   Vous pouvez aussi modifier les prix via l''interface web';
    RAISE NOTICE '   dans la section "Paramètres" ou "Types de chambres"';
    RAISE NOTICE '';
END $$;
