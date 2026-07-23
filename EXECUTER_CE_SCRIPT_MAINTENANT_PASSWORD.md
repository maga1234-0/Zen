# ⚡ ACTION IMMÉDIATE: Créer la table password_reset_codes

## 🎯 PROBLÈME

Vous avez cette erreur:
```
relation "password_reset_codes" does not exist
```

**Cause**: La table pour réinitialiser les mots de passe n'existe pas dans votre base de données.

---

## ✅ SOLUTION EN 3 CLICS (2 MINUTES)

### 1. Ouvrir Supabase SQL Editor

**URL**: https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql

---

### 2. Créer une nouvelle requête

Cliquez sur: **New query**

---

### 3. Exécuter le script

1. **Ouvrez** le fichier sur votre PC: `database/add-password-reset-codes.sql`

2. **Copiez** TOUT le contenu (Ctrl+A, Ctrl+C)

3. **Collez** dans l'éditeur SQL Supabase (Ctrl+V)

4. **Cliquez** sur **Run** (ou appuyez sur F5)

5. **Vérifiez** le message: 
```
Password reset codes table created successfully!
```

---

## ✅ C'EST TOUT!

La table est maintenant créée. La fonctionnalité "Mot de passe oublié" fonctionne.

---

## 🧪 TESTER

1. Allez sur: https://zen-lyart.vercel.app

2. Cliquez: **"Mot de passe oublié ?"**

3. Entrez: `aubinmaga@gmail.com`

4. Cliquez: **"Envoyer le code"**

**✅ Résultat**: Message de succès (pas d'erreur 500)

---

## 📋 AUTRES SCRIPTS RECOMMANDÉS

Une fois ce problème résolu, pensez aussi à exécuter:

### Système d'emails complet
**Fichier**: `database/add-email-system.sql`  
**Pourquoi**: Stockage des emails envoyés (logs)

### Photos de profil
**Fichier**: `database/add-profile-picture.sql`  
**Pourquoi**: Upload de photos pour le personnel

### Fix Restaurant
**Fichier**: `database/FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql`  
**Pourquoi**: Corriger les commandes Room Service

---

## 🔗 LIEN DIRECT

**Supabase SQL Editor**:  
https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql

---

**🚀 Faites-le maintenant - 2 minutes!**
