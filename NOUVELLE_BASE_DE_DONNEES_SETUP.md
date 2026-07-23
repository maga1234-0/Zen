# 🆕 CONFIGURATION NOUVELLE BASE DE DONNÉES SUPABASE

## ⚠️ SITUATION

Vous avez créé une **NOUVELLE base de données Supabase**:

**Nouvelle URL**:
```
postgresql://postgres.hxvhkhwhhfwtthujkahx:suUxX267q1OWx3Kw@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```

**Région**: Europe Centrale (eu-central-2)

---

## 📋 CE QUE CELA SIGNIFIE

### ✅ AVANTAGES
- Base de données fraîche et propre
- Région EU (peut-être plus proche de vos utilisateurs)
- Pas de données corrompues ou problèmes hérités

### ⚠️ CONSÉQUENCES
- La base est **VIDE** - aucune table n'existe
- Aucun utilisateur, aucune donnée
- Tous les scripts SQL doivent être exécutés

---

## 🎯 PLAN D'ACTION COMPLET

### ÉTAPE 1: Mettre à jour Render (5 min)

1. **Allez sur**: https://dashboard.render.com
2. **Ouvrez**: `zen-backend-jzjh`
3. **Cliquez**: **Environment**
4. **Trouvez**: `DATABASE_URL`
5. **Remplacez** par:

```
postgresql://postgres.hxvhkhwhhfwtthujkahx:suUxX267q1OWx3Kw@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```

6. **Cliquez**: **Save Changes**
7. **Attendez**: 3-5 minutes (redéploiement automatique)

---

### ÉTAPE 2: Créer toutes les tables (15 min)

⚠️ **IMPORTANT**: Exécutez ces scripts **DANS L'ORDRE** dans Supabase SQL Editor

#### 2.1 - Structure de base (Tables principales)

**Fichier**: `database/schema.sql`

**Où**: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql

**Comment**:
1. Cliquez sur **SQL Editor**
2. Cliquez sur **New query**
3. Ouvrez `database/schema.sql` sur votre ordinateur
4. Copiez tout le contenu
5. Collez dans l'éditeur Supabase
6. Cliquez sur **Run** (ou F5)
7. Vérifiez: Aucune erreur

---

#### 2.2 - Données initiales (Utilisateurs, rôles, types de chambres)

**Fichier**: `database/seed.sql`

**Comment**:
1. **New query** dans SQL Editor
2. Ouvrez `database/seed.sql`
3. Copiez tout le contenu
4. Collez dans l'éditeur
5. **Run**
6. Vérifiez: Vous devez voir des messages de succès

**Ce que ce script crée**:
- Utilisateur admin (email: `admin@zenith.com`, password: `admin123`)
- Rôles: admin, receptionist, housekeeper, etc.
- Types de chambres: Single, Double, Suite, etc.

---

#### 2.3 - Module Restaurant

**Fichier**: `database/restaurant-module-fixed.sql`

**Comment**:
1. **New query**
2. Ouvrez `database/restaurant-module-fixed.sql`
3. Copiez → Collez → Run
4. Vérifiez: Tables `restaurant_*` créées

---

#### 2.4 - Module Spa

**Fichier**: `database/spa-module.sql`

**Comment**:
1. **New query**
2. Ouvrez `database/spa-module.sql`
3. Copiez → Collez → Run
4. Vérifiez: Tables `spa_*` créées

---

#### 2.5 - Système Email

**Fichier**: `database/add-email-system.sql`

**Comment**:
1. **New query**
2. Ouvrez `database/add-email-system.sql`
3. Copiez → Collez → Run

---

#### 2.6 - Reset Password

**Fichier**: `database/add-password-reset-codes.sql`

**Comment**:
1. **New query**
2. Ouvrez `database/add-password-reset-codes.sql`
3. Copiez → Collez → Run

---

#### 2.7 - Colonne Profile Picture

**Fichier**: `database/add-profile-picture.sql`

**Comment**:
1. **New query**
2. Ouvrez `database/add-profile-picture.sql`
3. Copiez → Collez → Run

---

#### 2.8 - User Settings

**Fichier**: `database/add-user-settings.sql`

**Comment**:
1. **New query**
2. Ouvrez `database/add-user-settings.sql`
3. Copiez → Collez → Run

---

#### 2.9 - Maintenance Fields

**Fichier**: `database/add-maintenance-fields.sql`

**Comment**:
1. **New query**
2. Ouvrez `database/add-maintenance-fields.sql`
3. Copiez → Collez → Run

---

#### 2.10 - Hotel Info

**Fichier**: `database/add-hotel-info-columns.sql`

**Comment**:
1. **New query**
2. Ouvrez `database/add-hotel-info-columns.sql`
3. Copiez → Collez → Run

---

#### 2.11 - Fix Restaurant Room Service

**Fichier**: `database/FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql`

**Comment**:
1. **New query**
2. Ouvrez `database/FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql`
3. Copiez → Collez → Run
4. Vérifiez: `✅ Test réussi: room_charge est maintenant valide`

---

#### 2.12 - Multi-Currency (Optionnel)

**Fichier 1**: `database/ADD_MULTI_CURRENCY_SYSTEM.sql`
**Fichier 2**: `database/ADD_EXCHANGE_RATES_TO_CURRENCIES.sql`

**Comment**:
1. Exécutez d'abord `ADD_MULTI_CURRENCY_SYSTEM.sql`
2. Puis `ADD_EXCHANGE_RATES_TO_CURRENCIES.sql`

---

### ÉTAPE 3: Vérifier que tout est créé (2 min)

**Exécutez cette requête** dans SQL Editor:

