# 📋 CRÉER LES CATÉGORIES RESTAURANT - 2 MINUTES

## 🎯 Problème

Dans la page **Restaurant**, le dropdown "Catégorie" est **vide** lors de la création d'un article menu.

**Cause**: La table `menu_categories` existe mais ne contient aucune donnée (nouvelle base de données vide).

---

## ✅ SOLUTION EN 3 ÉTAPES (2 minutes)

### ÉTAPE 1: Ouvrir Supabase SQL Editor

1. Aller sur: https://supabase.com/dashboard
2. Se connecter
3. Sélectionner le projet: **hxvhkhwhhfwtthujkahx** (eu-central-2)
4. Dans le menu de gauche, cliquer sur **SQL Editor**
5. Cliquer sur **New Query**

---

### ÉTAPE 2: Copier-Coller le Script SQL

Copier ce script et le coller dans l'éditeur SQL:

```sql
-- ============================================
-- CRÉER LES 4 CATÉGORIES DE BASE
-- ============================================

-- Vérifier la structure de la table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'menu_categories'
ORDER BY ordinal_position;

-- Supprimer les catégories existantes (éviter doublons)
DELETE FROM menu_categories;

-- Créer les 4 catégories de base
INSERT INTO menu_categories (name, name_fr, name_en, name_es, type, display_order, is_active) VALUES
('Entrées', 'Entrées', 'Starters', 'Entradas', 'food', 1, true),
('Plats', 'Plats', 'Main Courses', 'Platos', 'food', 2, true),
('Desserts', 'Desserts', 'Desserts', 'Postres', 'food', 3, true),
('Boissons', 'Boissons', 'Beverages', 'Bebidas', 'beverage', 4, true)
ON CONFLICT DO NOTHING;

-- Vérifier que les catégories ont été créées
SELECT 
    id,
    name,
    name_fr,
    name_en,
    name_es,
    type,
    display_order,
    is_active
FROM menu_categories
ORDER BY display_order;
```

---

### ÉTAPE 3: Exécuter et Vérifier

1. Cliquer sur le bouton **Run** (ou appuyer sur Ctrl+Enter)
2. Attendre 2-3 secondes
3. Vérifier les résultats en bas:
   - **Premier résultat**: Structure de la table (colonnes)
   - **Deuxième résultat**: 4 lignes avec les catégories

**Résultat attendu** (4 catégories):
```
1. Entrées / Starters / Entradas
2. Plats / Main Courses / Platos
3. Desserts / Desserts / Postres
4. Boissons / Beverages / Bebidas
```

---

## 🧪 TESTER

### 1. Rafraîchir la Page Restaurant

1. Aller sur: https://zen-lyart.vercel.app
2. Se connecter (aubinmaga@gmail.com / admin123)
3. Aller dans la page **Restaurant**
4. Cliquer sur l'onglet **Menu**
5. Cliquer sur **+ Nouvel Article**
6. Chercher le dropdown **Catégorie**

**Résultat attendu**:
```
✅ Dropdown affiche:
  - Entrées
  - Plats
  - Desserts
  - Boissons
```

---

## ⚠️ SI LE DROPDOWN EST TOUJOURS VIDE

### Vérification 1: Catégories Créées dans Supabase?

Dans Supabase:
1. Menu gauche → **Table Editor**
2. Trouver la table **menu_categories**
3. Vérifier qu'il y a **4 lignes**

**Si 0 lignes**:
- Le script n'a pas fonctionné
- Vérifier qu'il n'y a pas d'erreur SQL dans l'éditeur
- Réessayer

**Si 4 lignes existent**:
- ✅ Catégories créées correctement
- ➡️ Passer à Vérification 2

---

### Vérification 2: Backend Render Est à Jour?

Le backend doit être déployé et fonctionnel:

1. Aller sur: https://dashboard.render.com
2. Trouver le service **zen-backend**
3. Vérifier que le status est **"Live"** (vert)
4. Si "Deploying..." → Attendre 2-3 minutes

---

### Vérification 3: Cache du Navigateur?

Vider le cache:
1. Sur la page Restaurant
2. Appuyer sur **Ctrl + Shift + R**
3. Attendre 2-3 secondes
4. Réessayer de créer un article

---

### Vérification 4: API Backend Fonctionne?

Tester l'API directement:

1. Ouvrir un nouvel onglet
2. Aller sur: https://zen-backend-jzjh.onrender.com/api/restaurant/menu/categories
3. Devrait afficher un JSON avec les 4 catégories

**Si erreur 500 ou timeout**:
- ❌ Problème backend
- Vérifier les logs Render
- Vérifier que DATABASE_URL est correcte

**Si JSON correct**:
- ✅ Backend fonctionne
- ❌ Problème frontend
- Vider le cache (Ctrl+Shift+R)

---

## 📊 STRUCTURE TABLE `menu_categories`

La table a ces colonnes:
- `id` (uuid) - Identifiant unique
- `name` (varchar) - Nom principal
- `name_fr` (varchar) - Nom en français
- `name_en` (varchar) - Nom en anglais
- `name_es` (varchar) - Nom en espagnol
- `type` (varchar) - Type: 'food' ou 'beverage'
- `display_order` (integer) - Ordre d'affichage
- `is_active` (boolean) - Actif ou non
- `created_at` (timestamp)
- `updated_at` (timestamp)

⚠️ **IMPORTANT**: La table N'a PAS de colonne `description` (contrairement aux anciens scripts).

---

## 🎯 AJOUTER D'AUTRES CATÉGORIES (Optionnel)

Si vous voulez ajouter plus de catégories:

```sql
-- Exemple: Ajouter une catégorie "Petit-déjeuner"
INSERT INTO menu_categories (name, name_fr, name_en, name_es, type, display_order, is_active)
VALUES ('Petit-déjeuner', 'Petit-déjeuner', 'Breakfast', 'Desayuno', 'food', 5, true);

-- Exemple: Ajouter une catégorie "Cocktails"
INSERT INTO menu_categories (name, name_fr, name_en, name_es, type, display_order, is_active)
VALUES ('Cocktails', 'Cocktails', 'Cocktails', 'Cócteles', 'beverage', 6, true);
```

---

## ✅ CHECKLIST

- [ ] Ouvrir Supabase SQL Editor
- [ ] Copier le script SQL fourni
- [ ] Exécuter le script (Run)
- [ ] Vérifier que 4 catégories sont créées
- [ ] Rafraîchir la page Restaurant (F5)
- [ ] Cliquer "Menu" → "+ Nouvel Article"
- [ ] Vérifier que dropdown "Catégorie" affiche les 4 catégories ✅

---

## 📚 FICHIERS DE RÉFÉRENCE

- `database/CREATE_RESTAURANT_CATEGORIES.sql` - Script complet avec commentaires
- `client/src/pages/Restaurant.tsx` - Code frontend (dropdown catégories)

---

## 🎉 RÉSULTAT FINAL

**Avant**:
```
Page Restaurant → Nouvel Article → Catégorie: [vide] ❌
```

**Après**:
```
Page Restaurant → Nouvel Article → Catégorie:
  • Entrées
  • Plats
  • Desserts
  • Boissons
✅
```

---

**Créé**: 31 août 2026  
**Temps**: 2 minutes  
**Objectif**: Créer les 4 catégories de base pour le restaurant  
**Statut**: Prêt à exécuter ✅
