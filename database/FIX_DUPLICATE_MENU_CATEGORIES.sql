-- ============================================
-- FIX: Supprimer les catégories de menu dupliquées
-- ============================================
-- Problème: Les catégories (Entrées, Plats Principaux, Desserts, Boissons)
-- apparaissent 3 fois dans la liste déroulante
-- ============================================

-- ÉTAPE 1: Voir les doublons actuels
SELECT name, COUNT(*) as count
FROM menu_categories
GROUP BY name
HAVING COUNT(*) > 1;

-- ÉTAPE 2: Voir toutes les catégories avec leurs IDs
SELECT id, name, type, display_order, is_active
FROM menu_categories
ORDER BY name, id;

-- ÉTAPE 3: Supprimer les doublons (garder uniquement le plus ancien ID pour chaque catégorie)
-- Cette requête supprime les doublons en gardant la première occurrence
-- Note: Les IDs sont de type UUID, donc on utilise une approche différente

DELETE FROM menu_categories mc1
WHERE EXISTS (
  SELECT 1
  FROM menu_categories mc2
  WHERE mc2.name = mc1.name
  AND mc2.created_at < mc1.created_at
);

-- Alternative si created_at n'existe pas: garder le premier UUID par ordre alphabétique
-- DELETE FROM menu_categories mc1
-- WHERE EXISTS (
--   SELECT 1
--   FROM menu_categories mc2
--   WHERE mc2.name = mc1.name
--   AND mc2.id::text < mc1.id::text
-- );

-- ÉTAPE 4: Vérifier qu'il ne reste qu'une seule occurrence de chaque catégorie
SELECT name, COUNT(*) as count
FROM menu_categories
GROUP BY name;

-- ÉTAPE 5: Afficher les catégories restantes
SELECT id, name, type, display_order, is_active
FROM menu_categories
ORDER BY display_order, name;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Doit afficher uniquement:
-- - Entrées (1 fois)
-- - Plats Principaux (1 fois)
-- - Desserts (1 fois)
-- - Boissons (1 fois)
-- ============================================
