-- ============================================
-- DIAGNOSTIC: Contraintes sur la colonne role
-- ============================================

-- Vérifier la structure de la table users
SELECT '====== STRUCTURE TABLE USERS ======' as diagnostic;
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Vérifier les contraintes CHECK sur la table users
SELECT '====== CONTRAINTES CHECK ======' as diagnostic;
SELECT 
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'users'
AND con.contype = 'c'; -- CHECK constraints

-- Vérifier si role a un ENUM type
SELECT '====== TYPE DE LA COLONNE ROLE ======' as diagnostic;
SELECT 
    t.typname AS enum_name,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname LIKE '%role%'
GROUP BY t.typname;

-- Essayer de créer un utilisateur test avec un rôle restaurant
SELECT '====== TEST CRÉATION UTILISATEUR RESTAURANT ======' as diagnostic;
DO $$ 
BEGIN
    -- Tenter d'insérer un utilisateur avec role restaurant_server
    BEGIN
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES ('test_restaurant@example.com', 'dummy_hash', 'Test', 'Restaurant', 'restaurant_server');
        
        RAISE NOTICE '✅ SUCCÈS: Création utilisateur restaurant_server possible';
        
        -- Supprimer l'utilisateur test
        DELETE FROM users WHERE email = 'test_restaurant@example.com';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ ERREUR: %', SQLERRM;
        RAISE NOTICE 'Code erreur: %', SQLSTATE;
    END;
END $$;

-- Lister tous les rôles actuellement utilisés dans users
SELECT '====== RÔLES ACTUELLEMENT UTILISÉS ======' as diagnostic;
SELECT DISTINCT role, COUNT(*) as user_count
FROM users
GROUP BY role
ORDER BY role;
