# 📋 Variables Render - Copier-Coller

## 🎯 ACTION SIMPLE

Aller dans **Render Dashboard** → Service `zen_backend` → Onglet **"Environment"**

Vérifier que **ces 9 variables** existent avec les bonnes valeurs:

---

## 📝 VARIABLES À COPIER-COLLER

### 1. SMTP_HOST
```
smtp.gmail.com
```

### 2. SMTP_PORT
```
587
```

### 3. SMTP_SECURE
```
false
```

### 4. SMTP_USER
```
basefire671@gmail.com
```

### 5. SMTP_PASS
```
cowniuzdjzeomsjn
```

### 6. EMAIL_FROM
```
basefire671@gmail.com
```
⚠️ **ATTENTION**: Si vous voyez `zenith@gmail.com`, changez en `basefire671@gmail.com`

### 7. EMAIL_FROM_NAME
```
ZENITHpms
```

### 8. EMAIL_REPLY_TO
```
basefire671@gmail.com
```

### 9. EMAIL_DEBUG
```
false
```

---

## ✅ VÉRIFICATION VISUELLE

Dans l'interface Render Environment, vous devriez voir:

```
┌────────────────────────────────────────────────┐
│ Environment Variables                          │
├────────────────────────────────────────────────┤
│                                                │
│ SMTP_HOST         = smtp.gmail.com            │
│ SMTP_PORT         = 587                       │
│ SMTP_SECURE       = false                     │
│ SMTP_USER         = basefire671@gmail.com     │
│ SMTP_PASS         = •••••••••••••••••         │
│ EMAIL_FROM        = basefire671@gmail.com     │ ← Vérifier ici
│ EMAIL_FROM_NAME   = ZENITHpms                 │
│ EMAIL_REPLY_TO    = basefire671@gmail.com     │
│ EMAIL_DEBUG       = false                     │
│                                                │
│ [Save Changes]                                │
└────────────────────────────────────────────────┘
```

---

## 🚨 ERREUR COMMUNE

### ❌ AVANT (Incorrect):
```
EMAIL_FROM = zenith@gmail.com
```

### ✅ APRÈS (Correct):
```
EMAIL_FROM = basefire671@gmail.com
```

**Pourquoi?** L'email émetteur doit être le même que SMTP_USER pour l'authentification Gmail.

---

## 💡 COMMENT AJOUTER/MODIFIER UNE VARIABLE

1. **Si la variable existe**:
   - Cliquer sur le **crayon** ✏️ à droite de la ligne
   - Modifier la valeur
   - Cliquer **Check** ✓

2. **Si la variable n'existe pas**:
   - Cliquer sur **"Add Environment Variable"**
   - Key: Le nom (ex: `EMAIL_FROM`)
   - Value: La valeur (ex: `basefire671@gmail.com`)
   - Cliquer **"Add"**

3. **Après toute modification**:
   - Cliquer sur **"Save Changes"** en bas
   - Render redémarrera automatiquement le service

---

## 📋 CHECKLIST DE VÉRIFICATION

Cocher chaque variable vérifiée:

- [ ] SMTP_HOST = smtp.gmail.com
- [ ] SMTP_PORT = 587
- [ ] SMTP_SECURE = false
- [ ] SMTP_USER = basefire671@gmail.com
- [ ] SMTP_PASS = cowniuzdjzeomsjn
- [ ] EMAIL_FROM = basefire671@gmail.com (PAS zenith@gmail.com)
- [ ] EMAIL_FROM_NAME = ZENITHpms
- [ ] EMAIL_REPLY_TO = basefire671@gmail.com
- [ ] EMAIL_DEBUG = false
- [ ] Cliqué sur "Save Changes"

---

## ⏱️ APRÈS SAVE CHANGES

Render va automatiquement:
1. Redémarrer le service (1-2 min)
2. Charger les nouvelles variables
3. Reconnecter SMTP

**Attendre 2-3 minutes** puis vérifier les logs.

---

## 🔍 LOGS À VÉRIFIER APRÈS

Dans l'onglet **"Logs"** de Render, chercher:

```
✅ SMTP Server ready to send emails
```

Si cette ligne apparaît → **Configuration correcte!** ✅

---

**Temps nécessaire**: 2 minutes
**Difficulté**: ⭐ Très facile (copier-coller)
