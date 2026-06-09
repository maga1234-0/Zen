# ⚡ Action 1 Minute - FIX Production

## 🎯 PROBLÈME

Error 500: "Erreur lors de l'envoi de l'email"

## 🔧 CAUSE

Variable Render incorrecte:
```
EMAIL_FROM = zenith@gmail.com    ❌
```

## ✅ SOLUTION

Changer en:
```
EMAIL_FROM = basefire671@gmail.com    ✅
```

---

## 📝 ÉTAPES (1 minute)

### 1. Ouvrir Render
https://dashboard.render.com

### 2. Service zen_backend
Cliquer sur le service

### 3. Onglet Environment
Trouver la variable `EMAIL_FROM`

### 4. Modifier
- Ancienne valeur: `zenith@gmail.com`
- Nouvelle valeur: `basefire671@gmail.com`

### 5. Save Changes
Cliquer sur le bouton en bas

---

## ⏱️ ATTENDRE

**30 secondes** - Render redémarre automatiquement

---

## ✅ VÉRIFIER

Dans les logs Render, chercher:
```
✅ SMTP Server ready to send emails
```

Si cette ligne apparaît → **SUCCÈS!** ✅

---

## 🧪 TESTER

1. https://zen-lyart.vercel.app/forgot-password
2. Entrer votre email
3. Email reçu ✅

---

## 📚 DÉTAILS

Voir: `RESUME_COMPLET_SITUATION.md`

---

**C'est tout!** 🎉
