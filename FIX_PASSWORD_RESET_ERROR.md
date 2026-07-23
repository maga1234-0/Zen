# 🔧 FIX: Erreur "password_reset_codes does not exist"

## ❌ ERREUR

```
error: relation "password_reset_codes" does not exist
POST /api/auth/forgot-password 500
```

**Cause**: La table `password_reset_codes` n'a pas été créée dans la base de données.

---

## ✅ SOLUTION (2 MINUTES)

### Exécuter le script SQL

1. **Allez sur**: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql

2. **Cliquez**: New query

3. **Copiez** le contenu du fichier: `database/add-password-reset-codes.sql`

4. **Collez** dans l'éditeur SQL

5. **Cliquez**: Run (ou F5)

6. **Vérifiez**: Le message de succès apparaît

---

## 📋 CE QUE CE SCRIPT FAIT

Le script crée:

### Table password_reset_codes
- Stocke les codes de réinitialisation de mot de passe
- Codes expirés après 1 heure
- Liés à l'email de l'utilisateur

### Colonnes:
- `id` - Identifiant unique
- `email` - Email de l'utilisateur
- `code` - Code de 6 chiffres
- `expires_at` - Date d'expiration
- `used` - Si le code a été utilisé
- `created_at` - Date de création

---

## 🧪 TESTER APRÈS LE FIX

### 1. Page de connexion
1. Allez sur: https://zen-lyart.vercel.app
2. Cliquez: **"Mot de passe oublié ?"**
3. Entrez votre email: `aubinmaga@gmail.com`
4. Cliquez: **"Envoyer"**

**✅ Résultat attendu**: Message de succès (code envoyé par email)

### 2. Vérifier le code dans la base
```sql
-- Dans Supabase SQL Editor
SELECT * FROM password_reset_codes 
WHERE email = 'aubinmaga@gmail.com' 
ORDER BY created_at DESC 
LIMIT 1;
```

Vous devez voir votre code de réinitialisation.

---

## 🔐 FONCTIONNEMENT DU RESET PASSWORD

### Étape 1: Demande de réinitialisation
- Utilisateur entre son email
- Backend génère un code à 6 chiffres
- Code sauvegardé dans `password_reset_codes`
- Email envoyé avec le code (via Resend API)

### Étape 2: Utilisation du code
- Utilisateur entre le code reçu par email
- Utilisateur entre son nouveau mot de passe
- Backend vérifie:
  - Code existe
  - Code n'est pas expiré (< 1 heure)
  - Code n'a pas déjà été utilisé
- Mot de passe mis à jour
- Code marqué comme utilisé

---

## 📧 CONFIGURATION EMAIL (IMPORTANTE)

Pour que les emails de réinitialisation fonctionnent, vous devez avoir:

### Dans Render (Environment Variables):

```
RESEND_API_KEY=re_LLY5HccR_KHEGDVByei1jnfp9K1rhwvaN
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=ZENITH PMS
```

**Ces variables sont déjà dans votre .env local.**  
**Vérifiez qu'elles sont aussi sur Render!**

---

## ⚠️ SCRIPTS SQL À EXÉCUTER

Si vous configurez une nouvelle base, exécutez ces scripts **dans l'ordre**:

1. ✅ `schema.sql` - Structure de base
2. ✅ `seed.sql` - Données initiales
3. ✅ `restaurant-module-fixed.sql` - Restaurant
4. ✅ `spa-module.sql` - Spa
5. 🟡 **`add-password-reset-codes.sql`** ← **CELUI-CI pour l'erreur actuelle**
6. 🟡 `add-email-system.sql` - Système d'emails
7. 🟡 `add-profile-picture.sql` - Photos de profil
8. 🟡 `FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql` - Fix restaurant

---

## 🔍 VÉRIFIER QUE LA TABLE EXISTE

Après avoir exécuté le script, vérifiez:

```sql
-- Liste toutes les tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

Vous devez voir `password_reset_codes` dans la liste.

---

## 🆘 SI L'ERREUR PERSISTE

### 1. Vérifiez que le script s'est bien exécuté
- Pas d'erreur dans SQL Editor
- Message de succès affiché

### 2. Vérifiez que la table existe
```sql
SELECT * FROM password_reset_codes;
```

Si cette requête échoue, la table n'existe pas → Réexécutez le script.

### 3. Redémarrez le backend (Render)
- Dashboard Render → zen-backend-jzjh
- Manual Deploy → Deploy latest commit
- Attendez 3-5 minutes

---

## 📚 FICHIERS LIÉS

**Backend**:
- `zen_backend/src/controllers/authController.ts` - Logique forgot password
- `zen_backend/src/services/emailService.ts` - Envoi d'emails

**Database**:
- `database/add-password-reset-codes.sql` - Création de la table

**Frontend**:
- `client/src/pages/Login.tsx` - Interface forgot password

---

## ✅ CHECKLIST

- [ ] Script `add-password-reset-codes.sql` exécuté
- [ ] Table `password_reset_codes` existe
- [ ] Variables d'environnement email configurées sur Render
- [ ] Test forgot password fonctionne
- [ ] Email reçu avec le code

---

**🚀 Exécutez le script maintenant dans Supabase SQL Editor!**

Temps: 2 minutes
