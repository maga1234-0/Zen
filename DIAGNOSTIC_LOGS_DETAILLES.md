# 🔍 Diagnostic avec Logs Détaillés

## ✅ CODE MODIFIÉ ET POUSSÉ

Commit `2b690c3` ajouté avec logs détaillés pour identifier l'erreur exacte.

---

## 🎯 NOUVELLES INFORMATIONS DANS LES LOGS

Après le redéploiement Render (2-3 min), les logs vont maintenant afficher:

### 1. Configuration SMTP au démarrage:
```
📧 SMTP Config: {
  host: 'smtp.gmail.com',
  port: '587',
  secure: 'false',
  user: 'basefire671@gmail.com',
  from: 'basefire671@gmail.com',
  fromName: 'ZENITHpms'
}
```

### 2. Erreur détaillée si échec:
```
❌ Email sending failed - Full error: {
  message: '...',
  code: '...',
  command: '...',
  response: '...',
  responseCode: '...'
}
```

---

## 🧪 ÉTAPES DE TEST

### Étape 1: Attendre le redéploiement (2-3 min)

Render détecte automatiquement le nouveau commit et redéploie.

**Vérifier**: Render Dashboard → zen_backend → Deploy status

### Étape 2: Tester l'API

1. Ouvrir: https://zen-lyart.vercel.app/forgot-password
2. Entrer: `aubinmaga@gmail.com`
3. Cliquer: "Envoyer le code"

### Étape 3: Lire les logs Render

Aller dans: Render Dashboard → zen_backend → **Logs**

**Chercher ces lignes:**

```
🔐 Password reset requested for: aubinmaga@gmail.com
📧 SMTP Config: { ... }
❌ Email sending failed - Full error: { ... }
```

---

## 🔍 ERREURS SMTP COMMUNES

### Erreur 1: "Invalid login"
```json
{
  "code": "EAUTH",
  "response": "535-5.7.8 Username and Password not accepted"
}
```

**Cause**: Mot de passe application incorrect

**Solution**: 
- Régénérer un nouveau mot de passe app Gmail
- Mettre à jour `SMTP_PASS` dans Render

### Erreur 2: "Missing credentials"
```json
{
  "code": "EAUTH", 
  "message": "Missing credentials for PLAIN"
}
```

**Cause**: `SMTP_USER` ou `SMTP_PASS` vide/manquant

**Solution**: Vérifier que les variables existent dans Render Environment

### Erreur 3: "Greeting never received"
```json
{
  "code": "ETIMEDOUT",
  "message": "Greeting never received"
}
```

**Cause**: Port ou host incorrect

**Solution**: 
- `SMTP_HOST = smtp.gmail.com`
- `SMTP_PORT = 587`

### Erreur 4: "Connection timeout"
```json
{
  "code": "ESOCKET",
  "message": "Connection timeout"
}
```

**Cause**: Render ne peut pas atteindre Gmail SMTP

**Solution**: Attendre quelques minutes et réessayer

### Erreur 5: "Sender address rejected"
```json
{
  "code": "EMESSAGE",
  "response": "553 5.1.2 Sender address rejected"
}
```

**Cause**: `EMAIL_FROM` ne correspond pas à `SMTP_USER`

**Solution**: 
- `EMAIL_FROM = basefire671@gmail.com`
- Doit être identique à `SMTP_USER`

---

## 📋 CHECKLIST DE VÉRIFICATION

Une fois les logs détaillés visibles:

### Si l'erreur est "Invalid login" (EAUTH):
- [ ] Vérifier `SMTP_USER = basefire671@gmail.com`
- [ ] Vérifier `SMTP_PASS = cowniuzdjzeomsjn`
- [ ] Vérifier que le compte Gmail a 2FA activé
- [ ] Si nécessaire, régénérer le mot de passe app

### Si l'erreur est "Missing credentials":
- [ ] Vérifier que `SMTP_USER` existe dans Render
- [ ] Vérifier que `SMTP_PASS` existe dans Render
- [ ] Vérifier qu'ils ne sont pas vides

### Si l'erreur est "Timeout" ou "Connection":
- [ ] Vérifier `SMTP_HOST = smtp.gmail.com`
- [ ] Vérifier `SMTP_PORT = 587`
- [ ] Vérifier `SMTP_SECURE = false`
- [ ] Attendre 5 minutes et réessayer

### Si l'erreur est "Sender rejected":
- [ ] Vérifier `EMAIL_FROM = basefire671@gmail.com`
- [ ] Vérifier qu'il est identique à `SMTP_USER`

---

## 🎯 APRÈS AVOIR LES LOGS

**Copiez l'erreur complète** qui apparaît dans les logs:

```
❌ Email sending failed - Full error: {
  message: "...",
  code: "...",
  ...
}
```

Et envoyez-la moi pour que je puisse vous donner la solution précise.

---

## 💡 VALEURS CORRECTES À VÉRIFIER

Dans Render Environment, ces variables doivent avoir exactement ces valeurs:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=basefire671@gmail.com
SMTP_PASS=cowniuzdjzeomsjn
EMAIL_FROM=basefire671@gmail.com
EMAIL_FROM_NAME=ZENITHpms
EMAIL_REPLY_TO=basefire671@gmail.com
EMAIL_DEBUG=false
```

**Aucun espace avant ou après les valeurs!**

---

## 🚀 PROCHAINE ÉTAPE

1. **Attendre 2-3 minutes** que Render redéploie
2. **Tester** sur l'application
3. **Lire les logs** Render
4. **Copier l'erreur exacte** 
5. Me la transmettre pour solution précise

---

**Temps estimé**: 5 minutes
**But**: Identifier l'erreur SMTP exacte pour la corriger
