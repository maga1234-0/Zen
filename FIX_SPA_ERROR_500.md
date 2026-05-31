# 🚨 FIX ERREUR 500 - MODULE SPA

## 🐛 Erreur actuelle

```
GET /api/spa/bookings [HTTP/2 500]
GET /api/spa/statistics [HTTP/2 500]
API Error: 500 { message: "Server error" }
```

**Cause**: Les tables spa n'existent pas dans votre nouvelle base de données!

## ✅ Solution (2 minutes)

### Étape 1: Exécuter le script des tables spa

1. **Ouvrir** Supabase SQL Editor (https://supabase.com/dashboard)
2. **Copier** TOUT le contenu de `database/spa-module.sql`
3. **Coller** dans SQL Editor
4. **Cliquer** RUN
5. **Attendre** la confirmation

**Résultat attendu**: 13 tables spa créées

### Étape 2: Vérifier que les tables sont créées

Dans Supabase SQL Editor, exécuter:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'spa_%'
ORDER BY table_name;
```

**Résultat attendu**: 13 lignes
```
spa_bookings
spa_package_services
spa_packages
spa_product_sales
spa_products
spa_reviews
spa_service_categories
spa_services
spa_therapist_schedules
spa_therapist_time_off
spa_therapists
spa_treatment_rooms
```

### Étape 3: Tester le frontend

1. **Rafraîchir** la page spa (F5)
2. **Vérifier** qu'il n'y a plus d'erreur 500
3. **La page** devrait se charger correctement

---

## 📋 ORDRE D'EXÉCUTION DES SCRIPTS

Pour une nouvelle base de données, exécutez dans cet ordre:

### 1️⃣ Tables principales (FAIT ✅)
**Fichier**: `database/SETUP_INITIAL_DATA.sql`
- Crée: hôtel, types de chambres, admin, users, rooms, bookings, etc.

### 2️⃣ Tables spa (À FAIRE ⚠️)
**Fichier**: `database/spa-module.sql`
- Crée: 13 tables pour le module spa

### 3️⃣ Tables restaurant (OPTIONNEL)
**Fichier**: `database/restaurant-module.sql`
- Crée: tables pour le module restaurant

---

## 🚀 ACTION IMMÉDIATE

**Exécutez maintenant**: `database/spa-module.sql` dans Supabase!

1. Ouvrir Supabase SQL Editor
2. Copier `database/spa-module.sql`
3. Coller et cliquer RUN
4. Rafraîchir la page spa

**L'erreur 500 disparaîtra immédiatement!** 🎉

---

## 🔍 POURQUOI CETTE ERREUR?

Le backend essaie de faire des requêtes sur les tables spa:
```sql
SELECT * FROM spa_bookings;
SELECT * FROM spa_services;
```

Mais ces tables n'existent pas → Erreur SQL → Erreur 500

**Solution**: Créer les tables spa avec le script `spa-module.sql`

---

## ✅ VÉRIFICATION FINALE

Après avoir exécuté le script:

1. **Aller** sur https://zen-lyart.vercel.app/spa
2. **Vérifier** qu'il n'y a plus d'erreur dans la console
3. **La page** devrait afficher:
   - Statistiques à 0 (normal, pas de données)
   - Pas de bandeau d'erreur
   - Formulaires fonctionnels

---

**👉 PROCHAINE ÉTAPE: Exécuter `database/spa-module.sql` dans Supabase!**
