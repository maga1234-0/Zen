# 🗄️ GUIDE - BASE DE DONNÉES COMPLÈTE

## 📋 FICHIER: `complete-database.sql`

Ce fichier contient **TOUTES les tables** du système en un seul script SQL.

---

## 🎯 CONTENU

### Tables incluses: 25+ tables

| Module | Nombre de tables | Description |
|--------|------------------|-------------|
| **Tables principales** | 12 | Users, Hotels, Rooms, Guests, Bookings, Payments, etc. |
| **Module Spa** | 13 | Services spa, Thérapeutes, Réservations spa, Produits, etc. |
| **Module Restaurant** | À ajouter | Tables restaurant (optionnel) |
| **Réservation en ligne** | À ajouter | Tables réservation publique (optionnel) |

---

## 🚀 UTILISATION

### Étape 1: Ouvrir Supabase
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Cliquer sur **SQL Editor** dans le menu de gauche

### Étape 2: Copier le script
1. Ouvrir le fichier `complete-database.sql`
2. Sélectionner tout le contenu (Ctrl+A)
3. Copier (Ctrl+C)

### Étape 3: Exécuter
1. Retourner sur Supabase SQL Editor
2. Coller le script (Ctrl+V)
3. Cliquer sur le bouton **RUN** (en bas à droite)
4. Attendre 1-2 minutes

### Étape 4: Vérifier
Vous devriez voir un message de succès avec:
```
✅ Base de données créée avec succès!
📊 Tables principales: 12 tables
🧘 Module Spa: 13 tables
📝 Total: 25+ tables créées
```

---

## ✅ CE QUI EST CRÉÉ AUTOMATIQUEMENT

### 1. Toutes les tables
- ✅ 12 tables principales
- ✅ 13 tables spa
- ✅ Toutes les relations (foreign keys)
- ✅ Tous les index pour la performance
- ✅ Tous les triggers pour updated_at

### 2. Données initiales
- ✅ Un hôtel par défaut: "Grand Seafoam Hotel"
- ✅ 3 types de chambres: Standard, Deluxe, Suite
- ✅ Un utilisateur admin:
  - Email: `admin@hotel.com`
  - Mot de passe: `admin123`
  - **⚠️ À CHANGER EN PRODUCTION!**

### 3. Fonctions utiles
- ✅ `update_updated_at_column()` - Met à jour automatiquement updated_at
- ✅ `generate_spa_booking_reference()` - Génère des références spa uniques

---

## 🔍 VÉRIFICATION

### Méthode 1: Compter les tables
```sql
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';
```

**Résultat attendu**: Au moins 25 tables

### Méthode 2: Lister les tables
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Méthode 3: Vérifier les données initiales
```sql
-- Vérifier l'hôtel
SELECT * FROM hotels;

-- Vérifier les types de chambres
SELECT * FROM room_types;

-- Vérifier l'utilisateur admin
SELECT email, first_name, last_name, role FROM users;
```

---

## 📊 STRUCTURE DES TABLES

### Tables principales (12)
1. `users` - Utilisateurs du système
2. `hotels` - Hôtels
3. `room_types` - Types de chambres
4. `rooms` - Chambres
5. `guests` - Clients
6. `bookings` - Réservations
7. `payments` - Paiements
8. `housekeeping_tasks` - Tâches de ménage
9. `maintenance_requests` - Demandes de maintenance
10. `notifications` - Notifications
11. `audit_logs` - Logs d'audit
12. `user_settings` - Paramètres utilisateur

### Tables Spa (13)
1. `spa_service_categories` - Catégories de services
2. `spa_services` - Services spa
3. `spa_therapists` - Thérapeutes
4. `spa_treatment_rooms` - Salles de traitement
5. `spa_bookings` - Réservations spa
6. `spa_therapist_schedules` - Horaires thérapeutes
7. `spa_therapist_time_off` - Congés thérapeutes
8. `spa_products` - Produits spa
9. `spa_product_sales` - Ventes de produits
10. `spa_packages` - Forfaits spa
11. `spa_package_services` - Services dans forfaits
12. `spa_reviews` - Avis clients
13. (+ tables supplémentaires selon le module)

