# 🚀 Guide de Déploiement - Mot de Passe Oublié

## ✅ Récapitulatif - Ce qui est prêt

### Backend (zen_backend)
- ✅ Service email créé (`emailService.ts`)
- ✅ 3 endpoints ajoutés (`authController.ts`)
- ✅ Routes configurées (`authRoutes.ts`)
- ✅ npm packages installés (nodemailer, handlebars)

### Frontend (client)
- ✅ Page ForgotPassword créée
- ✅ Lien ajouté sur Login
- ✅ Route configurée dans App.tsx

### Database
- ✅ Table `password_reset_codes` créée
- ✅ Tables email système créées

---

## 🚀 ÉTAPE 1: Déployer le Backend

### 1.1 Naviguer vers zen_backend
```bash
cd c:\Users\aubin\Downloads\kiro1\zen_backend
```

### 1.2 Vérifier les fichiers modifiés
```bash
git status
```

Vous devriez voir:
```
Modified:   src/controllers/authController.ts
Modified:   src/routes/authRoutes.ts
Untracked:  src/services/emailService.ts
```

### 1.3 Ajouter tous les fichiers
```bash
git add .
```

### 1.4 Créer le commit
```bash
git commit -m "feat: Add password reset functionality with email verification

- Add emailService.ts with SMTP Gmail integration
- Add sendPasswordResetCode() function with styled HTML template
- Add 3 new endpoints: forgot-password, verify-reset-code, reset-password
- Generate 6-digit verification codes with 15-minute expiration
- Log all emails to email_logs table
- Implement security: single-use codes, bcrypt hashing
"
```

### 1.5 Push vers GitHub
```bash
git push origin main
```

### 1.6 Vérifier le déploiement Render
1. Aller sur https://dashboard.render.com
2. Sélectionner votre service backend
3. Vérifier que le déploiement démarre automatiquement
4. Attendre **3-5 minutes**
5. Vérifier les logs pour "Deploy successful"

---

## 🚀 ÉTAPE 2: Déployer le Frontend

### 2.1 Naviguer vers le dossier racine
```bash
cd c:\Users\aubin\Downloads\kiro1
```

### 2.2 Vérifier les fichiers modifiés
```bash
git status
```

Vous devriez voir:
```
Modified:   client/src/pages/Login.tsx
Modified:   client/src/App.tsx
Untracked:  client/src/pages/ForgotPassword.tsx
```

### 2.3 Ajouter tous les fichiers
```bash
git add .
```

### 2.4 Créer le commit
```bash
git commit -m "feat: Add forgot password page with 3-step wizard

- Create ForgotPassword.tsx with modern design
- Implement 3-step workflow: email → code → password
- Add animated stepper with Framer Motion
- Add 'Forgot password?' link on Login page
- Add /forgot-password route in App.tsx
- Responsive design for mobile and desktop
"
```

### 2.5 Push vers GitHub
```bash
git push origin main
```

### 2.6 Vérifier le déploiement Vercel
1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet frontend
3. Vérifier que le déploiement démarre automatiquement
4. Attendre **2-3 minutes**
5. Vérifier que le build réussit

---

## 🔧 ÉTAPE 3: Configurer les Variables d'Environnement (Render)

### 3.1 Aller sur Render Dashboard
https://dashboard.render.com

### 3.2 Sélectionner votre service backend

### 3.3 Aller dans "Environment"

### 3.4 Ajouter/Vérifier ces variables:

```env
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = valcker.basefire671@gmail.com
SMTP_PASS = kvobylxtrwlwelbh
EMAIL_FROM = noreply@hotelseafoam.com
EMAIL_FROM_NAME = Grand Hôtel Seafoam
EMAIL_REPLY_TO = contact@hotelseafoam.com
EMAIL_DEBUG = true
```

### 3.5 Cliquer "Save Changes"

⚠️ **Important:** Le service va redémarrer automatiquement (1-2 minutes)

---

## ✅ ÉTAPE 4: Tester en Production

### 4.1 Test Frontend
1. Aller sur: **https://zen-lyart.vercel.app/login**
2. Cliquer sur "Mot de passe oublié?"
3. Vérifier que la page `/forgot-password` s'ouvre

### 4.2 Test Email (Étape 1)
1. Entrer un email valide: `admin@hotel.com`
2. Cliquer "Envoyer le code"
3. Vérifier le message de succès
4. **Vérifier votre boîte email `valcker.basefire671@gmail.com`**
5. Vous devriez recevoir un email avec le code en **~5 secondes**

### 4.3 Test Code (Étape 2)
1. Copier le code à 6 chiffres de l'email
2. Le coller dans le formulaire
3. Cliquer "Vérifier le code"
4. Vérifier que ça passe à l'étape 3

