# 🚨 ACTION IMMÉDIATE REQUISE - Module Restaurant

## Problème Actuel
Le backend est déployé sur Render mais affiche cette erreur:
```
Get orders error: error: relation "restaurant_orders" does not exist
```

**Cause:** Les tables du module Restaurant n'existent pas dans Supabase.

---

## ✅ SOLUTION EN 3 ÉTAPES

### ÉTAPE 1: Aller sur Supabase
1. Ouvre ton navigateur
2. Va sur: https://supabase.com/dashboard
3. Connecte-toi à ton compte
4. Sélectionne ton projet Zen Hotel

### ÉTAPE 2: Ouvrir SQL Editor
1. Dans le menu de gauche, clique sur **"SQL Editor"**
2. Clique sur **"New query"** (Nouvelle requête)

### ÉTAPE 3: Exécuter le Script
1. Ouvre le fichier: `database/CREER_TABLES_RESTAURANT.sql`
2. **COPIE TOUT LE CONTENU** du fichier
3. **COLLE** dans l'éditeur SQL de Supabase
4. Clique sur **"Run"** (Exécuter) en bas à droite
5. Attends le message: `Tables du module Restaurant créées avec succès!`

---

## 📋 Ce qui sera créé

Le script va créer ces tables:
- ✅ `menu_categories` - Catégories du menu (Entrées, Plats, Desserts, Boissons)
- ✅ `menu_items` - Articles du menu avec prix et descriptions
- ✅ `restaurant_tables` - Tables du restaurant (T1, T2, T3, etc.)
- ✅ `restaurant_orders` - Commandes du restaurant
- ✅ `restaurant_order_items` - Articles des commandes
- ✅ `table_reservations` - Réservations de tables
- ✅ `restaurant_inventory` - Inventaire du restaurant

**+ Données de test:**
- 4 catégories de menu
- 1 plat exemple (Salade César)
- 6 tables (3 intérieures, 2 terrasse, 1 bar)

---

## 🎯 Après l'exécution

Une fois le script exécuté:
1. ✅ Le module Restaurant fonctionnera correctement
2. ✅ Plus d'erreur "restaurant_orders does not exist"
3. ✅ Tu pourras créer des commandes dans l'application
4. ✅ Les statistiques du restaurant s'afficheront

---

## ⚠️ IMPORTANT

**NE PAS OUBLIER:** Tu dois aussi avoir exécuté le script `FIX_HOTEL_ID_PROBLEM.sql` avant pour que les réservations et chambres fonctionnent correctement.

---

## 🔄 Vérification

Pour vérifier que tout fonctionne:
1. Va sur ton application: https://zen-lyart.vercel.app
2. Connecte-toi
3. Va dans le module **Restaurant**
4. Tu devrais voir les tables et pouvoir créer des commandes

---

## 📞 Besoin d'aide?

Si tu as des erreurs lors de l'exécution:
1. Copie le message d'erreur complet
2. Envoie-le moi
3. Je t'aiderai à résoudre le problème

---

**Temps estimé:** 2-3 minutes
**Difficulté:** Facile (copier-coller)
