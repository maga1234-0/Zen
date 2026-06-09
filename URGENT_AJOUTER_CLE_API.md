# 🚨 URGENT - Ajouter la clé API Resend

---

## ❌ ERREUR DANS RENDER

```
Error: Missing API key. Pass it to the constructor `new Resend("re_123")`
at Object.<anonymous> (/usr/src/app/dist/services/emailService.js:9:16)
```

---

## ✅ SOLUTION IMMÉDIATE

### 1️⃣ Va sur:
```
https://dashboard.render.com
```

### 2️⃣ Clique sur: `zen_backend`

### 3️⃣ Onglet: `Environment`

### 4️⃣ Clique: `Add Environment Variable`

### 5️⃣ Copie-colle EXACTEMENT:

```
RESEND_API_KEY
```
```
re_LLY5HccR_KHEGDVByei1jnfp9K1rhwvaN
```

### 6️⃣ Trouve `EMAIL_FROM` et change à:

```
onboarding@resend.dev
```

### 7️⃣ Clique: `Save Changes`

---

## ⏱️ Temps: 2 minutes

---

## ✅ APRÈS

Logs Render vont montrer:
```
✅ Resend Email Service initialized
🚀 Server running on port 3000
```

---

**FAIS-LE MAINTENANT!** 🚀

https://dashboard.render.com

