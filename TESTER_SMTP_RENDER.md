# 🧪 Tester SMTP Directement sur Render

## 🎯 OBJECTIF

Tester la connexion SMTP directement depuis le serveur Render pour identifier le problème exact.

---

## 📦 OUTILS AJOUTÉS

J'ai ajouté deux outils de diagnostic:

1. **Logs détaillés** dans `emailService.ts` (commit `2b690c3`)
2. **Script de test** `test-smtp-production.js` (commit `338c463`)

---

## 🚀 OPTION 1: Tester via l'Application (Plus Simple)

### Étape 1: Attendre le redéploiement (2-3 min)

Render va automatiquement redéployer les commits `2b690c3` et `338c463`.

**Vérifier**: Render Dashboard → zen_backend → Deploy status doit montrer "Live"

### Étape 2: Tester l'application

1. Ouvrir: https://zen-lyart.vercel.app/forgot-password
2. Entrer: `aubinmaga@gmail.com`
3. Cliquer: "Envoyer le code"

### Étape 3: Lire les logs détaillés

Render Dashboard → zen_backend → **Logs**

**Chercher ces lignes**:

```
🔐 Password reset requested for: aubinmaga@gmail.com
📧 SMTP Config: {
  host: 'smtp.gmail.com',
  port: '587',
  secure: 'false',
  user: 'basefire671@gmail.com',
  from: 'basefire671@gmail.com',    ← Vérifier que c'est bien basefire671
  fromName: 'ZENITHpms'
}
```

**Puis chercher l'erreur**:

```
❌ Email sending failed - Full error: {
  message: "...",
  code: "...",        ← CODE D'ERREUR IMPORTANT
  response: "..."     ← RÉPONSE DU SERVEUR SMTP
}
```

---

## 🔧 OPTION 2: Tester avec le Script (Avancé)

### Étape 1: Accéder au Shell Render

1. Render Dashboard → zen_backend
2. **Shell** (dans le menu de gauche)
3. Une console s'ouvre

### Étape 2: Exécuter le script de test

```bash
node test-smtp-production.js
```

### Étape 3: Lire les résultats

**Cas 1 - Succès** ✅:
```
🔍 Testing SMTP Configuration...

📧 SMTP Config:
  Host: smtp.gmail.com
  Port: 587
  Secure: false
  User: basefire671@gmail.com
  Pass: ***msjn
  EMAIL_FROM: basefire671@gmail.com
  EMAIL_FROM_NAME: ZENITHpms

🔍 Test 1: Verifying SMTP connection...
✅ SMTP Connection successful!

🔍 Test 2: Sending test email...
✅ Email sent successfully!
  Message ID: <xxx@gmail.com>
  Response: 250 2.0.0 OK

🎉 All SMTP tests passed!
```

**Cas 2 - Erreur de connexion** ❌:
```
❌ SMTP Connection FAILED:
  Error code: EAUTH
  Message: Invalid login: 535-5.7.8 Username and Password not accepted
  
📋 Troubleshooting:
  → Invalid credentials. Check SMTP_USER and SMTP_PASS
  → Make sure 2FA is enabled on Gmail
  → Generate a new App Password if needed
```

**Cas 3 - Variables manquantes** ❌:
```
❌ Missing environment variables: EMAIL_FROM, EMAIL_FROM_NAME

Please set these variables in Render Environment.
```

---

## 🔍 ERREURS COMMUNES ET SOLUTIONS

### Erreur: "Invalid login" (Code: EAUTH)

**Message complet**:
```
535-5.7.8 Username and Password not accepted
```

**Causes possibles**:
1. `SMTP_PASS` incorrect
2. `SMTP_USER` incorrect
3. 2FA pas activé sur Gmail
4. Mot de passe app expiré ou révoqué

**Solution**:
1. Vérifier dans Render Environment:
   - `SMTP_USER = basefire671@gmail.com`
   - `SMTP_PASS = cowniuzdjzeomsjn`
