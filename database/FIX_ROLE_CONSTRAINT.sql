-- ============================================
-- CORRECTION: Ajouter les rôles restaurant à la contrainte
-- ============================================

-- ÉTAPE 1: Supprimer l'ancienne contrainte
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- ÉTAPE 2: Créer une nouvelle contrainte avec TOUS les rôles (6 originaux + 4 restaurant)
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (
  (role)::text = ANY (ARRAY[
    'admin'::character varying,
    'manager'::character varying,
    'receptionist'::character varying,
    'housekeeping'::character varying,
    'maintenance'::character varying,
    'accountant'::character varying,
    'restaurant_server'::character varying,
    'restaurant_cashier'::character varying,
    'restaurant_manager'::character varying,
    'restaurant_chef'::character varying
  ]::text[])
);

-- ÉTAPE 3: Vérification
SELECT '====== VÉRIFICATION CONTRAINTE ======' as diagnostic;
SELECT 
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'users'
AND con.conname = 'users_role_check';

-- ÉTAPE 4: Test de création
SELECT '====== TEST CRÉATION UTILISATEUR ======' as diagnostic;
DO $$ 
BEGIN
    -- Test 1: restaurant_server
    BEGIN
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES ('test_server@example.com', 'dummy', 'Test', 'Server', 'restaurant_server');
        RAISE NOTICE '✅ TEST 1: restaurant_server - SUCCÈS';
        DELETE FROM users WHERE email = 'test_server@example.com';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ TEST 1: restaurant_server - ERREUR: %', SQLERRM;
    END;

    -- Test 2: restaurant_cashier
    BEGIN
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES ('test_cashier@example.com', 'dummy', 'Test', 'Cashier', 'restaurant_cashier');
        RAISE NOTICE '✅ TEST 2: restaurant_cashier - SUCCÈS';
        DELETE FROM users WHERE email = 'test_cashier@example.com';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ TEST 2: restaurant_cashier - ERREUR: %', SQLERRM;
    END;

    -- Test 3: restaurant_manager
    BEGIN
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES ('test_rmanager@example.com', 'dummy', 'Test', 'Manager', 'restaurant_manager');
        RAISE NOTICE '✅ TEST 3: restaurant_manager - SUCCÈS';
        DELETE FROM users WHERE email = 'test_rmanager@example.com';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ TEST 3: restaurant_manager - ERREUR: %', SQLERRM;
    END;

    -- Test 4: restaurant_chef
    BEGIN
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES ('test_chef@example.com', 'dummy', 'Test', 'Chef', 'restaurant_chef');
        RAISE NOTICE '✅ TEST 4: restaurant_chef - SUCCÈS';
        DELETE FROM users WHERE email = 'test_chef@example.com';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ TEST 4: restaurant_chef - ERREUR: %', SQLERRM;
    END;

    -- Test 5: admin (pour vérifier que les anciens rôles fonctionnent toujours)
    BEGIN
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES ('test_admin@example.com', 'dummy', 'Test', 'Admin', 'admin');
        RAISE NOTICE '✅ TEST 5: admin - SUCCÈS';
        DELETE FROM users WHERE email = 'test_admin@example.com';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ TEST 5: admin - ERREUR: %', SQLERRM;
    END;
END $$;

-- MESSAGE FINAL
DO $$ 
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE '         CORRECTION TERMINÉE';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'La contrainte users_role_check a été mise à jour';
    RAISE NOTICE 'avec les 10 rôles (6 originaux + 4 restaurant)';
    RAISE NOTICE '';
    RAISE NOTICE 'PROCHAINES ÉTAPES:';
    RAISE NOTICE '1. Vérifier les tests ci-dessus (5x ✅)';
    RAISE NOTICE '2. Rafraîchir l''application (Ctrl+Shift+R)';
    RAISE NOTICE '3. Tester Staff → Add New Staff';
    RAISE NOTICE '4. Choisir un rôle restaurant';
    RAISE NOTICE '5. ✅ Devrait fonctionner sans erreur 500';
    RAISE NOTICE '============================================';
END $$;
