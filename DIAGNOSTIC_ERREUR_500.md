# 🔍 Diagnostic Erreur 500 - Mot de Passe Oublié

## ❌ ERREUR ACTUELLE

```javascript
API Error: 500
{
  message: "Erreur lors de l'envoi de l'email",
  success: false
}
```

---

## 📊 ANALYSE DES LOGS RENDER

### ✅ Ce qui fonctionne:

```
✅ Database config loading...
✅ DATABASE_URL present: true
✅ SMTP_USER: ✅ Set
✅ Routes imported successfully
✅ Server running on port 3000
✅ Build TypeScript réussi (3.4s)
```

### ❌ Ce qui manque:

```
❌ "✅ SMTP Server ready to send emails"    ← LIGNE MANQUANTE
```

---

## 🔍 CAUSE RACINE

### Problème identifié:

Le fichier `emailService.ts` contient cette vérification SMTP (ligne 19):

```typescript
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server ready to send emails');
  }
});
```

**Si cette ligne n'apparaît PAS dans les logs** → 2 possibilités:

1. **emailService pas importé** ✅ CORRIGÉ (commit ac4365b)
2. **Variables SMTP incorrectes** ← PROBLÈME ACTUEL

---

## 🔧 POURQUOI LES VARIABLES SONT LE PROBLÈME

Gmail SMTP requiert que `EMAIL_FROM` corresponde à `SMTP_USER`:

### ❌ Configuration actuelle (probablement):
```
SMTP_USER = basefire671@gmail.com
EMAIL_FROM = zenith@gmail.com          ← DIFFÉRENT
```

### ✅ Configuration requise:
```
SMTP_USER = basefire671@gmail.com
EMAIL_FROM = basefire671@gmail.com     ← IDENTIQUE
```

**Résultat actuel**: 
- `transporter.verify()` échoue silencieusement
- Pas de log "SMTP Server ready"
- Quand on demande le code → Erreur 500

---

## 🎯 SOLUTION CONFIRMÉE

### Étape 1: Vérifier les 9 variables Render

Toutes ces variables doivent exister:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=basefire671@gmail.com
SMTP_PASS=cowniuzdjzeomsjn
EMAIL_FROM=basefire671@gmail.com          ← CRITIQUE
EMAIL_FROM_NAME=ZENITHpms
EMAIL_REPLY_TO=basefire671@gmail.com
EMAIL_DEBUG=false
```

### Étape 2: Vérifier après redémarrage

Logs Render doivent montrer:

```
✅ SMTP Server ready to send emails
```

---

## 🧪 TESTS DE VALIDATION

### Test 1: Vérification SMTP au démarrage

**Logs attendus**:
```
🔌 Database config loading...
DATABASE_URL present: true
📝 Environment loaded:
- DATABASE_URL: ✅ Set
- SMTP_USER: ✅ Set
- PORT: 3000
✅ SMTP Server ready to send emails    ← DOIT APPARAÎTRE
✅ Routes imported successfully
🚀 Server running on port 3000
```

**Si "SMTP Server ready" n'apparaît pas** → Variables incorrectes

### Test 2: Appel API forgot-password

**Request**:
```http
POST https://zen-backend-jzjh.onrender.com/api/auth/forgot-password
Content-Type: application/json

