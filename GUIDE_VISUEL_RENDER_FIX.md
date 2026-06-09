# 📸 Guide Visuel: Forcer Rebuild Render

## 🎯 OBJECTIF
Forcer Render à recompiler `emailService.ts` qui n'était pas dans le cache

---

## 📝 ÉTAPE 1: Accéder au Dashboard Render

1. **Ouvrir**: https://dashboard.render.com
2. **Se connecter** avec vos identifiants
3. **Trouver le service**: `zen_backend` dans la liste

---

## 🔄 ÉTAPE 2: Forcer le Rebuild SANS Cache

### Actions à faire:

```
┌─────────────────────────────────────────────────┐
│  zen_backend Service                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Manual Deploy ▼]  ← CLIQUER ICI              │
│                                                 │
│  Choisir une des options:                      │
│                                                 │
│  ○ Deploy latest commit                        │
│     ↑ NE PAS choisir celle-ci                  │
│                                                 │
│  ● Clear build cache & deploy                  │
│     ↑ CHOISIR CELLE-CI ✅                      │
│                                                 │
│  [Deploy]  ← Cliquer pour confirmer            │
└─────────────────────────────────────────────────┘
```

### ⚠️ IMPORTANT

- **"Deploy latest commit"** → Utilise le cache → ❌ Problème persiste
- **"Clear build cache & deploy"** → Rebuild complet → ✅ Résout le problème

---

## ⚙️ ÉTAPE 3: Corriger EMAIL_FROM (pendant le build)

Pendant que le build se lance (4-5 minutes), corriger une variable:

1. **Aller dans l'onglet "Environment"**
2. **Chercher**: `EMAIL_FROM`
3. **Valeur actuelle**: `zenith@gmail.com` ❌
4. **Changer en**: `basefire671@gmail.com` ✅
5. **Cliquer "Save Changes"**

### Variables complètes (pour vérification):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=basefire671@gmail.com
SMTP_PASS=cowniuzdjzeomsjn
EMAIL_FROM=basefire671@gmail.com          ← Vérifier ici
EMAIL_FROM_NAME=ZENITHpms
EMAIL_REPLY_TO=basefire671@gmail.com
EMAIL_DEBUG=false
```

---

## 📊 ÉTAPE 4: Vérifier les Logs du Build

Pendant le déploiement, vérifier dans l'onglet **"Logs"**:

### Ce que vous devez voir:

```
==> Building...
#1 [internal] load build definition
#2 [internal] load metadata
#3 [internal] load .dockerignore
...
#11 [builder 6/6] RUN npm run build
#11 0.234 > hotel-pms-server@1.0.0 build
#11 0.234 > tsc
#11 2.567 Building TypeScript files...
#11 5.123 ✓ Compiled successfully
...
==> Build complete
```

### ✅ Signes de succès:

- `npm run build` s'exécute (pas CACHED)
- `tsc` compile tous les fichiers
- Pas d'erreurs TypeScript
- Durée ~4-5 minutes (pas instantané)

---

## 🚀 ÉTAPE 5: Vérifier le Déploiement

Une fois déployé, vérifier dans les **Logs de Runtime**:

### Ce que vous devez voir:

```
> hotel-pms-server@1.0.0 start
> node dist/server.js

🔌 Database config loading...
DATABASE_URL present: true
📝 Environment loaded:
- DATABASE_URL: ✅ Set
- SMTP_USER: ✅ Set
- PORT: 3000
✅ Routes imported successfully
🚀 Server running on port 3000
✅ SMTP Server ready to send emails    ← CETTE LIGNE EST CRITIQUE
⏰ Schedulers started
==> Your service is live 🎉
```

### 🔍 Ligne critique à vérifier:

```
✅ SMTP Server ready to send emails
```

Si cette ligne apparaît → `emailService.ts` est compilé et chargé!

---

## 🧪 ÉTAPE 6: Tester en Production

### Test sur l'application:

1. **Ouvrir**: https://zen-lyart.vercel.app/forgot-password
2. **Entrer**: `aubinmaga@gmail.com` (ou votre email)
3. **Cliquer**: "Envoyer le code"

### ✅ Résultat attendu:

```
Interface:
┌──────────────────────────────────────────┐
│  ✅ Succès!                              │
│  Un code de vérification a été envoyé   │
│  à votre email.                          │
└──────────────────────────────────────────┘

Email reçu:
┌──────────────────────────────────────────┐
│  De: ZENITHpms <basefire671@gmail.com>  │
│  Sujet: 🔐 Code de réinitialisation     │
│                                          │
│  Bonjour Aubin Maga,                    │
│                                          │
│  Votre code de vérification:            │
│                                          │
│      ┌────────┐                         │
│      │ 123456 │                         │
│      └────────┘                         │
│                                          │
│  Expire dans 15 minutes                 │
└──────────────────────────────────────────┘
```

---

## ❌ EN CAS D'ERREUR ENCORE

Si l'erreur 500 persiste:

### 1. Vérifier les logs Render pour l'erreur exacte:

```
POST /api/auth/forgot-password
❌ Email sending failed: [détails de l'erreur]
```

### 2. Causes possibles:

| Erreur | Cause | Solution |
|--------|-------|----------|
| "SMTP Connection Error" | Variables SMTP incorrectes | Vérifier SMTP_USER, SMTP_PASS |
| "Module not found: emailService" | Build incomplet | Refaire "Clear cache & deploy" |
| "Invalid login" | Mauvais mot de passe app | Régénérer mot de passe Gmail |
| "Daily limit exceeded" | Limite Gmail dépassée | Attendre 24h ou nouvel email |

### 3. Commandes de diagnostic:

Dans les logs Render, chercher:

```bash
# Vérifier si emailService existe
ls -la dist/services/emailService.js

# Vérifier les variables
echo $SMTP_USER
echo $EMAIL_FROM
```

---

## 📋 CHECKLIST FINALE

Avant de dire que c'est résolu:

- [ ] Render rebuild terminé (4-5 min)
- [ ] Logs montrent "SMTP Server ready"
- [ ] `EMAIL_FROM=basefire671@gmail.com`
- [ ] Test sur production réussit
- [ ] Email reçu avec code 6 chiffres
- [ ] Code fonctionne dans l'étape 2
- [ ] Reset password fonctionne

---

## 🎯 RÉSUMÉ EN 3 ACTIONS

```
1️⃣  Render → zen_backend → Manual Deploy → Clear build cache & deploy
2️⃣  Environment → EMAIL_FROM → basefire671@gmail.com → Save
3️⃣  Attendre 5 min → Tester sur https://zen-lyart.vercel.app/forgot-password
```

---

**Temps total estimé**: 5-7 minutes
**Difficulté**: ⭐ Facile (juste cliquer sur les bons boutons)
