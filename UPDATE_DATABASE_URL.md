# 🔄 MISE À JOUR URL BASE DE DONNÉES

## 📋 NOUVELLE URL SUPABASE

```
postgresql://postgres.vzzznyrlbhftixgkqcca:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**⚠️ IMPORTANT**: Remplacez `[YOUR-PASSWORD]` par votre vrai mot de passe Supabase!

---

## 🎯 OÙ METTRE À JOUR L'URL

### 1️⃣ Render (Backend en production) - PRIORITAIRE ⭐

**C'est le plus important!** Le backend sur Render doit avoir la bonne URL.

#### Étapes:

1. **Aller sur Render**
   - https://dashboard.render.com

2. **Sélectionner votre service backend**
   - Chercher le service (ex: "zen-backend" ou similaire)
   - Cliquer dessus

3. **Aller dans Environment**
   - Dans le menu de gauche, cliquer sur **"Environment"**

4. **Trouver DATABASE_URL**
   - Chercher la variable `DATABASE_URL`
   - Cliquer sur le bouton **"Edit"** (crayon)

5. **Remplacer l'URL**
   - Supprimer l'ancienne URL
   - Coller la nouvelle:
   ```
   postgresql://postgres.vzzznyrlbhftixgkqcca:VOTRE_MOT_DE_PASSE@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
   - **Remplacer `VOTRE_MOT_DE_PASSE`** par le vrai mot de passe!

6. **Sauvegarder**
   - Cliquer **"Save Changes"**
   - Render va automatiquement redémarrer le service (2-3 minutes)

---

### 2️⃣ Fichiers locaux (Développement) - OPTIONNEL

Si vous développez en local, mettez à jour ces fichiers:

#### A. `server/.env` (si existe)
```env
DATABASE_URL=postgresql://postgres.vzzznyrlbhftixgkqcca:VOTRE_MOT_DE_PASSE@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

#### B. `zen_backend/.env` (si existe)
```env
DATABASE_URL=postgresql://postgres.vzzznyrlbhftixgkqcca:VOTRE_MOT_DE_PASSE@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**⚠️ NE PAS POUSSER CES FICHIERS SUR GITHUB!**

---

## 🔍 COMMENT TROUVER VOTRE MOT DE PASSE SUPABASE

### Méthode 1: Dans Supabase Dashboard

1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Cliquer sur **"Settings"** (icône engrenage)
4. Cliquer sur **"Database"**
5. Descendre jusqu'à **"Connection string"**
6. Cliquer sur **"URI"**
7. Le mot de passe est affiché (ou cliquer "Reset password" pour en créer un nouveau)

### Méthode 2: Vous l'avez déjà

Si vous avez déjà configuré Supabase, vous avez le mot de passe quelque part:
- Dans vos notes
- Dans un fichier `.env` existant
- Dans les variables d'environnement Render actuelles

---

## ✅ VÉRIFICATION

### Test 1: Vérifier que Render a bien l'URL

1. Aller sur Render → Votre service → Environment
2. Vérifier que `DATABASE_URL` contient la nouvelle URL
3. Vérifier que le service est "Live" (pas d'erreur)

### Test 2: Tester la connexion

1. Ouvrir les logs Render:
   - Render → Votre service → Logs
2. Chercher des messages comme:
   - ✅ "Database connected successfully"
   - ❌ "Connection error" ou "authentication failed"

### Test 3: Tester l'API

1. Ouvrir dans le navigateur:
   ```
   https://votre-backend.onrender.com/api/rooms
   ```
2. Résultat attendu: Liste de chambres (ou tableau vide `[]`)
3. Résultat incorrect: Erreur 500 ou "Database connection failed"

---

## 🔧 FORMAT DE L'URL EXPLIQUÉ

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

**Votre nouvelle URL**:
```
postgresql://postgres.vzzznyrlbhftixgkqcca:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Détails**:
- **User**: `postgres.vzzznyrlbhftixgkqcca`
- **Password**: `[YOUR-PASSWORD]` ← À remplacer!
- **Host**: `aws-1-ap-southeast-1.pooler.supabase.com`
- **Port**: `6543` (pooler Supabase)
- **Database**: `postgres`

---

## ⚠️ ERREURS COURANTES

### Erreur 1: "authentication failed"
**Cause**: Mauvais mot de passe  
**Solution**: Vérifier le mot de passe dans Supabase Dashboard

### Erreur 2: "connection timeout"
**Cause**: Mauvais host ou port  
**Solution**: Vérifier que l'URL est exactement celle de Supabase

### Erreur 3: "database does not exist"
**Cause**: Mauvais nom de database  
**Solution**: Utiliser `postgres` (pas `postgresql` ou autre)

### Erreur 4: Service ne redémarre pas
**Cause**: Render n'a pas détecté le changement  
**Solution**: Redémarrer manuellement (bouton "Manual Deploy")

---

## 🎯 APRÈS LA MISE À JOUR

Une fois l'URL mise à jour sur Render:

### 1. Le backend se reconnecte automatiquement
- Render redémarre le service (2-3 min)
- Le backend se connecte à la nouvelle base de données
- Toutes les API fonctionnent normalement

### 2. Vous pouvez créer les tables spa
- Suivre le guide `SUPABASE_TABLES_GUIDE.md`
- Exécuter `spa-module.sql` dans SQL Editor
- Les tables seront créées dans la nouvelle base

### 3. Tester le module spa
- Ouvrir https://zen-lyart.vercel.app/spa
- Le bandeau jaune devrait disparaître
- Vous pouvez créer des services, thérapeutes, etc.

---

## 📊 CHECKLIST COMPLÈTE

- [ ] Trouver le mot de passe Supabase
- [ ] Remplacer `[YOUR-PASSWORD]` dans l'URL
- [ ] Aller sur Render Dashboard
- [ ] Sélectionner le service backend
- [ ] Aller dans Environment
- [ ] Modifier DATABASE_URL
- [ ] Coller la nouvelle URL (avec le vrai mot de passe)
- [ ] Sauvegarder
- [ ] Attendre le redémarrage (2-3 min)
- [ ] Vérifier les logs (pas d'erreur de connexion)
- [ ] Tester l'API (https://votre-backend.onrender.com/api/rooms)
- [ ] Créer les tables spa (si pas encore fait)
- [ ] Tester le frontend (https://zen-lyart.vercel.app/spa)

---

## 🆘 BESOIN D'AIDE?

### Problème: Je ne trouve pas mon mot de passe
**Solution**: Aller sur Supabase → Settings → Database → Reset password

### Problème: Render ne redémarre pas
**Solution**: Cliquer sur "Manual Deploy" → "Deploy latest commit"

### Problème: Erreur de connexion persiste
**Solution**: 
1. Vérifier que l'URL est exacte (copier/coller depuis Supabase)
2. Vérifier que le mot de passe est correct
3. Vérifier les logs Render pour voir l'erreur exacte

---

## 📞 LIENS UTILES

- **Render Dashboard**: https://dashboard.render.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Guide Render**: `RENDER_DEPLOY_GUIDE.md`
- **Guide Supabase**: `SUPABASE_TABLES_GUIDE.md`

---

## ⏱️ TEMPS ESTIMÉ

| Étape | Temps |
|-------|-------|
| Trouver le mot de passe | 2 min |
| Mettre à jour sur Render | 2 min |
| Attendre redémarrage | 3 min |
| Vérifier | 1 min |
| **TOTAL** | **8 min** |

---

**Commencez par mettre à jour l'URL sur Render, c'est le plus important!** 🚀

**Ensuite, suivez les guides pour déployer le module spa!**
