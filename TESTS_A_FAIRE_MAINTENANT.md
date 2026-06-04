# 🧪 TESTS À FAIRE MAINTENANT (10 minutes)

## ✅ CE QUI A ÉTÉ DÉPLOYÉ

### Backend (Render)
- ✅ Commit `14bb3bf` : Bcrypt password fix
- ⏱️ Déployé il y a ~15 minutes
- 🌐 URL : https://zen-backend-jzjh.onrender.com

### Frontend (Vercel)
- ✅ Commit `bbca426` : Toast messages en français
- ⏱️ Déployé il y a ~12 minutes
- 🌐 URL : https://zen-lyart.vercel.app

### Base de données (Supabase)
- ✅ Script `FIX_ROLE_CONSTRAINT.sql` exécuté
- ✅ Contrainte mise à jour avec 10 rôles

---

## 🧪 TEST 1 : Changement de mot de passe (3 min)

### Étapes :
1. Ouvrir https://zen-lyart.vercel.app
2. Se connecter avec vos identifiants admin
3. Cliquer sur votre **nom en haut à droite** → **Profile**
4. Scroller vers le bas
5. Cliquer sur **"Change Password"**
6. Remplir :
   - **Current Password** : Votre mot de passe actuel
   - **New Password** : `test123456`
   - **Confirm New Password** : `test123456`
7. Cliquer **"Change Password"**

### Résultat attendu :
✅ **Toast vert en français** : "Mot de passe modifié avec succès !"  
✅ Les champs se vident  
✅ La section se ferme

### Si erreur :
❌ **Toast rouge** : "Le mot de passe actuel est incorrect"  
→ Vérifiez votre mot de passe actuel

❌ **Erreur 500** : Problème backend  
→ Copiez l'erreur et dites-moi

---

## 🧪 TEST 2 : Création staff avec rôle restaurant (3 min)

### Étapes :
1. Dans l'application, aller sur **Staff** (menu de gauche)
2. Cliquer **"Add New Staff"** (bouton vert en haut à droite)
3. Remplir le formulaire :
   - **First Name** : `Chef`
   - **Last Name** : `Test`
   - **Email** : `chef.test@zen.com`
   - **Phone** : `1234567890`
   - **Role** : Choisir **"Chef Restaurant"** ← IMPORTANT
   - **Password** : `chef123456`
4. Cliquer **"Add Staff"**

### Résultat attendu :
✅ **Toast vert** : "Staff member added successfully" (ou en français)  
✅ Le nouveau staff apparaît dans la liste  
✅ **Badge jaune/ambre** "Chef Restaurant" visible

### Si erreur :
❌ **Erreur 500** : "violates check constraint"  
→ Le script SQL n'a pas été exécuté correctement  
→ Montrez-moi l'erreur

❌ **"Chef Restaurant" n'apparaît pas dans le dropdown**  
→ Le frontend n'a pas chargé les nouveaux rôles  
→ Faire Ctrl+Shift+R (hard refresh)

---

## 🧪 TEST 3 : Connexion avec rôle restaurant (2 min)

### Prérequis :
✅ Test 2 doit avoir réussi (utilisateur Chef créé)

### Étapes :
1. Cliquer sur votre **nom en haut à droite** → **Logout**
2. Se connecter avec :
   - **Email** : `chef.test@zen.com`
   - **Password** : `chef123456`
3. Observer le Dashboard et la Sidebar

### Résultat attendu :
✅ **Connexion réussie**  
✅ **Sidebar visible** :
   - 📊 Dashboard
   - 🍽️ Restaurant
   - 🔔 Notifications
   - ⚙️ Settings (peut-être)
✅ **Dashboard s'affiche** (même si cartes non filtrées encore)

### Si erreur :
❌ **"Invalid credentials"**  
→ Problème de login, vérifiez email/password

❌ **Sidebar vide ou Dashboard vide**  
→ Problème permissions, montrez-moi la console (F12)

---

## 📊 RÉCAPITULATIF DES TESTS

| Test | Objectif | Durée |
|------|----------|-------|
| **Test 1** | Vérifier bcrypt + toast français | 3 min |
| **Test 2** | Vérifier constraint rôles + dropdown | 3 min |
| **Test 3** | Vérifier connexion + permissions | 2 min |
| **TOTAL** | Valider les 3 déploiements | **~10 min** |

---

## ✅ SI TOUS LES TESTS PASSENT

**BRAVO !** Tout fonctionne. Je peux alors :

1. ✅ Implémenter le Dashboard filtré (Chef en priorité)
2. ✅ Implémenter Restaurant.tsx vue Chef
3. ✅ Déployer
4. ✅ Tester le RBAC complet

**Temps estimé** : 2-3 heures

---

## ❌ SI UN TEST ÉCHOUE

**PAS DE PANIQUE !** On va corriger :

1. Copiez l'erreur exacte
2. Faites une capture d'écran si possible
3. Dites-moi quel test a échoué
4. Je corrige le problème

---

## 🚀 APRÈS LES TESTS

**Revenez me dire** :
- ✅ "Test 1 : OK"
- ✅ "Test 2 : OK"
- ✅ "Test 3 : OK"

**OU**

- ❌ "Test X : Erreur [copier l'erreur]"

Et je continue immédiatement avec l'implémentation RBAC !

---

## 💡 ASTUCE

Si vous avez des erreurs dans la console (F12), copiez-les aussi. Elles m'aident à diagnostiquer plus vite.

---

**🎯 COMMENCEZ LES TESTS MAINTENANT !**

Je vous attends pour continuer ! 🚀