{
  "email": "aubinmaga@gmail.com"
}
```

**Response attendue**:
```json
{
  "message": "Un code de vérification a été envoyé à votre email.",
  "success": true
}
```

**Si erreur 500** → emailService échoue à envoyer

### Test 3: Logs backend pendant l'appel

**Logs attendus**:
```
🔐 Password reset requested for: aubinmaga@gmail.com
✅ Email sent: <message-id>
✅ Reset code sent to: aubinmaga@gmail.com
```

**Si erreur** → Voir le message d'erreur exact

---

## 🔍 DIAGNOSTIC DÉTAILLÉ PAR SCÉNARIO

### Scénario A: "SMTP Server ready" n'apparaît jamais

**Cause**: Variables SMTP incorrectes ou manquantes

**Solution**:
1. Vérifier **toutes les 9 variables** dans Render Environment
2. Copier-coller exactement depuis `VARIABLES_RENDER_COPIER_COLLER.md`
3. Save Changes
4. Attendre redémarrage (2 min)
5. Vérifier logs

### Scénario B: "SMTP Server ready" apparaît mais erreur 500 persiste

**Cause**: Problème d'authentification Gmail lors de l'envoi

**Solution**:
1. Vérifier que `SMTP_PASS` est correct: `cowniuzdjzeomsjn`
2. Vérifier que le compte Gmail n'a pas désactivé l'accès app
3. Tester avec un autre email si nécessaire

### Scénario C: Pas d'erreur mais email non reçu

**Cause**: Email envoyé mais bloqué par spam ou limite Gmail

**Solution**:
1. Vérifier dossier Spam
2. Vérifier que < 500 emails/jour envoyés
3. Attendre 2-3 minutes (délai SMTP)

---

## 📋 CHECKLIST DE DIAGNOSTIC

Suivre dans l'ordre:

### 1. Vérifier le build
- [ ] Build Render réussi (pas d'erreur TypeScript)
- [ ] Commit `ac4365b` déployé
- [ ] Service status: LIVE

### 2. Vérifier les variables
- [ ] Les 9 variables SMTP existent dans Environment
- [ ] `EMAIL_FROM = basefire671@gmail.com` (pas zenith)
- [ ] `SMTP_PASS = cowniuzdjzeomsjn` (16 caractères)
- [ ] Save Changes effectué

### 3. Vérifier les logs au démarrage
- [ ] "SMTP_USER: ✅ Set" visible
- [ ] "✅ SMTP Server ready to send emails" visible
- [ ] Pas d'erreur "SMTP Connection Error"

### 4. Tester l'API
- [ ] Appel à /api/auth/forgot-password
- [ ] Response 200 (pas 500)
- [ ] Message success
- [ ] Email reçu

### 5. Si échec, logs détaillés
- [ ] Copier les logs complets de Render
- [ ] Copier l'erreur du navigateur (F12 Console)
- [ ] Vérifier l'erreur exacte dans les logs backend

---

## 🎯 PROCHAINE ÉTAPE SELON LE DIAGNOSTIC

### Si "SMTP Server ready" manque:
→ Ouvrir `VARIABLES_RENDER_COPIER_COLLER.md`

### Si erreur 500 persiste:
→ Copier les logs et me les envoyer

### Si tout fonctionne:
→ Tester le cycle complet (code → reset password)

---

## 💡 INFORMATIONS TECHNIQUES

### Pourquoi Gmail SMTP est strict:

Gmail requiert:
- Authentification 2FA activée ✅ (depuis 11 mai)
- Mot de passe application généré ✅ (`cowniuzdjzeomsjn`)
- Email émetteur = Email authentifié ✅ (basefire671@gmail.com)
- Port 587 avec STARTTLS ✅
- Limite 500 emails/jour ✅

### Flux d'envoi email:

```
1. Application démarre
   ↓
2. Import emailService.ts
   ↓
3. Créer transporter nodemailer
   ↓
4. Vérifier connexion SMTP (transporter.verify)
   ↓
5. Log "SMTP Server ready" si OK
   ↓
6. Quand API called:
   - forgotPassword() vérifie email existe
   - Génère code 6 chiffres
   - sendPasswordResetCode(email, code)
   - transporter.sendMail() → Gmail SMTP
   ↓
7. Email envoyé ✅
```

**Si échec à l'étape 4** → Pas de "SMTP Server ready" dans logs
**Si échec à l'étape 6** → Erreur 500 avec message d'erreur spécifique

---

**Créé pour**: Diagnostiquer erreur 500 persistante
**Prochaine action**: Vérifier variables Render (voir FAIRE_MAINTENANT.md)
