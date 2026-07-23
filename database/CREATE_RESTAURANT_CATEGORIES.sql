-- ============================================
-- CRÉER LES CATÉGORIES RESTAURANT
-- ============================================
-- Ce script crée la table ET les 4 catégories de base
-- pour le menu du restaurant
-- ⚠️ IMPORTANT: Le backend utilise le nom "menu_categories"
-- ============================================

-- Créer la table si elle n'existe pas (NOM CORRECT: menu_categories)
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Créer un index sur display_order
CREATE INDEX IF NOT EXISTS idx_menu_categories_order ON menu_categories(display_order);

-- Supprimer les catégories existantes pour éviter les doublons
DELETE FROM menu_categories;

-- Créer les catégories de base
INSERT INTO menu_categories (id, name, name_fr, description, display_order, is_active) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Starters',
  'Entrées',
  'Salades, soupes et amuse-bouches',
  1,
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Main Courses',
  'Plats',
  'Plats principaux, viandes et poissons',
  2,
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  'Desserts',
  'Desserts',
  'Pâtisseries, glaces et fruits',
  3,
  true
),
(
  '44444444-4444-4444-4444-444444444444',
  'Beverages',
  'Boissons',
  'Boissons chaudes, froides et alcoolisées',
  4,
  true
);

-- Vérifier que les catégories ont été créées
SELECT 
    id,
    name,
    name_fr,
    description,
    display_order,
    is_active
FROM menu_categories
ORDER BY display_order;

-- Message de confirmation
DO $$
DECLARE
    category_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO category_count FROM menu_categories;
    
    RAISE NOTICE '✅ Script exécuté avec succès!';
    RAISE NOTICE 'Nombre de catégories créées: %', category_count;
    RAISE NOTICE '';
    RAISE NOTICE '📋 Catégories disponibles:';
    RAISE NOTICE '1. Entrées / Starters';
    RAISE NOTICE '2. Plats / Main Courses';
    RAISE NOTICE '3. Desserts';
    RAISE NOTICE '4. Boissons / Beverages';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Vous pouvez maintenant créer des articles menu!';
END $$;
