# 🗄️ GUIDE CRÉATION TABLES SUPABASE - MODULE SPA

## 🎯 OBJECTIF

Créer les 13 tables nécessaires pour le module spa dans votre base de données Supabase.

**Temps estimé**: 2 minutes

---

## 📋 ÉTAPES DÉTAILLÉES

### Étape 1: Ouvrir Supabase Dashboard

1. Aller sur: **https://supabase.com/dashboard**
2. Se connecter si nécessaire
3. Sélectionner votre projet (celui utilisé pour l'hôtel)

### Étape 2: Ouvrir SQL Editor

1. Dans le menu de gauche, chercher **"SQL Editor"**
2. Cliquer dessus
3. Vous verrez un éditeur de code SQL

### Étape 3: Ouvrir le fichier SQL

**Option A: Depuis le repo zen_backend**
1. Ouvrir le fichier: `zen_backend/database/spa-module.sql`
2. Sélectionner tout le contenu (Ctrl+A)
3. Copier (Ctrl+C)

**Option B: Depuis le repo principal**
1. Ouvrir le fichier: `database/spa-module.sql`
2. Sélectionner tout le contenu (Ctrl+A)
3. Copier (Ctrl+C)

### Étape 4: Coller dans SQL Editor

1. Retourner sur Supabase SQL Editor
2. Coller le contenu (Ctrl+V)
3. Vous devriez voir environ 400 lignes de code SQL

### Étape 5: Exécuter le script

1. En bas à droite, chercher le bouton **"RUN"**
2. Cliquer dessus
3. Attendre quelques secondes

### Étape 6: Vérifier le résultat

**Résultat attendu**:
```
Success. No rows returned
```

Ou un message similaire indiquant que le script s'est exécuté sans erreur.

---

## ✅ VÉRIFICATION

Pour vérifier que les tables ont bien été créées:

### Méthode 1: Table Editor
1. Dans le menu de gauche, cliquer sur **"Table Editor"**
2. Vous devriez voir les nouvelles tables:
   - `spa_categories`
   - `spa_services`
   - `spa_therapists`
   - `spa_bookings`
   - `spa_packages`
   - `spa_package_services`
   - `spa_products`
   - `spa_inventory`
   - `spa_treatments`
   - `spa_reviews`
   - `spa_promotions`
   - `spa_memberships`
   - `spa_member_bookings`

### Méthode 2: SQL Query
Dans SQL Editor, exécuter:
```sql
SELECT COUNT(*) FROM spa_services;
```

**Résultat attendu**: `0` (zéro, car pas de données encore)

---

## 📊 TABLES CRÉÉES

Le script crée 13 tables:

| Table | Description |
|-------|-------------|
| `spa_categories` | Catégories de services (massage, soin visage, etc.) |
| `spa_services` | Services spa disponibles |
| `spa_therapists` | Thérapeutes et leurs spécialités |
| `spa_bookings` | Réservations de services spa |
| `spa_packages` | Forfaits (plusieurs services groupés) |
| `spa_package_services` | Services inclus dans les forfaits |
| `spa_products` | Produits spa (huiles, crèmes, etc.) |
| `spa_inventory` | Inventaire des produits |
| `spa_treatments` | Historique des traitements |
| `spa_reviews` | Avis clients sur les services |
| `spa_promotions` | Promotions et offres spéciales |
| `spa_memberships` | Abonnements spa |
| `spa_member_bookings` | Réservations des membres |

---

## ❌ SI ERREUR

### Erreur 1: "relation already exists"
**Cause**: Les tables existent déjà  
**Solution**: Pas de problème! Les tables sont déjà créées

**Pour recréer les tables**:
1. Supprimer les tables existantes:
```sql
DROP TABLE IF EXISTS spa_member_bookings CASCADE;
DROP TABLE IF EXISTS spa_memberships CASCADE;
DROP TABLE IF EXISTS spa_promotions CASCADE;
DROP TABLE IF EXISTS spa_reviews CASCADE;
DROP TABLE IF EXISTS spa_treatments CASCADE;
DROP TABLE IF EXISTS spa_inventory CASCADE;
DROP TABLE IF EXISTS spa_products CASCADE;
DROP TABLE IF EXISTS spa_package_services CASCADE;
DROP TABLE IF EXISTS spa_packages CASCADE;
DROP TABLE IF EXISTS spa_bookings CASCADE;
DROP TABLE IF EXISTS spa_therapists CASCADE;
DROP TABLE IF EXISTS spa_services CASCADE;
DROP TABLE IF EXISTS spa_categories CASCADE;
```
2. Puis réexécuter le script `spa-module.sql`

### Erreur 2: "permission denied"
**Cause**: Droits insuffisants  
**Solution**: Vérifier que vous êtes connecté avec le bon compte Supabase

### Erreur 3: "syntax error"
**Cause**: Script SQL incomplet ou corrompu  
**Solution**: Vérifier que vous avez copié TOUT le contenu du fichier

---

## 🔍 CONTENU DU SCRIPT

Le script SQL fait les actions suivantes:

1. **Crée les tables** avec leurs colonnes
2. **Ajoute les contraintes** (clés primaires, étrangères)
3. **Crée les index** pour les performances
4. **Active RLS** (Row Level Security)
5. **Crée les politiques** de sécurité
6. **Ajoute des triggers** pour les timestamps

---

## 🎯 APRÈS LA CRÉATION

Une fois les tables créées:

### Test 1: Vérifier dans Table Editor
```
Supabase → Table Editor → Voir les 13 nouvelles tables
```

### Test 2: Tester l'API
```
URL: https://votre-backend.onrender.com/api/spa/services
Résultat: [] (tableau vide, normal)
```

### Test 3: Tester le frontend
```
URL: https://zen-lyart.vercel.app/spa
Résultat:
- ✅ Pas de bandeau jaune
- ✅ Statistiques à 0
- ✅ Possibilité de créer des données
```

---

## 📝 DONNÉES DE TEST (OPTIONNEL)

Si vous voulez ajouter des données de test, exécuter dans SQL Editor:

```sql
-- Ajouter une catégorie
INSERT INTO spa_categories (name, description, icon, display_order)
VALUES ('Massage', 'Massages relaxants et thérapeutiques', 'massage', 1);

-- Ajouter un service
INSERT INTO spa_services (name, category_id, duration, price, description)
SELECT 
  'Massage Suédois',
  id,
  60,
  80.00,
  'Massage relaxant aux huiles essentielles'
FROM spa_categories WHERE name = 'Massage';

-- Ajouter un thérapeute
INSERT INTO spa_therapists (first_name, last_name, email, phone, specialties)
VALUES (
  'Marie',
  'Dubois',
  'marie.dubois@spa.com',
  '+33612345678',
  ARRAY['Massage', 'Aromathérapie']
);
```

---

## 🆘 BESOIN D'AIDE?

### Problème: Script ne s'exécute pas
1. Vérifier que vous avez copié TOUT le fichier
2. Vérifier qu'il n'y a pas de caractères bizarres
3. Essayer de copier à nouveau depuis le fichier source

### Problème: Tables pas visibles
1. Rafraîchir la page (F5)
2. Vérifier que vous êtes dans le bon projet Supabase
3. Vérifier dans SQL Editor avec `\dt` pour lister les tables

### Problème: Erreur de permission
1. Vérifier que vous êtes le propriétaire du projet
2. Vérifier que vous n'êtes pas en mode "read-only"

---

## 📞 LIENS UTILES

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Documentation Supabase**: https://supabase.com/docs
- **SQL Editor**: https://supabase.com/dashboard/project/_/sql

---

## ⏱️ TIMELINE

| Étape | Temps |
|-------|-------|
| Ouvrir Supabase | 30 sec |
| Ouvrir SQL Editor | 10 sec |
| Copier le script | 20 sec |
| Coller et exécuter | 30 sec |
| Vérifier | 30 sec |
| **TOTAL** | **2 min** |

---

**C'est la dernière étape! Après ça, le module spa sera 100% fonctionnel!** 🎉
