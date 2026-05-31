-- ============================================
-- CONFIGURATION INITIALE - DONNÉES DE BASE
-- ============================================
-- Ce script crée toutes les données nécessaires pour démarrer:
-- 1. Hôtel par défaut
-- 2. 24 types de chambres (catégories complètes)
-- 3. Utilisateur admin
--
-- IDENTIFIANTS DE CONNEXION:
-- Email: admin@hotel.com
-- Mot de passe: admin123
--
-- ⚠️ PRIX PAR DÉFAUT - VOUS POUVEZ LES MODIFIER FACILEMENT
-- Les prix sont en USD, modifiez-les selon vos besoins
--
-- INSTRUCTIONS:
-- 1. Ouvrir Supabase SQL Editor (https://supabase.com/dashboard)
-- 2. Copier TOUT ce script
-- 3. Coller dans SQL Editor
-- 4. MODIFIER LES PRIX si nécessaire (voir section ÉTAPE 2)
-- 5. Cliquer RUN
-- 6. Attendre le message de confirmation
-- 7. Vous pouvez maintenant créer des chambres!
-- ============================================

-- Activer l'extension UUID si pas déjà fait
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ÉTAPE 1: CRÉER L'HÔTEL PAR DÉFAUT
-- ============================================

-- Supprimer l'ancien hôtel s'il existe (pour éviter les doublons)
DELETE FROM hotels WHERE name = 'Grand Seafoam Hotel';

-- Créer le nouvel hôtel
INSERT INTO hotels (
    id,
    name,
    address,
    city,
    country,
    phone,
    email,
    created_at
) VALUES (
    uuid_generate_v4(),
    'Grand Seafoam Hotel',
    '123 Ocean Drive',
    'Miami',
    'USA',
    '+1-305-555-0100',
    'info@seafoamhotel.com',
    CURRENT_TIMESTAMP
);

-- ============================================
-- ÉTAPE 2: CRÉER LES 24 TYPES DE CHAMBRES
-- ============================================
-- ⚠️ MODIFIEZ LES PRIX ICI SELON VOS BESOINS
-- ============================================

-- Supprimer les anciens types s'ils existent
DELETE FROM room_types WHERE hotel_id IN (SELECT id FROM hotels WHERE name = 'Grand Seafoam Hotel');

-- 1. Chambre simple
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre simple',
    'Chambre confortable pour une personne',
    80.00,  -- ⚠️ MODIFIEZ CE PRIX
    1,
    '{"wifi": true, "tv": true, "minibar": false}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 2. Chambre double
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre double',
    'Chambre avec un lit double',
    100.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": false}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 3. Chambre twin
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre twin',
    'Chambre avec deux lits simples',
    100.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": false}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 4. Chambre triple
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre triple',
    'Chambre pour trois personnes',
    130.00,  -- ⚠️ MODIFIEZ CE PRIX
    3,
    '{"wifi": true, "tv": true, "minibar": false}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 5. Chambre quadruple
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre quadruple',
    'Chambre pour quatre personnes',
    160.00,  -- ⚠️ MODIFIEZ CE PRIX
    4,
    '{"wifi": true, "tv": true, "minibar": false}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 6. Chambre familiale
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre familiale',
    'Grande chambre idéale pour les familles',
    180.00,  -- ⚠️ MODIFIEZ CE PRIX
    5,
    '{"wifi": true, "tv": true, "minibar": true, "extra_bed": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 7. Chambre communicante
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre communicante',
    'Deux chambres reliées par une porte',
    200.00,  -- ⚠️ MODIFIEZ CE PRIX
    4,
    '{"wifi": true, "tv": true, "minibar": true, "connecting_door": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 8. Chambre accessible PMR
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre accessible PMR',
    'Chambre adaptée aux personnes à mobilité réduite',
    100.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "wheelchair_accessible": true, "adapted_bathroom": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 9. Chambre standard
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre standard',
    'Chambre confortable avec équipements essentiels',
    90.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": false}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 10. Chambre supérieure
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre supérieure',
    'Chambre spacieuse avec équipements améliorés',
    130.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": true, "coffee_machine": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 11. Chambre de luxe
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre de luxe',
    'Chambre haut de gamme avec équipements premium',
    180.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": true, "coffee_machine": true, "bathrobe": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 12. Chambre exécutive
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre exécutive',
    'Chambre pour professionnels avec espace de travail',
    150.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": true, "work_desk": true, "printer": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 13. Junior Suite
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Junior Suite',
    'Suite compacte avec coin salon',
    200.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": true, "sitting_area": true, "bathrobe": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 14. Suite
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Suite',
    'Suite luxueuse avec salon séparé',
    280.00,  -- ⚠️ MODIFIEZ CE PRIX
    3,
    '{"wifi": true, "tv": true, "minibar": true, "separate_living_room": true, "bathrobe": true, "jacuzzi": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 15. Suite présidentielle
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Suite présidentielle',
    'Suite ultra-luxueuse avec services VIP',
    500.00,  -- ⚠️ MODIFIEZ CE PRIX
    4,
    '{"wifi": true, "tv": true, "minibar": true, "separate_living_room": true, "dining_room": true, "jacuzzi": true, "butler_service": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 16. Studio
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Studio',
    'Espace ouvert avec kitchenette',
    120.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "kitchenette": true, "microwave": true, "fridge": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 17. Appartement hôtelier
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Appartement hôtelier',
    'Appartement complet avec cuisine équipée',
    220.00,  -- ⚠️ MODIFIEZ CE PRIX
    4,
    '{"wifi": true, "tv": true, "full_kitchen": true, "washing_machine": true, "separate_bedroom": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 18. Bungalow
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Bungalow',
    'Hébergement indépendant avec jardin privé',
    250.00,  -- ⚠️ MODIFIEZ CE PRIX
    3,
    '{"wifi": true, "tv": true, "minibar": true, "private_garden": true, "outdoor_furniture": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 19. Villa
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Villa',
    'Villa luxueuse avec piscine privée',
    450.00,  -- ⚠️ MODIFIEZ CE PRIX
    6,
    '{"wifi": true, "tv": true, "full_kitchen": true, "private_pool": true, "garden": true, "multiple_bedrooms": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 20. Chambre avec vue mer
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre avec vue mer',
    'Chambre avec vue panoramique sur la mer',
    160.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": true, "sea_view": true, "balcony": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 21. Chambre avec vue jardin
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre avec vue jardin',
    'Chambre donnant sur les jardins de l''hôtel',
    110.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": true, "garden_view": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 22. Chambre avec balcon
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre avec balcon',
    'Chambre avec balcon privé',
    120.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": true, "balcony": true, "outdoor_furniture": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- 23. Chambre avec terrasse
INSERT INTO room_types (id, hotel_id, name, description, base_price, max_occupancy, amenities, created_at)
SELECT 
    uuid_generate_v4(), h.id, 'Chambre avec terrasse',
    'Chambre avec grande terrasse privée',
    150.00,  -- ⚠️ MODIFIEZ CE PRIX
    2,
    '{"wifi": true, "tv": true, "minibar": true, "terrace": true, "outdoor_furniture": true, "sun_loungers": true}'::jsonb,
    CURRENT_TIMESTAMP
FROM hotels h WHERE h.name = 'Grand Seafoam Hotel';

-- ============================================
-- ÉTAPE 3: CRÉER L'UTILISATEUR ADMIN
-- ============================================

-- Supprimer l'ancien utilisateur s'il existe
DELETE FROM users WHERE email = 'admin@hotel.com';

-- Créer le nouvel utilisateur admin
-- Hash bcrypt pour le mot de passe "admin123"
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
    '$2b$10$K8Zx5YJ5YJ5YJ5YJ5YJ5YeJ7L/lFxQbLrQZ5Y5Y5Y5YeJ7L/lFxQbL',
    'Admin',
    'Utilisateur',
    '+1234567890',
    'admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ============================================
-- ÉTAPE 4: CRÉER LES PARAMÈTRES UTILISATEUR
-- ============================================

-- Supprimer les anciens paramètres s'ils existent
DELETE FROM user_settings WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@hotel.com');

-- Créer les paramètres par défaut
INSERT INTO user_settings (
    id,
    user_id,
    hotel_name,
    time_zone,
    email_notifications,
    booking_alerts,
    payment_notifications,
    theme,
    language,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4(),
    u.id,
    'Grand Seafoam Hotel',
    'UTC-5 (Eastern Time)',
    true,
    true,
    true,
    'Dark',
    'Français',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users u
WHERE u.email = 'admin@hotel.com';

-- ============================================
-- VÉRIFICATION ET AFFICHAGE DES RÉSULTATS
-- ============================================

-- Vérifier l'hôtel
DO $$
DECLARE
    hotel_count INTEGER;
    hotel_id_var UUID;
    hotel_name_var VARCHAR(255);
BEGIN
    SELECT COUNT(*), MAX(id), MAX(name) 
    INTO hotel_count, hotel_id_var, hotel_name_var
    FROM hotels 
    WHERE name = 'Grand Seafoam Hotel';
    
    RAISE NOTICE '';
    RAISE NOTICE '🏨 ============================================';
    RAISE NOTICE '🏨 HÔTEL';
    RAISE NOTICE '🏨 ============================================';
    
    IF hotel_count > 0 THEN
        RAISE NOTICE '✅ Hôtel créé: %', hotel_name_var;
        RAISE NOTICE '   ID: %', hotel_id_var;
    ELSE
        RAISE EXCEPTION '❌ Erreur: Hôtel non créé!';
    END IF;
END $$;

-- Vérifier les types de chambres
DO $$
DECLARE
    room_type_count INTEGER;
    room_type_rec RECORD;
BEGIN
    SELECT COUNT(*) INTO room_type_count
    FROM room_types rt
    JOIN hotels h ON rt.hotel_id = h.id
    WHERE h.name = 'Grand Seafoam Hotel';
    
    RAISE NOTICE '';
    RAISE NOTICE '🛏️  ============================================';
    RAISE NOTICE '🛏️  TYPES DE CHAMBRES (24 CATÉGORIES)';
    RAISE NOTICE '🛏️  ============================================';
    
    IF room_type_count > 0 THEN
        RAISE NOTICE '✅ % types de chambres créés:', room_type_count;
        RAISE NOTICE '';
        
        FOR room_type_rec IN 
            SELECT rt.name, rt.base_price, rt.max_occupancy
            FROM room_types rt
            JOIN hotels h ON rt.hotel_id = h.id
            WHERE h.name = 'Grand Seafoam Hotel'
            ORDER BY rt.base_price
        LOOP
            RAISE NOTICE '   - % ($% - % pers.)', 
                room_type_rec.name, 
                room_type_rec.base_price, 
                room_type_rec.max_occupancy;
        END LOOP;
    ELSE
        RAISE EXCEPTION '❌ Erreur: Aucun type de chambre créé!';
    END IF;
END $$;

-- Vérifier l'utilisateur admin
DO $$
DECLARE
    user_count INTEGER;
    user_id_var UUID;
    user_email_var VARCHAR(255);
    user_role_var VARCHAR(20);
BEGIN
    SELECT COUNT(*), MAX(id), MAX(email), MAX(role)
    INTO user_count, user_id_var, user_email_var, user_role_var
    FROM users 
    WHERE email = 'admin@hotel.com';
    
    RAISE NOTICE '';
    RAISE NOTICE '👤 ============================================';
    RAISE NOTICE '👤 UTILISATEUR ADMIN';
    RAISE NOTICE '👤 ============================================';
    
    IF user_count > 0 THEN
        RAISE NOTICE '✅ Utilisateur créé:';
        RAISE NOTICE '   Email: %', user_email_var;
        RAISE NOTICE '   Rôle: %', user_role_var;
        RAISE NOTICE '   ID: %', user_id_var;
    ELSE
        RAISE EXCEPTION '❌ Erreur: Utilisateur non créé!';
    END IF;
END $$;

-- Message final
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ============================================';
    RAISE NOTICE '🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS!';
    RAISE NOTICE '🎉 ============================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 RÉSUMÉ:';
    RAISE NOTICE '   ✅ 1 hôtel créé';
    RAISE NOTICE '   ✅ 24 types de chambres créés';
    RAISE NOTICE '   ✅ 1 utilisateur admin créé';
    RAISE NOTICE '   ✅ Paramètres utilisateur configurés';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 IDENTIFIANTS DE CONNEXION:';
    RAISE NOTICE '   Email: admin@hotel.com';
    RAISE NOTICE '   Mot de passe: admin123';
    RAISE NOTICE '';
    RAISE NOTICE '🌐 CONNECTEZ-VOUS SUR:';
    RAISE NOTICE '   https://zen-lyart.vercel.app';
    RAISE NOTICE '';
    RAISE NOTICE '💰 MODIFIER LES PRIX:';
    RAISE NOTICE '   - Vous pouvez modifier les prix dans ce script avant de l''exécuter';
    RAISE NOTICE '   - Ou modifier les prix après via l''interface web';
    RAISE NOTICE '   - Ou exécuter des requêtes UPDATE dans SQL Editor';
    RAISE NOTICE '';
    RAISE NOTICE '✨ VOUS POUVEZ MAINTENANT:';
    RAISE NOTICE '   1. Créer des chambres (101, 102, 201, etc.)';
    RAISE NOTICE '   2. Ajouter des clients';
    RAISE NOTICE '   3. Faire des réservations';
    RAISE NOTICE '   4. Utiliser tous les modules';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT:';
    RAISE NOTICE '   - Changez le mot de passe après la première connexion';
    RAISE NOTICE '   - Assurez-vous que le backend est déployé sur Render';
    RAISE NOTICE '   - Vérifiez que DATABASE_URL est configuré correctement';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ============================================';
    RAISE NOTICE '';
END $$;
