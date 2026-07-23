# ⚡ EXÉCUTER MAINTENANT: Créer les Catégories Restaurant

## ❌ ERREUR ACTUELLE

```
relation "restaurant_categories" does not exist
```

**Cause**: La table `restaurant_categories` n'existe pas dans votre base de données.

---

## ✅ SOLUTION (2 MINUTES)

J'ai mis à jour le script pour qu'il **crée la table ET les catégories** en une seule exécution.

### Exécuter le script

1. **Allez sur**: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql

2. **Cliquez**: New query

3. **Copiez** le contenu COMPLET du fichier: `database/CREATE_RESTAURANT_CATEGORIES.sql`

4. **Collez** dans l'éditeur SQL

5. **Cliquez**: Run (ou F5)

6. **Vérifiez**: Vous devez voir un tableau avec 4 lignes

---

## 📋 CE QUE LE SCRIPT FAIT

### Étape 1: Créer la table
```sql
CREATE TABLE IF NOT EXISTS restaurant_categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Étape 2: Insérer les 4 catégories
1. 🥗 Entrées / Starters
2. 🍝 Plats / Main Courses
3. 🍰 Desserts
4. 🍹 Boissons / Beverages

---

## ✅ RÉSULTAT ATTENDU

Après l'exécution, vous devez voir:

```
┌──────────────────────────────────────┬──────────────────┬─────────┬────────────────────────────────────┐
│ id                                   │ name             │ name_fr │ description                         │
├──────────────────────────────────────┼──────────────────┼─────────┼────────────────────────────────────┤
│ 11111111-1111-1111-1111-111111111111 │ Starters         │ Entrées │ Salades, soupes et amuse-bouches   │
│ 22222222-2222-2222-2222-222222222222 │ Main Courses     │ Plats   │ Plats principaux, viandes et...    │
│ 33333333-3333-3333-3333-333333333333 │ Desserts         │ Desserts│ Pâtisseries, glaces et fruits      │
│ 44444444-4444-4444-4444-444444444444 │ Beverages        │ Boissons│ Boissons chaudes, froides et...    │
└──────────────────────────────────────┴──────────────────┴─────────┴────────────────────────────────────┘
4 rows
```

---

## 🧪 TESTER

Après l'exécution du script:

### 1. Actualiser la page Restaurant

1. Allez sur: https://zen-lyart.vercel.app/restaurant
2. **F5** pour actualiser
3. Cliquez sur l'onglet **Menu**
4. Cliquez sur **Ajouter un Article**

### 2. Vérifier la liste déroulante

1. Regardez le champ **Catégorie**
2. Cliquez sur la liste déroulante
3. **✅ Vous devez voir les 4 catégories**:
   - Entrées
   - Plats
   - Desserts
   - Boissons

### 3. Créer votre premier article

1. **Nom**: Pizza Margherita
2. **Description**: Pizza classique italienne
3. **Prix**: 12.50
4. **Catégorie**: **Plats**
5. **Temps de préparation**: 15
6. Cliquez sur **Créer**

**✅ L'article est créé avec succès!**

---

## 🔍 VÉRIFIER DANS LA BASE

### Vérifier que la table existe

```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'restaurant_categories';
```

**Résultat attendu**: 1 ligne avec `restaurant_categories`

---

### Vérifier les catégories

```sql
SELECT * FROM restaurant_categories ORDER BY display_order;
```

**Résultat attendu**: 4 lignes avec les catégories

---

## 📊 STRUCTURE DE LA TABLE

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | VARCHAR(100) | Nom en anglais |
| name_fr | VARCHAR(100) | Nom en français |
| description | TEXT | Description de la catégorie |
| display_order | INTEGER | Ordre d'affichage (1, 2, 3, 4) |
| is_active | BOOLEAN | Active ou non |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

---

## ⚠️ SI D'AUTRES TABLES MANQUENT

Si vous voyez d'autres erreurs comme:
- `restaurant_menu_items does not exist`
- `restaurant_orders does not exist`
- `restaurant_tables does not exist`

**Solution**: Exécutez le script complet du module restaurant:

1. Allez sur: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql
2. **New query**
3. Copiez le contenu de: `database/restaurant-module-fixed.sql`
4. **Run**

Ce script crée **TOUTES** les tables du restaurant:
- ✅ restaurant_categories
- ✅ restaurant_menu_items
- ✅ restaurant_orders
- ✅ restaurant_order_items
- ✅ restaurant_tables
- ✅ restaurant_reservations

---

## 📝 ORDRE D'EXÉCUTION RECOMMANDÉ

### Option 1: Juste les catégories (RAPIDE)
```
1. CREATE_RESTAURANT_CATEGORIES.sql (2 min)
```

**À utiliser si**: Vous avez déjà les autres tables restaurant

---

### Option 2: Module complet (RECOMMANDÉ)
```
1. restaurant-module-fixed.sql (5 min)
```

**À utiliser si**: C'est une nouvelle base de données ou il manque plusieurs tables

---

## ✅ CHECKLIST

- [ ] Script CREATE_RESTAURANT_CATEGORIES.sql exécuté
- [ ] 4 catégories affichées dans les résultats
- [ ] Table restaurant_categories existe
- [ ] Page Restaurant actualisée (F5)
- [ ] Liste déroulante Catégorie affiche les 4 catégories
- [ ] Création d'un article menu fonctionne

---

## 🔗 LIENS RAPIDES

**Supabase SQL Editor**:  
https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql

**Frontend Restaurant**:  
https://zen-lyart.vercel.app/restaurant

---

**🚀 Exécutez le script maintenant dans Supabase!**

Le script est prêt à être exécuté - il crée la table ET les catégories en une seule fois.
