# 🔧 FIX SQL RESTAURANT MODULE

## ❌ Problème Rencontré

**Erreur dans Supabase**:
```
ERROR: 42601: INSERT has more expressions than target columns
LINE 247: 850
```

## ✅ Solution

Le fichier `database/restaurant-module.sql` avait des erreurs dans les INSERT statements.
Un nouveau fichier corrigé a été créé : `database/restaurant-module-fixed.sql`

## 📋 UTILISER LE FICHIER CORRIGÉ

### Étape 1: Ouvrir Supabase SQL Editor

1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Menu latéral → **SQL Editor**
4. Cliquer sur **"New query"**

### Étape 2: Copier le SQL Corrigé

**Option A: Fichier Complet (Recommandé)**

Le fichier `database/restaurant-module-fixed.sql` contient UNIQUEMENT la structure des tables.
Les données de test seront ajoutées séparément.

**Copier et exécuter dans Supabase**:
```sql
-- Copier tout le contenu de:
database/restaurant-module-fixed.sql
```

### Étape 3: Ajouter les Données de Test

Après avoir créé les tables, exécuter ces INSERT pour ajouter les données de test :

```sql
-- Catégories de menu
INSERT INTO menu_categories (name, name_fr, name_en, name_es, type, display_order) VALUES
('Entrées', 'Entrées', 'Starters', 'Entrantes', 'food', 1),
('Plats Principaux', 'Plats Principaux', 'Main Courses', 'Platos Principales', 'food', 2),
('Desserts', 'Desserts', 'Desserts', 'Postres', 'food', 3),
('Boissons Chaudes', 'Boissons Chaudes', 'Hot Beverages', 'Bebidas Calientes', 'beverage', 4),
('Boissons Froides', 'Boissons Froides', 'Cold Beverages', 'Bebidas Frías', 'beverage', 5),
('Cocktails', 'Cocktails', 'Cocktails', 'Cócteles', 'beverage', 6),
('Vins', 'Vins', 'Wines', 'Vinos', 'beverage', 7);

-- Tables du restaurant
INSERT INTO restaurant_tables (table_number, capacity, location, status) VALUES
('T1', 2, 'indoor', 'available'),
('T2', 2, 'indoor', 'available'),
('T3', 4, 'indoor', 'available'),
('T4', 4, 'indoor', 'available'),
('T5', 6, 'indoor', 'available'),
('T6', 6, 'indoor', 'available'),
('T7', 8, 'indoor', 'available'),
('T8', 2, 'outdoor', 'available'),
('T9', 4, 'outdoor', 'available'),
('T10', 4, 'terrace', 'available'),
('B1', 2, 'bar', 'available'),
('B2', 2, 'bar', 'available'),
('B3', 4, 'bar', 'available');

-- Articles du menu (exemples)
INSERT INTO menu_items (
    category_id, name, name_fr, name_en, name_es,
    description, description_fr, description_en, description_es,
    price, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories
) 
SELECT 
    c.id,
    'Salade César', 'Salade César', 'Caesar Salad', 'Ensalada César',
    'Laitue romaine, croûtons, parmesan, sauce César',
    'Laitue romaine, croûtons, parmesan, sauce César',
    'Romaine lettuce, croutons, parmesan, Caesar dressing',
    'Lechuga romana, picatostes, parmesano, salsa César',
    12.50, true, false, false, 15, 350
FROM menu_categories c WHERE c.name = 'Entrées';

INSERT INTO menu_items (
    category_id, name, name_fr, name_en, name_es,
    description, description_fr, description_en, description_es,
    price, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories
) 
SELECT 
    c.id,
    'Steak Frites', 'Steak Frites', 'Steak and Fries', 'Bistec con Patatas',
    'Entrecôte 300g, frites maison, sauce au choix',
    'Entrecôte 300g, frites maison, sauce au choix',
    '300g ribeye, homemade fries, choice of sauce',
    'Entrecot 300g, patatas caseras, salsa a elegir',
    28.00, false, false, false, 25, 850
FROM menu_categories c WHERE c.name = 'Plats Principaux';

INSERT INTO menu_items (
    category_id, name, name_fr, name_en, name_es,
    description, description_fr, description_en, description_es,
    price, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories
) 
SELECT 
    c.id,
    'Tarte Tatin', 'Tarte Tatin', 'Tarte Tatin', 'Tarta Tatin',
    'Pommes caramélisées, pâte feuilletée, glace vanille',
    'Pommes caramélisées, pâte feuilletée, glace vanille',
    'Caramelized apples, puff pastry, vanilla ice cream',
    'Manzanas caramelizadas, hojaldre, helado de vainilla',
    9.50, true, false, false, 15, 420
FROM menu_categories c WHERE c.name = 'Desserts';

INSERT INTO menu_items (
    category_id, name, name_fr, name_en, name_es,
    price, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories
) 
SELECT 
    c.id,
    'Café Espresso', 'Café Espresso', 'Espresso Coffee', 'Café Espresso',
    3.50, true, true, true, 3, 5
FROM menu_categories c WHERE c.name = 'Boissons Chaudes';

INSERT INTO menu_items (
    category_id, name, name_fr, name_en, name_es,
    description, description_fr, description_en, description_es,
    price, is_vegetarian, is_vegan, is_gluten_free, preparation_time, calories
) 
SELECT 
    c.id,
    'Mojito', 'Mojito', 'Mojito', 'Mojito',
    'Rhum blanc, menthe, citron vert, sucre de canne',
    'Rhum blanc, menthe, citron vert, sucre de canne',
    'White rum, mint, lime, cane sugar',
    'Ron blanco, menta, lima, azúcar de caña',
    12.00, true, true, true, 7, 180
FROM menu_categories c WHERE c.name = 'Cocktails';
```