---

## 🔐 SÉCURITÉ

### Utilisateur admin par défaut
```
Email: admin@hotel.com
Mot de passe: admin123
```

**⚠️ IMPORTANT**: Changez ce mot de passe immédiatement après la première connexion!

### Comment changer le mot de passe
1. Se connecter avec admin@hotel.com / admin123
2. Aller dans Profil → Paramètres
3. Changer le mot de passe
4. Ou exécuter ce script SQL:
```sql
UPDATE users 
SET password_hash = '$2b$10$NOUVEAU_HASH'
WHERE email = 'admin@hotel.com';
```

---

## 🆘 DÉPANNAGE

### Problème: "relation already exists"
**Cause**: Les tables existent déjà  
**Solution**: 
- Option 1: Ignorer l'erreur (les tables existent déjà)
- Option 2: Supprimer les tables existantes d'abord (⚠️ PERTE DE DONNÉES!)

### Problème: "permission denied"
**Cause**: Droits insuffisants  
**Solution**: Vérifier que vous êtes connecté avec le bon compte Supabase

### Problème: Script trop long
**Cause**: Timeout du SQL Editor  
**Solution**: 
1. Exécuter en plusieurs parties
2. Ou augmenter le timeout dans les paramètres

### Problème: Erreur de syntaxe
**Cause**: Script incomplet ou corrompu  
**Solution**: Télécharger à nouveau le fichier depuis GitHub

---

## 📝 APRÈS L'INSTALLATION

### 1. Créer des chambres
```sql
INSERT INTO rooms (hotel_id, room_type_id, room_number, floor, status)
SELECT 
    h.id,
    rt.id,
    '101',
    1,
    'available'
FROM hotels h
CROSS JOIN room_types rt
WHERE h.name = 'Grand Seafoam Hotel'
AND rt.name = 'Standard Room';
```

### 2. Créer d'autres utilisateurs
```sql
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES (
    'receptionist@hotel.com',
    '$2b$10$...',  -- Hash du mot de passe
    'John',
    'Doe',
    'receptionist'
);
```

### 3. Tester le système
1. Se connecter sur le frontend: https://zen-lyart.vercel.app
2. Email: admin@hotel.com
3. Mot de passe: admin123
4. Explorer les différents modules

---

## 🔗 FICHIERS CONNEXES

| Fichier | Description |
|---------|-------------|
| `schema.sql` | Tables principales uniquement |
| `spa-module.sql` | Module spa uniquement |
| `restaurant-module.sql` | Module restaurant uniquement |
| `online-booking-module.sql` | Réservation en ligne uniquement |
| `verify-all-tables.sql` | Script de vérification |
| `list-all-tables.sql` | Liste simple des tables |
| `ALL_TABLES_LIST.md` | Documentation complète |

---

## ⏱️ TEMPS D'EXÉCUTION

| Action | Temps estimé |
|--------|--------------|
| Copier le script | 10 sec |
| Coller dans SQL Editor | 5 sec |
| Exécution du script | 1-2 min |
| Vérification | 30 sec |
| **TOTAL** | **2-3 min** |

---

## 🎯 PROCHAINES ÉTAPES

Après avoir exécuté ce script:

1. ✅ **Vérifier** que toutes les tables sont créées
2. ✅ **Changer** le mot de passe admin
3. ✅ **Créer** des chambres
4. ✅ **Mettre à jour** DATABASE_URL sur Render
5. ✅ **Redéployer** le backend sur Render
6. ✅ **Tester** le frontend

---

## 📞 LIENS UTILES

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Frontend**: https://zen-lyart.vercel.app
- **Render Dashboard**: https://dashboard.render.com
- **Documentation**: `ALL_TABLES_LIST.md`

---

**C'est le moyen le plus rapide de créer toute la base de données en une seule fois!** 🚀
