# ⚡ CONFIGURATION RAPIDE RENDER - Variables SMTP

## 🎯 PROBLÈME
Le backend sur Render ne peut pas envoyer d'emails car les variables SMTP manquent.

---

## 📋 ÉTAPES (5 minutes max)

### 1️⃣ Ouvrir Render Dashboard
👉 https://dashboard.render.com

### 2️⃣ Sélectionner le service backend
- Cliquez sur **`zen_backend`** dans la liste
- Ou cliquez sur: **`zen-backend-jzjh`**

### 3️⃣ Aller dans Environment
- Dans le menu de gauche, cliquez sur **`Environment`**
- Vous verrez les variables actuelles (DATABASE_URL, JWT_SECRET, etc.)

### 4️⃣ Ajouter les 9 variables SMTP

Cliquez sur **`Add Environment Variable`** pour chaque ligne:

#### Variable 1
```
Key: SMTP_HOST
Value: smtp.gmail.com
```

#### Variable 2
```
Key: SMTP_PORT
Value: 587
```

#### Variable 3
```
Key: SMTP_SECURE
Value: false
```

#### Variable 4
```
Key: SMTP_USER
Value: basefire671@gmail.com
```

#### Variable 5
```
Key: SMTP_PASS
Value: cowniuzdjzeomsjn
```

#### Variable 6
```
Key: EMAIL_FROM
Value: zenith@gmail.com
```

#### Variable 7
```
Key: EMAIL_FROM_NAME
Value: ZENITHpms
```

#### Variable 8
```
Key: EMAIL_REPLY_TO
Value: basefire671@gmail.com
```

#### Variable 9
```
Key: EMAIL_DEBUG
Value: false
```

### 5️⃣ Sauvegarder
- Cliquez sur **`Save Changes`** en bas de la page
- Render va automatiquement redémarrer le service
- **Attendez 2-3 minutes**

---

## ✅ VÉRIFICATION

### Test 1: Vérifier les logs
1. Dans Render, cliquez sur **`Logs`** (menu gauche)
2. Attendez le redémarrage
3. Cherchez: `✅ SMTP Server ready to send emails`

### Test 2: Tester l'envoi d'email
1. Allez sur: https://zen-lyart.vercel.app/forgot-password
2. Entrez: `aubinmaga@gmail.com`
3. Cliquez sur **"Envoyer le code"**
4. Vérifiez votre boîte mail! 📧

---

## 🔍 CAPTURE D'ÉCRAN DU RÉSULTAT ATTENDU

Sur Render → Environment, vous devriez voir:

```
✓ DATABASE_URL         (déjà présent)
✓ JWT_SECRET           (déjà présent)
✓ CORS_ORIGIN          (déjà présent)
✓ GEMINI_API_KEY       (déjà présent)
✓ SMTP_HOST            ← NOUVEAU
✓ SMTP_PORT            ← NOUVEAU
✓ SMTP_SECURE          ← NOUVEAU
✓ SMTP_USER            ← NOUVEAU
✓ SMTP_PASS            ← NOUVEAU (caché avec ••••)
✓ EMAIL_FROM           ← NOUVEAU
✓ EMAIL_FROM_NAME      ← NOUVEAU
✓ EMAIL_REPLY_TO       ← NOUVEAU
✓ EMAIL_DEBUG          ← NOUVEAU
```

---

## ⚠️ NOTES IMPORTANTES

- ❌ **N'ajoutez PAS** de guillemets autour des valeurs
- ❌ **N'ajoutez PAS** d'espaces avant/après les valeurs
- ✅ **Copiez-collez** exactement comme indiqué ci-dessus
- 🔒 Le `SMTP_PASS` sera automatiquement masqué par Render

---

## 🆘 EN CAS DE PROBLÈME

Si ça ne fonctionne toujours pas après 5 minutes:

1. **Vérifiez les logs Render** pour voir l'erreur exacte
2. **Vérifiez que toutes les 9 variables sont présentes**
3. **Redémarrez manuellement**: Cliquez sur `Manual Deploy` → `Clear build cache & deploy`

---

## 🎉 C'EST TOUT!

Une fois configuré, le système fonctionne automatiquement pour:
- ✉️ Réinitialisation de mot de passe
- 📧 Emails de confirmation (futurs)
- 🔔 Notifications par email (futurs)

**Limite Gmail**: 500 emails/jour maximum