### 4.4 Test Reset Password (Étape 3)
1. Entrer un nouveau mot de passe (min 6 caractères)
2. Confirmer le mot de passe
3. Cliquer "Réinitialiser le mot de passe"
4. Vérifier la redirection vers `/login`
5. **Se connecter avec le nouveau mot de passe**

---

## 🔍 Vérifications Database

### Vérifier les codes générés
```sql
SELECT * FROM password_reset_codes 
ORDER BY created_at DESC 
LIMIT 5;
```

### Vérifier les emails envoyés
```sql
SELECT * FROM email_logs 
WHERE type = 'password_reset' 
ORDER BY created_at DESC 
LIMIT 5;
```

### Statistiques
```sql
SELECT 
  status,
  COUNT(*) as total
FROM email_logs
WHERE type = 'password_reset'
GROUP BY status;
```

---

## 🐛 Dépannage

### Problème: Email non reçu

**Vérifier les logs Render:**
1. Dashboard → Your Service → Logs
2. Chercher: `📧 Sending email`
3. Chercher: `✅ Email sent` ou `❌ Email sending failed`

**Solutions:**
- Vérifier que `SMTP_USER` et `SMTP_PASS` sont corrects
- Vérifier que Gmail 2FA est activé
- Vérifier le mot de passe d'application Gmail
- Vérifier les limites Gmail (500/jour)

### Problème: Code invalide

**Vérifier dans Supabase:**
```sql
SELECT * FROM password_reset_codes 
WHERE email = 'admin@hotel.com' 
ORDER BY created_at DESC;
```

**Vérifier:**
- Code copié correctement (6 chiffres)
- Code non expiré (< 15 minutes)
- Code non déjà utilisé (`used_at` NULL)

### Problème: Frontend ne charge pas

**Vérifier Vercel:**
1. Dashboard → Deployments
2. Vérifier le dernier déploiement
3. Cliquer "View Function Logs"

**Solutions:**
- Vérifier qu'il n'y a pas d'erreurs de build
- Vérifier que `ForgotPassword.tsx` est bien importé
- Clear cache navigateur (Ctrl+Shift+R)

---

## 📊 Tests API Directs (Optionnel)

### Test 1: Request Code
```bash
curl -X POST https://zen-backend-jzjh.onrender.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@hotel.com\"}"
```

**Réponse attendue:**
```json
{
  "message": "Un code de vérification a été envoyé à votre email.",
  "success": true
}
```

### Test 2: Verify Code
```bash
curl -X POST https://zen-backend-jzjh.onrender.com/api/auth/verify-reset-code \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@hotel.com\",\"code\":\"123456\"}"
```

**Réponse attendue:**
```json
{
  "message": "Code valide",
  "valid": true,
  "userId": "some-uuid"
}
```

### Test 3: Reset Password
```bash
curl -X POST https://zen-backend-jzjh.onrender.com/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@hotel.com\",\"code\":\"123456\",\"newPassword\":\"newpass123\"}"
```

**Réponse attendue:**
```json
{
  "message": "Mot de passe réinitialisé avec succès",
  "success": true
}
```

---

## ✅ Checklist Finale

### Déploiement Backend
- [ ] Code commité
- [ ] Push vers GitHub
- [ ] Déploiement Render réussi
- [ ] Variables d'environnement configurées
- [ ] Service redémarré

### Déploiement Frontend
- [ ] Code commité
- [ ] Push vers GitHub
- [ ] Déploiement Vercel réussi
- [ ] Page accessible en production

### Tests Production
- [ ] Page `/forgot-password` accessible
- [ ] Email reçu avec code
- [ ] Code vérifié avec succès
- [ ] Mot de passe changé
- [ ] Connexion avec nouveau mot de passe

### Database
- [ ] Codes enregistrés dans `password_reset_codes`
- [ ] Emails loggés dans `email_logs`
- [ ] Codes marqués `used_at` après utilisation

---

## 🎉 SUCCÈS!

Si tous les tests passent, la fonctionnalité est **100% DÉPLOYÉE ET FONCTIONNELLE**!

**URLs Production:**
- Frontend: https://zen-lyart.vercel.app/forgot-password
- Backend API: https://zen-backend-jzjh.onrender.com/api/auth/*

**Prochaines étapes recommandées:**
1. Tester avec différents comptes
2. Tester l'expiration des codes (attendre 15 min)
3. Tester avec code invalide
4. Tester avec code déjà utilisé
5. Monitorer les logs pendant 24h

---

## 📞 Support

**En cas de problème:**
1. Vérifier les logs Render
2. Vérifier les logs Vercel
3. Vérifier la console navigateur (F12)
4. Vérifier la base de données Supabase

**Temps total de déploiement: ~10 minutes** ⏱️

---

**Date:** 9 juin 2026  
**Version:** 1.0.0  
**Status:** ✅ Prêt à déployer

