# 🔧 FIX: Catégories Vides dans Restaurant

## ❌ PROBLÈME

Dans la page Restaurant, quand vous créez un article menu:
- Le champ "Catégorie" affiche seulement "Sélectionner..."
- Aucune catégorie n'apparaît dans la liste déroulante
- Impossible de créer un article menu sans catégorie

**Cause**: Les catégories n'existent pas dans la base de données.

---

## ✅ SOLUTION (2 MINUTES)

### Exécuter le script SQL pour créer les catégories

1. **Allez sur**: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql

2. **Cliquez**: New query

3. **Copiez** le contenu du fichier: `database/CREATE_RESTAURANT_CATEGORIES.sql`

4. **Collez** dans l'éditeur SQL

5. **Cliquez**: Run (ou F5)

6. **Vérifiez**: Vous devez voir un tableau avec 4 catégories

---

## 📋 CATÉGORIES QUI SERONT CRÉÉES

Le script crée 4 catégories de base:

### 1. 🥗 Entrées / Starters
- Salades, soupes et amuse-bouches
- `display_order: 1`

### 2. 🍝 Plats / Main Courses
- Plats principaux, viandes et poissons
- `display_order: 2`

### 3. 🍰 Desserts
- Pâtisseries, glaces et fruits
- `display_order: 3`

### 4. 🍹 Boissons / Beverages
- Boissons chaudes, froides et alcoolisées
- `display_order: 4`

---

## 🧪 TESTER APRÈS LE FIX

### Étape 1: Actualiser la page Restaurant

1. Allez sur: https://zen-lyart.vercel.app/restaurant
2. Appuyez sur **F5** (actualiser)
3. Cliquez sur l'onglet **Menu**

### Étape 2: Créer un article

1. Cliquez sur: **Ajouter un Article**
2. Regardez le champ **Catégorie**
3. Cliquez sur la liste déroulante

**✅ Résultat attendu**: 
Vous voyez maintenant 4 catégories:
- Entrées
- Plats
- Desserts
- Boissons

### Étape 3: Créer votre premier article

1. **Nom**: Pizza Margherita
2. **Description**: Pizza classique avec mozzarella et basilic
3. **Prix**: 12.50
4. **Catégorie**: **Plats** ← Sélectionnez dans la liste
5. **Temps de préparation**: 15
6. Cliquez sur **Créer**

**✅ L'article est créé avec succès!**

---

## 🔍 VÉRIFIER QUE LES CATÉGORIES EXISTENT

### Dans Supabase

```sql
SELECT * FROM restaurant_categories ORDER BY display_order;
```

**Résultat attendu**: 4 lignes avec les catégories

### Via l'API

Ouvrez cette URL dans votre navigateur:
```
https://zen-backend-jzjh.onrender.com/api/restaurant/menu/categories
```

**Résultat attendu**: JSON avec 4 catégories

---

## ⚠️ SI LE PROBLÈME PERSISTE

### Problème 1: Table n'existe pas

**Erreur**: `relation "restaurant_categories" does not exist`

**Solution**: Exécutez d'abord le script complet:
```
database/restaurant-module-fixed.sql
```

### Problème 2: Catégories toujours vides après le script

**Solution**:
1. Actualisez la page Restaurant (F5)
2. Ouvrez la console navigateur (F12)
3. Regardez les erreurs dans l'onglet "Console"
4. Vérifiez que l'API répond correctement

### Problème 3: Backend ne répond pas

**Vérification**:
1. Allez sur: https://dashboard.render.com
2. Ouvrez: zen-backend-jzjh
3. Vérifiez les logs
4. Le backend doit être "Live"

---

## 📊 STRUCTURE DE LA TABLE

La table `restaurant_categories` contient:

| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Identifiant unique |
| name | VARCHAR | Nom en anglais |
| name_fr | VARCHAR | Nom en français |
| description | TEXT | Description |
| display_order | INTEGER | Ordre d'affichage |
| is_active | BOOLEAN | Active ou non |
| created_at | TIMESTAMP | Date de création |

---

## ➕ AJOUTER D'AUTRES CATÉGORIES

Si vous voulez ajouter d'autres catégories plus tard:

```sql
INSERT INTO restaurant_categories (name, name_fr, description, display_order, is_active) VALUES
('Specials', 'Spécialités', 'Plats du jour et spécialités', 5, true),
('Kids Menu', 'Menu Enfant', 'Menu pour les enfants', 6, true);
```

---

## 📝 CHECKLIST

- [ ] Script CREATE_RESTAURANT_CATEGORIES.sql exécuté dans Supabase
- [ ] 4 catégories visibles dans le tableau de résultats
- [ ] Page Restaurant actualisée (F5)
- [ ] Liste déroulante Catégorie affiche les 4 catégories
- [ ] Création d'un article menu fonctionne

---

## 🔗 LIENS RAPIDES

**Supabase SQL Editor**:  
https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql

**Frontend**:  
https://zen-lyart.vercel.app/restaurant

**API Catégories**:  
https://zen-backend-jzjh.onrender.com/api/restaurant/menu/categories

---

**🚀 Exécutez le script maintenant - 2 minutes!**

Après l'exécution, actualisez la page Restaurant et les catégories apparaîtront dans la liste déroulante.
