# 🚀 FAIRE MAINTENANT - 2 MINUTES

---

## 🎯 ÉTAPE 1: Vérifier le déploiement Render

### Aller sur:
```
https://dashboard.render.com
```

### Cliquer sur:
```
zen_backend
```

### Vérifier en haut:
```
Status: Live ✅
```

**Si "Deploying"** → Attendre 2-3 minutes

---

## 🎯 ÉTAPE 2: Ajouter RESEND_API_KEY

### Dans zen_backend → Onglet "Environment"

### Cliquer:
```
"Add Environment Variable"
```

### Entrer EXACTEMENT:

**Key:**
```
RESEND_API_KEY
```

**Value:**
```
re_LLY5HccR_KHEGDVByei1jnfp9K1rhwvaN
```

### ⚠️ NE PAS CLIQUER "Save Changes" ENCORE!

---

## 🎯 ÉTAPE 3: Modifier EMAIL_FROM

### Dans la même page "Environment"

### Trouver la variable:
```
EMAIL_FROM
```

### Cliquer le bouton "Edit" (crayon ✏️)

### Changer de:
```
basefire671@gmail.com
```

### À:
```
onboarding@resend.dev
```

### ✅ MAINTENANT cliquer "Save Changes"

---

## 🎯 ÉTAPE 4: Attendre le redémarrage

Render va redémarrer automatiquement.

**Temps:** 30 secondes

---

## 🎯 ÉTAPE 5: Vérifier les logs

### Dans zen_backend → Onglet "Logs"

### Chercher cette ligne:
```
✅ Resend Email Service initialized
```

**Si vous voyez ça** → ✅ **SUCCÈS!**

---

## 🎯 ÉTAPE 6: TESTER!

### 1. Aller sur:
```
https://zen-lyart.vercel.app/forgot-password
```

### 2. Entrer votre email:
```
aubinmaga@gmail.com
```

### 3. Cliquer:
```
"Envoyer le code"
```

### 4. Vérifier votre boîte email

**Vous devez recevoir un email en 2-5 secondes** avec un code à 6 chiffres!

---

## ✅ SI ÇA MARCHE

```
╔═══════════════════════════════════════╗
║                                       ║
║   🎉 FÉLICITATIONS!                  ║
║                                       ║
║   ✅ Fonctionnalité opérationnelle   ║
║   📧 Email reçu                      ║
║   🔐 Code fonctionne                 ║
║                                       ║
║   C'est terminé! ✅                  ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## ❌ SI PROBLÈME

### Erreur: "RESEND_API_KEY is missing"
→ Retour à l'étape 2: Vérifier que vous avez bien cliqué "Save Changes"

### Pas de ligne "Resend Email Service initialized"
→ Vérifier que la clé API est bien `re_LLY5HccR_KHEGDVByei1jnfp9K1rhwvaN` (copier-coller)

### Email pas reçu
→ Vérifier vos **SPAMS** (dossier courrier indésirable)

---

## 📝 RAPPEL DES 2 VARIABLES

```
1. RESEND_API_KEY = re_LLY5HccR_KHEGDVByei1jnfp9K1rhwvaN
2. EMAIL_FROM = onboarding@resend.dev
```

---

## ⏱️ TEMPS TOTAL

- Étape 1: 30 sec (attendre déploiement)
- Étape 2: 30 sec (ajouter variable)
- Étape 3: 30 sec (modifier variable)
- Étape 4: 30 sec (redémarrage)
- Étape 5: 15 sec (vérifier logs)
- Étape 6: 30 sec (tester)

**TOTAL: ~3 minutes** ✅

---

**C'EST PARTI!** 🚀

Allez sur https://dashboard.render.com et faites les étapes!

