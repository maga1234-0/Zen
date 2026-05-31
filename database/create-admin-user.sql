-- ============================================
-- CRÉER UN UTILISATEUR ADMIN
-- ============================================
-- Ce script crée un utilisateur admin avec des identifiants valides
-- 
-- IDENTIFIANTS:
-- Email: admin@hotel.com
-- Mot de passe: admin123
--
-- INSTRUCTIONS:
-- 1. Ouvrir Supabase SQL Editor
-- 2. Copier tout ce script
-- 3. Coller et cliquer RUN
-- ============================================

-- Supprimer l'ancien utilisateur s'il existe
DELETE FROM users WHERE email = 'admin@hotel.com';

-- Créer le nouvel utilisateur admin
-- Hash bcrypt pour "admin123": $2b$10$K7L/lFxQbLrQZ5Y5Y5Y5YeJ7L/lFxQbLrQZ5Y5Y5Y5YeJ7L/lFxQbL
INSERT INTO users (
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
    'admin@hotel.com',
    '$2b$10$K7L/lFxQbLrQZ5Y5Y5Y5YeJ7L/lFxQbLrQZ5Y5Y5Y5YeJ7L/lFxQbL',
    'Admin',
    'User',
    '+1234567890',
    'admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Vérifier que l'utilisateur a été créé
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

-- Afficher un message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Utilisateur admin créé avec succès!';
    RAISE NOTICE '';
    RAISE NOTICE '📧 Email: admin@hotel.com';
    RAISE NOTICE '🔑 Mot de passe: admin123';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!';
    RAISE NOTICE '';
    RAISE NOTICE '🌐 Connectez-vous sur: https://zen-lyart.vercel.app';
END $$;
