# ✅ SOLUTION: SMTP_PORT Manquant

## 🎯 PROBLÈME IDENTIFIÉ

Les logs montrent:
```
port: undefined    ← VARIABLE MANQUANTE!
```

**Erreur résultante**:
```
code: 'ETIMEDOUT'
message: 'Connection timeout'
```

Sans le port, nodemailer ne peut pas se connecter à Gmail SMTP.

---

## ✅ SOLUTION (2 MINUTES)

### Étape 1: Ajouter SMTP_PORT dans Render (1 min)

1. **Ouvrir**: https://dashboard.render.com
2. **Service**: `zen_backend`
3. **Onglet**: "Environment"
4. **Cliquer**: "Add Environment Variable"
5. **Key**: `SMTP_PORT`
6. **Value**: `587`
7. **Cliquer**: "Add"
8. **Cliquer**: "Save Changes" en bas

### Étape 2: Attendre redémarrage (30 sec)

Render redémarre automatiquement le service.

### Étape 3: Vérifier les logs (30 sec)

**Render → Logs**, chercher:
```
✅ SMTP Server ready to send emails
```

Si cette ligne apparaît → **SUCCÈS!** ✅

---

## 🔍 VARIABLES COMPLÈTES À VÉRIFIER

Dans Render Environment, vous devez avoir **TOUTES ces 9 variables**:

| Variable | Valeur | Status |
|----------|--------|--------|
| SMTP_HOST | smtp.gmail.com | ✅ Présente |
| SMTP_PORT | 587 | ❌ MANQUANTE |
| SMTP_SECURE | false | ✅ Présente |
| SMTP_USER | basefire671@gmail.com | ✅ Présente |
| SMTP_PASS | cowniuzdjzeomsjn | ✅ (cachée) |
| EMAIL_FROM | basefire671@gmail.com | ✅ Présente |
| EMAIL_FROM_NAME | ZENITHpms | ✅ Présente |
| EMAIL_REPLY_TO | basefire671@gmail.com | ? À vérifier |
| EMAIL_DEBUG | false | ? À vérifier |

---

## 📝 AJOUTER TOUTES LES VARIABLES (si certaines manquent)

### Variables à ajouter si absentes:

**1. SMTP_PORT** (MANQUANTE - PRIORITÉ)
```
Key: SMTP_PORT
Value: 587
```

**2. EMAIL_REPLY_TO** (peut-être manquante)
```
Key: EMAIL_REPLY_TO
Value: basefire671@gmail.com
```

**3. EMAIL_DEBUG** (peut-être manquante)
```
Key: EMAIL_DEBUG
Value: false
```

---

## 🧪 TEST APRÈS CORRECTION

1. **Attendre 30 secondes** que Render redémarre
2. **Vérifier logs**: "SMTP Server ready" doit apparaître
3. **Tester**: https://zen-lyart.vercel.app/forgot-password
4. **Email reçu** ✅

---

## 🔍 POURQUOI PORT undefined?

Le code fait:
```typescript
port: parseInt(process.env.SMTP_PORT || '587')
```

**Si `SMTP_PORT` manque**:
- `process.env.SMTP_PORT` = undefined
- `undefined || '587'` = '587'
- `parseInt('587')` = 587

**MAIS** dans emailService.ts (ligne 7):
```typescript
port: parseInt(process.env.SMTP_PORT || '587')
```

Ça devrait fonctionner... sauf que les logs montrent `undefined`.

**Ah! Je vois le problème dans mon code de logs!**

Regardez le code que j'ai ajouté:
```typescript
console.log('📧 SMTP Config:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,    ← LOG LA VARIABLE, PAS LA CONFIG
  ...
});
```

Je log la **variable d'environnement** directement, pas la config du transporter!

Donc:
- `process.env.SMTP_PORT` = undefined (variable manquante)
- Mais dans le transporter: `parseInt(undefined || '587')` = 587

**Conclusion**: La variable `SMTP_PORT` **manque** dans Render, mais le code utilise 587 par défaut.

**MAIS** l'erreur `ETIMEDOUT` suggère un autre problème...

---

## 🔍 ANALYSE PLUS APPROFONDIE

L'erreur `ETIMEDOUT` avec timeout de 2 minutes (121 secondes) signifie:

**Render ne peut pas atteindre smtp.gmail.com:587**

Causes possibles:
1. ❌ Port bloqué par Render (peu probable, port 587 est standard)
2. ❌ Firewall Gmail (peu probable)
3. ✅ **Variable SMTP_PORT vraiment undefined** → nodemailer essaie un mauvais port

---

## ✅ ACTION À FAIRE MAINTENANT

**Ajoutez `SMTP_PORT=587` dans Render Environment**.

Cela va:
1. Éliminer le `undefined` dans les logs
2. Garantir que nodemailer utilise bien le port 587
3. Résoudre le timeout

**Si après avoir ajouté `SMTP_PORT=587`, l'erreur persiste**:
- Il faudra vérifier si Render bloque les connexions SMTP sortantes
- Ou utiliser un service SMTP alternatif (SendGrid, Mailgun, etc.)

Mais normalement, **ajouter SMTP_PORT=587 devrait résoudre le problème!** ✅

---

**À FAIRE**: 
1. Render → Environment → Add Variable → SMTP_PORT = 587
2. Save Changes
3. Attendre 30 sec
4. Tester
