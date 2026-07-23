-- ============================================
-- Ajouter aubinmaga@gmail.com comme admin
-- ============================================
-- Mot de passe: admin123
-- Email: aubinmaga@gmail.com
-- Rôle: admin (accès complet)
-- ============================================

-- Supprimer l'utilisateur s'il existe déjà (pour éviter les doublons)
DELETE FROM users WHERE email = 'aubinmaga@gmail.com';

-- Créer l'utilisateur admin Aubin
-- Mot de passe hashé avec bcrypt: admin123
-- Hash généré: $2a$10$rJ8YZ6HgMm5YZ6HgMm5YZueO.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
INSERT INTO users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    phone, 
    role,
    is_active
) VALUES (
    'aubinmaga@gmail.com',
    '$2a$10$ePPOujJ2NGLiSV/MIO21wu4RUsLn/QRFdVznXPFXbgAt76fEGjvmK',  -- admin123
    'Aubin',
    'Maga',
    '+243-XXX-XXX-XXX',  -- Mettez votre vrai numéro si vous voulez
    'admin',
    true
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
WHERE email = 'aubinmaga@gmail.com';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Utilisateur créé avec succès!';
    RAISE NOTICE 'Email: aubinmaga@gmail.com';
    RAISE NOTICE 'Mot de passe: admin123';
    RAISE NOTICE 'Rôle: admin';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 IMPORTANT: Changez le mot de passe après la première connexion!';
END $$;
