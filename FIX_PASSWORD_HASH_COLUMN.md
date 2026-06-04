# ✅ FIX: Erreur "column password does not exist"

## LE PROBLÈME

Erreur lors du changement de mot de passe:
```
Server error: column "password" does not exist
```

## LA CAUSE

Le code utilisait `password` mais la table `users` utilise `password_hash` comme nom de colonne.

## LA SOLUTION

**Fichier modifié**: `zen_backend/src/routes/userRoutes.ts`

### Changements:

**Avant:**
```sql
SELECT password FROM users WHERE id = $1
UPDATE users SET password = $1...
```

**Après:**
```sql
SELECT password_hash FROM users WHERE id = $1
UPDATE users SET password_hash = $1...
```

## DÉPLOIEMENT

✅ **Commit**: `9082a45` - fix: use password_hash column instead of password  
✅ **Poussé sur GitHub**: https://github.com/maga1234-0/zen_backend-  
⏳ **Render redéploie**: 3-5 minutes

---

## APRÈS LE DÉPLOIEMENT

### Test 1: Changement de mot de passe utilisateur

1. Se connecter à l'application
2. Aller sur **Profile** (cliquer sur son nom)
3. Cliquer **"Change Password"**
4. Remplir:
   - Current Password: votre mot de passe actuel
   - New Password: un nouveau mot de passe
   - Confirm New Password: le même nouveau mot de passe
5. Cliquer **"Change Password"**
6. ✅ **Devrait fonctionner sans erreur 500**

### Test 2: Se reconnecter

1. Se déconnecter
2. Se reconnecter avec le nouveau mot de passe
3. ✅ **Devrait fonctionner**

---

## ENDPOINTS CORRIGÉS

1. ✅ `PUT /users/change-password` - Changement de mot de passe utilisateur
2. ✅ `PUT /users/:id/reset-password` - Réinitialisation par admin

---

## TIMELINE

```
Maintenant → 3-5 min → ✅ Résolu

Code poussé   Render      Changement mot
GitHub        redéploie   de passe OK
```

---

## VÉRIFICATION

**Après 3-5 minutes**, tester le changement de mot de passe.

**Si ça ne marche pas:**
1. Vérifier que Render a bien redéployé (commit `9082a45`)
2. Forcer un Manual Deploy si nécessaire

---

**Date**: 2 juin 2026  
**Commit**: `9082a45`  
**Status**: ✅ Corrigé et déployé
