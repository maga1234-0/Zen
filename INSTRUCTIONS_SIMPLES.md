# ✅ TOUT EST PRÊT - Voici ce que tu dois faire

---

## 🎯 TU AS 2 VARIABLES À CONFIGURER SUR RENDER

**Temps nécessaire:** 2-3 minutes maximum

---

## 📍 ÉTAPE 1: Va sur Render

```
https://dashboard.render.com
```

Clique sur le service **zen_backend**

---

## 📍 ÉTAPE 2: Va dans "Environment"

Clique sur l'onglet **Environment** (en haut)

---

## 📍 ÉTAPE 3: Ajoute cette variable

Clique **"Add Environment Variable"**

**Copie-colle exactement:**

```
Key: RESEND_API_KEY

Value: re_LLY5HccR_KHEGDVByei1jnfp9K1rhwvaN
```

---

## 📍 ÉTAPE 4: Modifie cette variable

Trouve la variable **EMAIL_FROM** (elle existe déjà)

Clique le bouton **Edit** (crayon)

**Change de:**
```
basefire671@gmail.com
```

**À:**
```
onboarding@resend.dev
```

---

## 📍 ÉTAPE 5: Sauvegarde

Clique le bouton **"Save Changes"** en bas de la page

Render va redémarrer automatiquement (30 secondes)

---

## 📍 ÉTAPE 6: Vérifie les logs

Dans **zen_backend** → Onglet **Logs**

Tu dois voir:
```
✅ Resend Email Service initialized
```

---

## 📍 ÉTAPE 7: TESTE!

Va sur ton app:
```
https://zen-lyart.vercel.app/forgot-password
```

Entre ton email:
```
aubinmaga@gmail.com
```

Clique **"Envoyer le code"**

Tu vas recevoir un email en **2-5 secondes** avec un code à 6 chiffres! 🎉

---

## ✅ C'EST TOUT!

Si ça marche → **Félicitations!** La fonctionnalité est opérationnelle! 🚀

---

## ❌ Si problème

### "RESEND_API_KEY is missing"
→ Tu n'as pas cliqué "Save Changes" à l'étape 5

### Pas d'email reçu
→ Vérifie tes **SPAMS** (courrier indésirable)

### Autre erreur
→ Vérifie que tu as copié-collé exactement:
```
re_LLY5HccR_KHEGDVByei1jnfp9K1rhwvaN
```

---

## 📋 RÉSUMÉ ULTRA-RAPIDE

1. **Render** → zen_backend → **Environment**
2. **Ajouter**: `RESEND_API_KEY` = `re_LLY5HccR_KHEGDVByei1jnfp9K1rhwvaN`
3. **Modifier**: `EMAIL_FROM` = `onboarding@resend.dev`
4. **Save Changes**
5. **Vérifier logs**: `✅ Resend Email Service initialized`
6. **Tester**: https://zen-lyart.vercel.app/forgot-password

---

**C'EST PARTI!** 🚀

