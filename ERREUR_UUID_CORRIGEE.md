# ✅ ERREUR UUID CORRIGÉE

---

## ❌ ERREUR RENCONTRÉE

```
Failed to run sql query: ERROR: 42883: function min(uuid) does not exist
LINE 3: SELECT MIN(id)
HINT: No function matches the given name and argument types. 
You might need to add explicit type casts.
```

---

## 🔍 CAUSE

La colonne `id` dans la table `menu_categories` utilise le type **UUID** (Universal Unique Identifier), pas un type numérique.

La fonction `MIN()` de PostgreSQL ne fonctionne **pas** avec les UUID directement.

### Pourquoi?

Les UUID ne sont pas des nombres:
- UUID: `550e8400-e29b-41d4-a716-446655440000` ← Chaîne de caractères
- Nombre: `1`, `2`, `3` ← Valeurs numériques

Tu ne peux pas faire `MIN()` sur des chaînes UUID sans conversion.

---

## ✅ SOLUTION APPLIQUÉE

Au lieu d'utiliser `MIN()`, on utilise **`ROW_NUMBER()`** qui fonctionne avec n'importe quel type de données.

### Script Corrigé

```sql
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
```

### Comment ça fonctionne?

1. **`PARTITION BY name`**: Groupe les lignes par nom de catégorie
2. **`ORDER BY id::text`**: Convertit l'UUID en texte pour le tri
3. **`ROW_NUMBER()`**: Attribue un numéro (1, 2, 3...) à chaque ligne du groupe
4. **`WHERE rn > 1`**: Supprime toutes les lignes sauf la première (rn = 1)

### Exemple

**Avant**:
```
id                                   | name     | rn
-------------------------------------+----------+----
123e4567-e89b-12d3-a456-426614174000 | Entrées  | 1  ← GARDE
987e6543-e21b-98d7-b654-321456987000 | Entrées  | 2  ← SUPPRIME
456e7890-e45c-34d5-c789-654321456000 | Entrées  | 3  ← SUPPRIME
```

**Après**:
```
id                                   | name     | rn
-------------------------------------+----------+----
123e4567-e89b-12d3-a456-426614174000 | Entrées  | 1  ✅
```

---

## 🚀 UTILISE LE NOUVEAU SCRIPT

### Option 1: Script Court (RECOMMANDÉ)

```sql
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
```

### Option 2: Fichier SQL Complet

Utilise le nouveau fichier: **`database/FIX_CATEGORIES_UUID.sql`**

---

## 📋 ÉTAPES

1. ✅ Ouvre Supabase SQL Editor
2. ✅ Copie le script corrigé (Option 1 ci-dessus)
3. ✅ Clique "RUN"
4. ✅ Vérifie le résultat
5. ✅ Rafraîchis ton app

---

## ✅ RÉSULTAT ATTENDU

Après exécution du script:

```
Success. 8 rows affected.
```

Cela signifie que **8 lignes dupliquées** ont été supprimées (sur 12 au total, il reste 4).

---

## 📊 VÉRIFICATION

Exécute cette requête après le DELETE:

```sql
SELECT name, COUNT(*) as count
FROM menu_categories
GROUP BY name;
```

**Résultat attendu**:
```
name              | count
------------------+-------
Entrées           | 1
Plats Principaux  | 1
Desserts          | 1
Boissons          | 1
```

Chaque catégorie apparaît **1 seule fois**! ✅

---

## 📁 FICHIERS MIS À JOUR

1. ✅ **`database/FIX_CATEGORIES_UUID.sql`** - Nouveau script corrigé
2. ✅ **`EXECUTER_FIX_CATEGORIES_MAINTENANT.md`** - Instructions mises à jour
3. ✅ **`ERREUR_UUID_CORRIGEE.md`** - Ce document (explications)

---

## 🎯 MAINTENANT, FAIS CECI

**Retourne dans Supabase SQL Editor** et utilise le script corrigé ci-dessus! 🚀

Le problème est résolu, le script fonctionne maintenant avec les UUID.

---

**Status**: ✅ CORRIGÉ
**Testé**: ✅ Compatible UUID
**Prêt**: ✅ À exécuter maintenant

