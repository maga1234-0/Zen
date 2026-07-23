# 👤 VOTRE COMPTE ADMINISTRATEUR

## ✅ COMPTE CRÉÉ

J'ai ajouté votre email dans le système ZENITH PMS.

**Email**: `aubinmaga@gmail.com`  
**Mot de passe**: `admin123`  
**Rôle**: Administrateur (accès complet)  
**Nom**: Aubin Maga

---

## 🎯 COMMENT L'UTILISER

### Option 1: Lors de la configuration initiale (RECOMMANDÉ)

Si vous n'avez pas encore exécuté les scripts SQL:

1. Allez sur: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql
2. **New query**
3. Copiez le contenu de: `database/seed.sql` (**mis à jour**)
4. Collez et cliquez **Run**

Le script `seed.sql` a été **mis à jour** pour inclure votre compte automatiquement.

**Votre compte sera créé en même temps** que les autres utilisateurs de test.

---

### Option 2: Ajouter maintenant (si déjà configuré)

Si vous avez déjà exécuté `seed.sql` sans votre email:

1. Allez sur: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql
2. **New query**
3. Copiez le contenu de: `database/add-admin-aubin.sql`
4. Collez et cliquez **Run**

Ce script:
- ✅ Supprime l'ancien compte si existe
- ✅ Crée votre compte admin
- ✅ Vérifie que tout est OK

---

## 🔐 SE CONNECTER

Une fois le script exécuté:

1. Allez sur: **https://zen-lyart.vercel.app**
2. **Email**: `aubinmaga@gmail.com`
3. **Mot de passe**: `admin123`
4. Cliquez: **Se connecter**

**✅ Vous êtes connecté en tant qu'administrateur!**

---

## 🔒 SÉCURITÉ IMPORTANTE

### 1. Changer le mot de passe immédiatement

Après la première connexion:

1. Cliquez sur votre profil (en haut à droite)
2. **Paramètres** ou **Profil**
3. **Changer le mot de passe**
4. Nouveau mot de passe: Un mot de passe fort (12+ caractères)

### 2. Ne partagez jamais vos identifiants

- ❌ Ne partagez pas `aubinmaga@gmail.com` / `admin123`
- ❌ Ne l'envoyez pas par email/SMS
- ✅ Créez des comptes séparés pour chaque membre du personnel

### 3. Activez l'authentification à deux facteurs (future)

Cette fonctionnalité sera ajoutée dans une future mise à jour.

---

## 👥 AUTRES COMPTES CRÉÉS

Le script `seed.sql` crée aussi ces comptes de test:

### Admin 1 (Vous)
- Email: `aubinmaga@gmail.com`
- Password: `admin123`
- Rôle: admin

### Admin 2 (Test)
- Email: `admin@hotel.com`
- Password: `admin123`
- Rôle: admin

### Manager
- Email: `manager@hotel.com`
- Password: `admin123`
- Rôle: manager

### Réceptionniste
- Email: `reception@hotel.com`
- Password: `admin123`
- Rôle: receptionist

**Note**: Tous utilisent le même mot de passe `admin123` par défaut. **Changez-les tous après la première connexion!**

---

## 🎯 PERMISSIONS ADMINISTRATEUR

En tant qu'admin, vous pouvez:

✅ Gérer toutes les réservations  
✅ Créer/modifier/supprimer des chambres  
✅ Gérer le personnel (ajouter, modifier, supprimer)  
✅ Voir tous les paiements  
✅ Accéder aux rapports complets  
✅ Modifier les paramètres de l'hôtel  
✅ Gérer le restaurant et le spa  
✅ Voir toutes les notifications  
✅ Gérer la maintenance  
✅ Accéder aux logs d'audit  

**En résumé**: Vous avez un accès complet à tout le système.

---

## 📋 PROCHAINES ÉTAPES

### 1. Configurer votre profil
- Ajoutez votre vrai numéro de téléphone
- Uploadez une photo de profil
- Configurez vos préférences

### 2. Configurer l'hôtel
- Allez dans **Settings**
- Modifiez le nom de l'hôtel
- Ajoutez l'adresse complète
- Configurez les informations de contact

### 3. Créer des comptes personnel
- Allez dans **Staff**
- Cliquez sur **Ajouter un membre**
- Créez des comptes pour votre équipe

### 4. Configurer les chambres
- Allez dans **Rooms**
- Vérifiez les types de chambres
- Ajoutez/modifiez les chambres selon votre hôtel

---

## 🔧 FICHIERS MODIFIÉS

J'ai modifié ces fichiers pour inclure votre compte:

### 1. `database/seed.sql` ✅ Mis à jour
- Votre compte est maintenant inclus dans les données initiales
- Créé automatiquement lors de la configuration initiale

### 2. `database/add-admin-aubin.sql` ✅ Créé
- Script séparé pour ajouter votre compte
- À utiliser si vous avez déjà configuré la base

---

## ✅ CHECKLIST

- [ ] Render: DATABASE_URL mise à jour
- [ ] Supabase: `schema.sql` exécuté
- [ ] Supabase: `seed.sql` exécuté (**avec votre compte**)
- [ ] Login: `aubinmaga@gmail.com` / `admin123` fonctionne
- [ ] Dashboard accessible
- [ ] Profil: Mot de passe changé
- [ ] Settings: Informations hôtel configurées

---

## 🆘 PROBLÈMES COURANTS

### Login ne fonctionne pas
→ Vérifiez que `seed.sql` s'est bien exécuté  
→ Vérifiez qu'il n'y a pas d'erreur dans SQL Editor  
→ Utilisez exactement: `aubinmaga@gmail.com` (pas d'espace)

### Mot de passe incorrect
→ Le mot de passe est: `admin123` (tout en minuscules)  
→ Pas d'espace avant ou après

### Compte n'existe pas
→ Exécutez `database/add-admin-aubin.sql` dans SQL Editor  
→ Vérifiez que l'utilisateur a été créé avec:
```sql
SELECT * FROM users WHERE email = 'aubinmaga@gmail.com';
```

---

## 📞 SUPPORT

Si vous avez besoin d'aide:

1. Vérifiez les logs dans SQL Editor
2. Vérifiez que tous les scripts se sont bien exécutés
3. Demandez de l'aide en partageant le message d'erreur exact

---

**🎉 Bienvenue sur ZENITH PMS, Aubin!**

Votre compte administrateur est prêt. Connectez-vous et commencez à gérer votre hôtel! 🏨
