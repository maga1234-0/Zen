# 🎯 ACTIONS À FAIRE MAINTENANT

## ✅ 2 PROBLÈMES CORRIGÉS - 2 ACTIONS REQUISES

---

## 🔴 ACTION 1: CATÉGORIES RESTAURANT (5 min)

### Le problème
Dropdown vide lors de la création d'un menu → ❌ Erreur `restaurant_categories does not exist`

### La correction
Script mis à jour avec le **bon nom de table**: `menu_categories`

### ⚡ CE QUE VOUS DEVEZ FAIRE

**1. Ouvrir Supabase SQL Editor**
```
https://supabase.com/dashboard/project/hxvhkhwhhfwtthujkahx/sql
```

**2. Exécuter le script**
- Cliquer: **New query**
- Ouvrir le fichier: `database/CREATE_RESTAURANT_CATEGORIES.sql`
- **Copier TOUT** le contenu (Ctrl+A, Ctrl+C)
- **Coller** dans Supabase (Ctrl+V)
- Cliquer: **Run** (ou F5)

**3. Vérifier le résultat**
Vous devez voir:
```
✅ Script exécuté avec succès!
Nombre de catégories créées: 4

📋 Catégories disponibles:
1. Entrées / Starters
2. Plats / Main Courses
3. Desserts
4. Boissons / Beverages

🎉 Vous pouvez maintenant créer des articles menu!
```

**4. Tester**
- Aller sur: https://zen-lyart.vercel.app/restaurant
- Créer un article menu
- Vérifier: Dropdown **Catégorie** contient 4 options ✅

---

## 🟡 ACTION 2: LOGIN NE SE RECHARGE PLUS (2 min)

### Le problème
Page se recharge quand on entre des mauvais identifiants

### La correction
Code mis à jour avec `e.stopPropagation()` pour empêcher le rechargement

### ⚡ CE QUE VOUS DEVEZ FAIRE

**1. Déployer sur GitHub**

Ouvrir PowerShell dans le dossier du projet:
```powershell
cd c:\Users\aubin\Downloads\kiro1

git add client/src/pages/Login.tsx database/CREATE_RESTAURANT_CATEGORIES.sql
git commit -m "fix: login reload + categories restaurant"
git push origin main
```

**2. Attendre le déploiement**
- Vercel détecte automatiquement le push
- Déploiement prend **2-3 minutes**
- Vérifier sur: https://vercel.com/dashboard

**3. Tester**
- Aller sur: https://zen-lyart.vercel.app
- Entrer **mauvais** mot de passe
- Vérifier: Message d'erreur s'affiche ✅
- Vérifier: Page **ne se recharge pas** ✅
- Vérifier: Formulaire reste visible ✅

---

## 📋 CHECKLIST COMPLÈTE

### Catégories Restaurant
- [ ] Ouvrir Supabase SQL Editor
- [ ] Copier contenu de `CREATE_RESTAURANT_CATEGORIES.sql`
- [ ] Exécuter dans Supabase
- [ ] Vérifier: 4 catégories créées
- [ ] Tester: Dropdown rempli sur page Restaurant

### Login
- [ ] Ouvrir PowerShell
- [ ] `git add client/src/pages/Login.tsx`
- [ ] `git commit -m "fix: login reload"`
- [ ] `git push origin main`
- [ ] Attendre 2-3 min
- [ ] Tester: Login avec mauvais credentials
- [ ] Vérifier: Page ne se recharge pas

---

## ⏱️ TEMPS TOTAL: 7 MINUTES

- 5 min (SQL dans Supabase)
- 2 min (Git push + attente)

---

## 🎯 RÉSULTATS ATTENDUS

### Après Action 1
✅ Dropdown catégories contient:
1. Entrées
2. Plats
3. Desserts
4. Boissons

### Après Action 2
✅ Login avec mauvais credentials:
- Message: "Adresse e-mail ou mot de passe incorrect"
- Page reste sur login (pas de rechargement)
- Formulaire reste visible et utilisable

---

## 📞 SI VOUS AVEZ UN PROBLÈME

### Catégories toujours vides
```sql
-- Exécuter dans Supabase SQL Editor
SELECT * FROM menu_categories;
```
Si 0 résultats → Le script n'a pas été exécuté correctement

### Page login se recharge toujours
1. Vérifier que le code est déployé: `git log -1`
2. Vider le cache: Ctrl+Shift+R
3. Tester en navigation privée

---

## 🚀 COMMENCEZ PAR ACTION 1

**Ne lisez rien d'autre, faites juste ces 2 actions! 👆**

1. Supabase → Exécuter script catégories
2. PowerShell → Git push

**C'est tout! 🎉**