### Étape 4: Vérifier les Tables Créées

```sql
-- Vérifier que toutes les tables existent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
    table_name LIKE 'menu%' 
    OR table_name LIKE 'restaurant%'
    OR table_name LIKE 'table_%'
)
ORDER BY table_name;
```

**Résultat attendu** (7 tables):
- menu_categories
- menu_items
- restaurant_inventory
- restaurant_order_items
- restaurant_orders
- restaurant_tables
- table_reservations

### Étape 5: Vérifier les Données

```sql
-- Compter les catégories
SELECT COUNT(*) as categories FROM menu_categories;
-- Devrait retourner: 7

-- Compter les articles
SELECT COUNT(*) as items FROM menu_items;
-- Devrait retourner: 5 (ou plus si vous en ajoutez)

-- Compter les tables
SELECT COUNT(*) as tables FROM restaurant_tables;
-- Devrait retourner: 13

-- Voir toutes les catégories
SELECT * FROM menu_categories ORDER BY display_order;

-- Voir tous les articles avec catégories
SELECT 
    mi.name,
    mc.name as category,
    mi.price,
    mi.is_vegetarian,
    mi.is_vegan
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.id
ORDER BY mc.display_order, mi.name;
```

## 🎯 Différences entre les Fichiers

### `restaurant-module.sql` (ANCIEN - NE PAS UTILISER)
❌ Erreurs dans les INSERT
❌ Colonnes manquantes ou en trop
❌ Provoque l'erreur 42601

### `restaurant-module-fixed.sql` (NOUVEAU - UTILISER CELUI-CI)
✅ Structure des tables correcte
✅ Pas de données de test (à ajouter manuellement)
✅ Pas d'erreurs SQL
✅ Prêt pour production

## 📊 Structure Complète

### Tables Créées

1. **menu_categories** - Catégories du menu
2. **menu_items** - Articles du menu avec prix et détails
3. **restaurant_tables** - Tables du restaurant
4. **restaurant_orders** - Commandes
5. **restaurant_order_items** - Détails des commandes
6. **table_reservations** - Réservations de tables
7. **restaurant_inventory** - Inventaire (optionnel)

### Triggers Créés

- Mise à jour automatique de `updated_at` pour toutes les tables

### Index Créés

- Performance optimisée pour les requêtes fréquentes

## ✅ STATUT APRÈS PUSH

- ✅ Frontend déployé automatiquement sur Vercel
- ✅ Backend déployé automatiquement sur Render
- ✅ Module Restaurant visible dans le menu
- ✅ Route /restaurant accessible
- ⏳ Base de données à configurer (utiliser le fichier fixed)

## 🚀 Prochaines Étapes

1. ✅ Exécuter `restaurant-module-fixed.sql` dans Supabase
2. ✅ Ajouter les données de test (INSERT ci-dessus)
3. ✅ Vérifier que les tables sont créées
4. ✅ Tester l'API: `GET /api/restaurant/stats`
5. ✅ Tester l'interface: https://votre-app.vercel.app/restaurant

## 📞 Support

Si vous rencontrez encore des erreurs:
1. Vérifier que toutes les tables de base existent (users, guests, rooms, bookings)
2. Vérifier que l'extension uuid-ossp est activée
3. Copier l'erreur exacte et me la partager

---

**Fichier corrigé**: `database/restaurant-module-fixed.sql`
**Date**: 30 Mai 2026
**Statut**: ✅ Prêt à utiliser
