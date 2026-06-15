# 🔧 FIX: Catégories de Menu Dupliquées

---

## 🎯 PROBLÈME

Dans le formulaire "Nouvel Article Menu", la liste déroulante des catégories affiche des doublons:
- ❌ Entrées (3 fois)
- ❌ Plats Principaux (3 fois)
- ❌ Desserts (3 fois)
- ❌ Boissons (3 fois)

---

## ✅ SOLUTION (2 MINUTES)

Tu dois exécuter un script SQL dans Supabase pour supprimer les doublons.

---

## 📋 ÉTAPES

### 1️⃣ Ouvre Supabase SQL Editor

**Va sur:** https://supabase.com/dashboard/project/vzzznyrlbhftixgkqcca/sql/new

---

### 2️⃣ Copie ce script SQL

```sql
-- Supprimer les catégories dupliquées (VERSION CORRIGÉE pour UUID)
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

-- Vérifier le résultat
SELECT id, name, type, display_order, is_active
FROM menu_categories
ORDER BY display_order, name;
```

---

### 3️⃣ Exécute le script

1. Colle le script dans l'éditeur SQL
2. Clique sur le bouton **"RUN"** (en bas à droite)
3. Vérifie le résultat dans la section "Results"

---

## ✅ RÉSULTAT ATTENDU

Tu dois voir uniquement **4 catégories** (1 seule fois chacune):

```
id | name              | type  | display_order | is_active
---+-------------------+-------+---------------+-----------
1  | Entrées           | food  | 1             | true
2  | Plats Principaux  | food  | 2             | true
3  | Desserts          | food  | 3             | true
4  | Boissons          | drink | 4             | true
```

---

## 🧪 VÉRIFICATION

### Après avoir exécuté le script:

1. **Rafraîchis la page** de ton application: https://zen-lyart.vercel.app
2. **Va dans** Restaurant → Cliquer sur **"+ Nouvel Article"**
3. **Vérifie** la liste déroulante "Catégorie"

Tu dois maintenant voir chaque catégorie **une seule fois**! ✅

---

## 📁 FICHIER SQL COMPLET

Le fichier avec plus de détails est dans:
```
database/FIX_DUPLICATE_MENU_CATEGORIES.sql
```

---

## ❓ BESOIN D'AIDE?

### Si le script ne fonctionne pas
→ Vérifie que tu es bien connecté au bon projet Supabase

### Si les doublons persistent après le script
→ Vide le cache de ton navigateur (Ctrl + Shift + R)

### Si tu vois une erreur SQL
→ Partage-moi l'erreur exacte

---

## ⚡ RÉSUMÉ ULTRA-RAPIDE

1. ✅ Ouvre Supabase SQL Editor
2. ✅ Copie le script SQL ci-dessus
3. ✅ Clique "RUN"
4. ✅ Rafraîchis ton app
5. ✅ **C'EST RÉGLÉ!** 🎉

---

**Temps requis**: 2 minutes maximum
**Difficulté**: ⭐ Facile