```sql
-- Vérifier toutes les tables
SELECT 
    schemaname, 
    tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**Tables attendues** (au minimum 30 tables):
- users
- roles
- guests
- rooms
- room_types
- bookings
- payments
- maintenance_requests
- housekeeping_tasks
- notifications
- restaurant_orders
- restaurant_menu_items
- restaurant_categories
- spa_services
- spa_reservations
- spa_categories
- ... et d'autres

---

### ÉTAPE 4: Tester le login (2 min)

1. **Allez sur**: https://zen-lyart.vercel.app
2. **Email**: `admin@zenith.com`
3. **Password**: `admin123`
4. **Se connecter**

**✅ Résultat attendu**: Vous êtes connecté et voyez le Dashboard

---

## 📊 RÉCAPITULATIF DES SCRIPTS SQL À EXÉCUTER

| # | Fichier | Priorité | Temps |
|---|---------|----------|-------|
| 1 | `schema.sql` | 🔴 Critique | 2 min |
| 2 | `seed.sql` | 🔴 Critique | 2 min |
| 3 | `restaurant-module-fixed.sql` | 🔴 Critique | 2 min |
| 4 | `spa-module.sql` | 🔴 Critique | 2 min |
| 5 | `add-email-system.sql` | 🟡 Important | 1 min |
| 6 | `add-password-reset-codes.sql` | 🟡 Important | 1 min |
| 7 | `add-profile-picture.sql` | 🟡 Important | 1 min |
| 8 | `add-user-settings.sql` | 🟢 Optionnel | 1 min |
| 9 | `add-maintenance-fields.sql` | 🟢 Optionnel | 1 min |
| 10 | `add-hotel-info-columns.sql` | 🟢 Optionnel | 1 min |
| 11 | `FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql` | 🟡 Important | 1 min |
| 12 | `ADD_MULTI_CURRENCY_SYSTEM.sql` | 🟢 Optionnel | 1 min |
| 13 | `ADD_EXCHANGE_RATES_TO_CURRENCIES.sql` | 🟢 Optionnel | 1 min |

**Temps total**: ~20 minutes

---

## ✅ CHECKLIST DE PROGRESSION

### Configuration initiale
- [ ] DATABASE_URL mise à jour sur Render
- [ ] Render redéployé (3-5 min)
- [ ] Backend accessible: https://zen-backend-jzjh.onrender.com/api/auth/verify

### Scripts SQL critiques (obligatoires)
- [ ] `schema.sql` - Structure de base
- [ ] `seed.sql` - Données initiales (admin, rôles)
- [ ] `restaurant-module-fixed.sql` - Module restaurant
- [ ] `spa-module.sql` - Module spa

### Scripts SQL importants (recommandés)
- [ ] `add-email-system.sql` - Système d'emails
- [ ] `add-password-reset-codes.sql` - Reset password
- [ ] `add-profile-picture.sql` - Photos de profil
- [ ] `FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql` - Fix room service

### Scripts SQL optionnels
- [ ] `add-user-settings.sql` - Paramètres utilisateur
- [ ] `add-maintenance-fields.sql` - Champs maintenance
- [ ] `add-hotel-info-columns.sql` - Infos hôtel
- [ ] `ADD_MULTI_CURRENCY_SYSTEM.sql` - Multi-devises
- [ ] `ADD_EXCHANGE_RATES_TO_CURRENCIES.sql` - Taux de change

### Tests finaux
- [ ] Login fonctionne avec admin@zenith.com
- [ ] Dashboard s'affiche correctement
- [ ] Pages principales accessibles (Bookings, Rooms, Staff, etc.)
- [ ] Restaurant fonctionne (commandes)
- [ ] Spa fonctionne (réservations)

---

## 🆘 EN CAS DE PROBLÈME

### Erreur "relation does not exist"
→ La table n'a pas été créée, réexécutez le script correspondant

### Erreur "duplicate key value"
→ Les données existent déjà, vous pouvez ignorer ou supprimer les données existantes

### Login ne fonctionne pas après tout
→ Vérifiez que `seed.sql` s'est bien exécuté (créer l'utilisateur admin)

### Render ne se connecte pas
→ Vérifiez que DATABASE_URL est exactement:
```
postgresql://postgres.hxvhkhwhhfwtthujkahx:suUxX267q1OWx3Kw@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```

---

## 📝 NOTES IMPORTANTES

### Sécurité
⚠️ **NE JAMAIS** committer `zen_backend/.env` dans Git
⚠️ Cette URL contient votre mot de passe de base de données

### Backup
✅ Après avoir tout configuré, faites un backup dans Supabase:
- Dashboard → Database → Backups
- Ou exportez via: SQL Editor → Export

### Migration de données
Si vous aviez des données dans l'ancienne base:
- Vous devrez les exporter de l'ancienne base
- Et les importer dans la nouvelle
- Ou les recréer manuellement

---

## 🎯 PROCHAINES ÉTAPES

Une fois TOUTES les tables créées et le login fonctionnel:

1. ✅ Configurer les informations de l'hôtel dans Settings
2. ✅ Créer des chambres dans Rooms
3. ✅ Ajouter du personnel dans Staff
4. ✅ Tester les réservations
5. ✅ Tester Restaurant et Spa

---

## 🚀 COMMENCEZ MAINTENANT

**Ordre d'exécution**:

1. **D'ABORD**: Mettre à jour DATABASE_URL sur Render
2. **ATTENDRE**: 3-5 minutes (redéploiement)
3. **ENSUITE**: Exécuter les scripts SQL dans l'ordre
4. **TESTER**: Login sur https://zen-lyart.vercel.app

**Temps total estimé**: 30-40 minutes

---

**🔥 IMPORTANT**: Avec une nouvelle base de données, vous repartez de zéro. Prenez le temps d'exécuter tous les scripts critiques pour avoir une base fonctionnelle!
