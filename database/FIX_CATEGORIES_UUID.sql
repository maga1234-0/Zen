-- ============================================
-- FIX: Supprimer les catégories dupliquées (VERSION UUID)
-- ============================================
-- ERREUR corrigée: "function min(uuid) does not exist"
-- Solution: Utiliser ROW_NUMBER() au lieu de MIN()
-- ============================================

-- ÉTAPE 1: Voir les doublons actuels
SELECT name, COUNT(*) as count
FROM menu_categories
GROUP BY name
HAVING COUNT(*) > 1;

-- ÉTAPE 2: Supprimer les doublons (garder 1 seule ligne par catégorie)
DELETE FROM menu_categories
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY name ORDER BY id::text) as rn
    FROM menu_categories
  ) sub
  WHERE rn > 1
);

-- ÉTAPE 3: Vérifier le résultat (doit montrer count=1 pour chaque catégorie)
SELECT name, COUNT(*) as count
FROM menu_categories
GROUP BY name;

-- ÉTAPE 4: Afficher les catégories restantes
SELECT id, name, type, display_order, is_active
FROM menu_categories
ORDER BY display_order, name;