2. Si ça ne marche pas, générer un NOUVEAU mot de passe app:
   - Aller sur: https://myaccount.google.com/apppasswords
   - Révoquer l'ancien
   - Créer un nouveau
   - Mettre à jour `SMTP_PASS` dans Render

---

### Erreur: "Missing credentials" (Code: EAUTH)

**Message complet**:
```
Missing credentials for PLAIN
```

**Cause**: Variables `SMTP_USER` ou `SMTP_PASS` vides ou manquantes

**Solution**:
1. Render Environment → Vérifier que ces variables **existent**:
   - SMTP_USER
   - SMTP_PASS
2. Vérifier qu'elles ne sont **pas vides**
3. Save Changes et redémarrer

---

### Erreur: "Connection timeout" (Code: ETIMEDOUT)

**Message complet**:
```
Connection timeout
```

**Causes possibles**:
1. `SMTP_HOST` incorrect
2. `SMTP_PORT` incorrect
3. Problème réseau temporaire de Render

**Solution**:
1. Vérifier:
   - `SMTP_HOST = smtp.gmail.com` (pas de http:// ou https://)
   - `SMTP_PORT = 587` (nombre, pas de guillemets)
   - `SMTP_SECURE = false` (pas true)
2. Attendre 5 minutes et réessayer
3. Si ça persiste, contacter support Render

---

### Erreur: "Sender address rejected" (Code: 553)

**Message complet**:
```
553 5.1.2 Sender address rejected
```

**Cause**: `EMAIL_FROM` différent de `SMTP_USER`

**Solution**:
1. Vérifier dans Render Environment:
   - `SMTP_USER = basefire671@gmail.com`
   - `EMAIL_FROM = basefire671@gmail.com`
2. Ils doivent être **IDENTIQUES**
3. Save Changes

---

### Erreur: "Daily sending quota exceeded"

**Message complet**:
```
550 5.4.5 Daily sending quota exceeded
```

**Cause**: Plus de 500 emails envoyés aujourd'hui

**Solution**:
1. Attendre 24h
2. Ou utiliser un autre compte Gmail

---

## 📋 CHECKLIST DE DIAGNOSTIC

### Avant de tester:
- [ ] Render a bien redéployé (commits 2b690c3 et 338c463)
- [ ] Service status = "Live"

### Pendant le test:
- [ ] Tester via l'application OU via le script
- [ ] Copier les logs complets

### Analyse des logs:
- [ ] Vérifier que la config SMTP s'affiche
- [ ] Noter le **code d'erreur** exact (EAUTH, ETIMEDOUT, etc.)
- [ ] Noter le **message d'erreur** complet

### Solutions selon l'erreur:
- [ ] EAUTH → Vérifier SMTP_USER et SMTP_PASS
- [ ] ETIMEDOUT → Vérifier SMTP_HOST et SMTP_PORT
- [ ] 553 → Vérifier EMAIL_FROM = SMTP_USER
- [ ] Missing vars → Ajouter les variables manquantes

---

## 🎯 PROCHAINES ÉTAPES

### 1. Attendre le redéploiement (en cours)

Render déploie automatiquement après les commits.

### 2. Tester selon votre préférence:

**Option A (Simple)**:
- Tester sur l'app
- Lire les logs Render

**Option B (Avancé)**:
- Shell Render
- `node test-smtp-production.js`

### 3. M'envoyer l'erreur exacte

Copier tout le bloc:
```
❌ Email sending failed - Full error: { ... }
```

Ou tout le résultat du script de test.

### 4. Je vous donnerai la solution précise

Selon le code d'erreur exact.

---

## 💡 ASTUCE

Si vous ne voyez **aucun log** dans Render après avoir testé:

1. Vérifier que le service a bien redémarré
2. Vérifier l'onglet "Events" pour voir si le deploy a réussi
3. Forcer un redémarrage manuel si nécessaire

---

**Temps estimé**: 5 minutes
**Résultat attendu**: Message d'erreur SMTP précis pour correction ciblée
