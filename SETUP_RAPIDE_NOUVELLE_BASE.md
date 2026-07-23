# ⚡ SETUP RAPIDE - NOUVELLE BASE DE DONNÉES

## 🎯 VOTRE NOUVELLE BASE

**URL Supabase**:
```
postgresql://postgres.hxvhkhwhhfwtthujkahx:suUxX267q1OWx3Kw@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```

**Project ID**: `hxvhkhwhhfwtthujkahx`  
**Région**: Europe Centrale (eu-central-2)  
**Dashboard**: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx

---

## 🚀 SETUP EN 3 ÉTAPES (20 MIN)

### ✅ ÉTAPE 1: Mettre à jour Render (5 min)

1. Allez sur: **https://dashboard.render.com**
2. Ouvrez: **zen-backend-jzjh**
3. Cliquez: **Environment**
4. Trouvez: **DATABASE_URL**
5. Remplacez par:
```
postgresql://postgres.hxvhkhwhhfwtthujkahx:suUxX267q1OWx3Kw@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```
6. **Save Changes**
7. **Attendez 3-5 minutes** (redéploiement automatique)

---

### ✅ ÉTAPE 2: Créer les tables (10 min)

Allez sur: **https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql**

#### 2.1 - Tables principales (2 min)

1. **New query**
2. Copiez le contenu de: `database/schema.sql`
3. Collez et cliquez **Run**

#### 2.2 - Données initiales (2 min)

1. **New query**
2. Copiez le contenu de: `database/seed.sql`
3. Collez et cliquez **Run**

**Ce script crée**:
- ✅ Utilisateur admin: `admin@hotel.com` / `password123`
- ✅ Hotel: Grand Seafoam Hotel
- ✅ 4 types de chambres
- ✅ 8 chambres
- ✅ 3 guests
- ✅ 3 réservations de test

#### 2.3 - Module Restaurant (2 min)

1. **New query**
2. Copiez le contenu de: `database/restaurant-module-fixed.sql`
3. Collez et cliquez **Run**

#### 2.4 - Module Spa (2 min)

1. **New query**
2. Copiez le contenu de: `database/spa-module.sql`
3. Collez et cliquez **Run**

#### 2.5 - Fix Restaurant Room Service (1 min)

1. **New query**
2. Copiez le contenu de: `database/FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql`
3. Collez et cliquez **Run**

#### 2.6 - Photo de profil (1 min)

1. **New query**
2. Copiez le contenu de: `database/add-profile-picture.sql`
3. Collez et cliquez **Run**

---

### ✅ ÉTAPE 3: Tester (2 min)

1. Allez sur: **https://zen-lyart.vercel.app**
2. **Email**: `aubinmaga@gmail.com` ← **VOTRE COMPTE**
3. **Password**: `admin123`
4. Cliquez: **Se connecter**

**✅ Vous devez voir le Dashboard!**

---

## 👤 COMPTE ADMINISTRATEUR

Le script `seed.sql` crée maintenant **VOTRE compte** automatiquement:

- ✅ Email: `aubinmaga@gmail.com`
- ✅ Mot de passe: `admin123`
- ✅ Rôle: Administrateur (accès complet)

**Autres comptes de test créés**:
- `admin@hotel.com` / `admin123` (admin)
- `manager@hotel.com` / `admin123` (manager)
- `reception@hotel.com` / `admin123` (receptionist)

---

## ⚠️ IMPORTANT: VOTRE COMPTE ADMIN

Le script `seed.sql` crée automatiquement **votre compte**:

✅ **Email**: `aubinmaga@gmail.com`  
✅ **Mot de passe**: `admin123`  
✅ **Rôle**: Administrateur

**Utilisez ce compte pour vous connecter!**

Le script crée aussi des comptes de test (`admin@hotel.com`, `manager@hotel.com`, etc.) mais **utilisez votre propre compte** `aubinmaga@gmail.com`.

---

## 📋 SCRIPTS SQL OPTIONNELS (10 MIN)

Ces scripts ajoutent des fonctionnalités supplémentaires:

### Email System
```
database/add-email-system.sql
```

### Password Reset
```
database/add-password-reset-codes.sql
```

### User Settings
```
database/add-user-settings.sql
```

### Maintenance Fields
```
database/add-maintenance-fields.sql
```

### Hotel Info
```
database/add-hotel-info-columns.sql
```

### Multi-Currency
```
database/ADD_MULTI_CURRENCY_SYSTEM.sql
database/ADD_EXCHANGE_RATES_TO_CURRENCIES.sql
```

---

## ✅ VÉRIFICATION RAPIDE

Exécutez cette requête pour voir toutes les tables:

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**Tables attendues**:
- ✅ users
- ✅ hotels
- ✅ rooms
- ✅ room_types
- ✅ guests
- ✅ bookings
- ✅ payments
- ✅ notifications
- ✅ restaurant_orders
- ✅ restaurant_menu_items
- ✅ spa_services
- ✅ spa_reservations

---

## 🔗 LIENS RAPIDES

**Render Backend**: https://dashboard.render.com  
**Supabase Database**: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx  
**Frontend**: https://zen-lyart.vercel.app  
**Backend API**: https://zen-backend-jzjh.onrender.com

---

## 🆘 PROBLÈMES COURANTS

### Login ne fonctionne pas
→ Vérifiez que Render a bien redéployé (voir Logs)  
→ Vérifiez que `seed.sql` s'est exécuté sans erreur  
→ Utilisez `aubinmaga@gmail.com` / `admin123`

### Tables n'existent pas
→ Réexécutez `schema.sql`  
→ Vérifiez les erreurs dans SQL Editor

### Restaurant/Spa ne fonctionne pas
→ Vérifiez que les modules sont créés  
→ Réexécutez les scripts correspondants

---

## 📊 CHECKLIST COMPLÈTE

### Configuration Render
- [ ] DATABASE_URL mise à jour
- [ ] Render redéployé (3-5 min)
- [ ] Backend répond: https://zen-backend-jzjh.onrender.com/api/auth/verify

### Scripts SQL critiques
- [ ] schema.sql (Structure)
- [ ] seed.sql (Données)
- [ ] restaurant-module-fixed.sql
- [ ] spa-module.sql
- [ ] FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql
- [ ] add-profile-picture.sql

### Tests
- [ ] Login fonctionne
- [ ] Dashboard s'affiche
- [ ] Bookings accessible
- [ ] Rooms accessible
- [ ] Restaurant accessible
- [ ] Spa accessible

---

**🎉 Une fois tout fait, votre application ZENITH sera 100% fonctionnelle!**

**Temps total**: 20-30 minutes
