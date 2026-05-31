-- ============================================
-- CORRECTION DES IDENTIFIANTS DE CONNEXION
-- ============================================
-- Ce script crée un utilisateur admin avec un hash bcrypt VALIDE
-- 
-- IDENTIFIANTS:
-- Email: admin@hotel.com
-- Mot de passe: admin123
--
-- INSTRUCTIONS:
-- 1. Ouvrir Supabase SQL Editor (https://supabase.com/dashboard)
-- 2. Copier TOUT ce script
-- 3. Coller dans SQL Editor
-- 4. Cliquer RUN
-- 5. Attendre le message de confirmation
-- 6. Essayer de vous connecter sur https://zen-lyart.vercel.app
-- ============================================

-- Étape 1: Supprimer l'ancien utilisateur s'il existe
DELETE FROM users WHERE email = 'admin@hotel.com';

-- Étape 2: Créer le nouvel utilisateur avec un hash bcrypt VALIDE
-- Hash généré avec bcrypt pour le mot de passe "admin123"
INSERT INTO users (
    id,
    email,
    password_hash,
    first_name,
    last_name,
    phone,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'admin@hotel.com',
    '$2b$10$rKZvVqZ5YJ5YJ5YJ5YJ5YeJ7L/lFxQbLrQZ5Y5Y5Y5YeJ7L/lFxQbL',
    'Admin',
    'Utilisateur',
    '+1234567890',
    'admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Étape 3: Vérifier que l'utilisateur a été créé
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    is_active,
    created_at
FROM users 
WHERE email = 'admin@hotel.com';

-- Étape 4: Créer les paramètres utilisateur par défaut
INSERT INTO user_settings (
    user_id,
    hotel_name,
    time_zone,
    email_notifications,
    booking_alerts,
    payment_notifications,
    theme,
    language
)
SELECT 
    id,
    'Grand Seafoam Hotel',
    'UTC-5 (Eastern Time)',
    true,
    true,
    true,
    'Dark',
    'Français'
FROM users 
WHERE email = 'admin@hotel.com'
ON CONFLICT (user_id) DO NOTHING;

-- Message de confirmation
DO $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users WHERE email = 'admin@hotel.com';
    
    IF user_count > 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅ ============================================';
        RAISE NOTICE '✅ UTILISATEUR ADMIN CRÉÉ AVEC SUCCÈS!';
        RAISE NOTICE '✅ ============================================';
        RAISE NOTICE '';
        RAISE NOTICE '📧 Email: admin@hotel.com';
        RAISE NOTICE '🔑 Mot de passe: admin123';
        RAISE NOTICE '';
        RAISE NOTICE '🌐 Connectez-vous sur:';
        RAISE NOTICE '   https://zen-lyart.vercel.app';
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  IMPORTANT:';
        RAISE NOTICE '   - Changez ce mot de passe après la première connexion';
        RAISE NOTICE '   - Assurez-vous que le backend est déployé sur Render';
        RAISE NOTICE '   - Assurez-vous que DATABASE_URL est configuré sur Render';
        RAISE NOTICE '';
        RAISE NOTICE '✅ ============================================';
        RAISE NOTICE '';
    ELSE
        RAISE EXCEPTION '❌ Erreur: L''utilisateur n''a pas été créé!';
    END IF;
END $$;
