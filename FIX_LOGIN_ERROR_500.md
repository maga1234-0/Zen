# 🔴 FIX: Login Error 500

**Date**: 23 juillet 2026  
**Erreur**: Login échoue avec erreur serveur 500  
**URL**: https://zen-lyart.vercel.app

---

## ❌ ERREUR

```
API Error: 500
Object { message: "Server error" }

AxiosError: Request failed with status code 500
```

---

## 🔍 CAUSE PROBABLE

Le backend Render vient de se redéployer avec les changements pour `profile_picture`.

**Problème possible**:
- Colonne `profile_picture` manquante dans la table `users`
- Script SQL `add-profile-picture.sql` pas encore exécuté
- Backend essaie de SELECT une colonne qui n'existe pas

---

## ✅ SOLUTION

### Option 1: Exécuter le script SQL (RECOMMANDÉ)

1. Ouvrir Supabase SQL Editor: https://supabase.com/dashboard
2. Sélectionner le projet
3. Aller dans SQL Editor
4. Exécuter le script suivant:

```sql
-- Ajouter la colonne profile_picture si elle n'existe pas déjà
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Vérifier que la colonne existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'profile_picture';
```

5. Attendre 30 secondes
6. Réessayer le login

---

### Option 2: Rollback du backend (TEMPORAIRE)

Si le script SQL ne peut pas être exécuté immédiatement:

1. Aller sur https://dashboard.render.com
2. Sélectionner le service backend
3. Onglet "Events"
4. Cliquer sur "Rollback" vers le commit précédent (`61f61b7`)
5. Attendre 3-5 min
6. Login devrait fonctionner

**Note**: Cette solution est temporaire. Il faudra quand même exécuter le script SQL.

---

## 🔧 DIAGNOSTIC COMPLET

### Vérifier si la colonne existe

Exécuter dans Supabase SQL Editor:

```sql
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

**Résultat attendu**: Doit contenir `profile_picture | text | YES`

---

### Vérifier les logs backend

1. Aller sur https://dashboard.render.com
2. Sélectionner le service backend "zen-backend"
3. Onglet "Logs"
4. Chercher les erreurs après le déploiement

**Erreur attendue**:
```
column "profile_picture" does not exist
```

---

## 📝 SCRIPT SQL COMPLET

**Fichier**: `database/add-profile-picture.sql`

```sql
-- Add profile_picture column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'profile_picture';

SELECT '✅ Profile picture column added to users table' as result;
```

---

## ⚡ ACTION IMMÉDIATE

**EXÉCUTER MAINTENANT dans Supabase**:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;
```

Puis réessayer le login après 30 secondes.

---

## 🔄 SI LE PROBLÈME PERSISTE

### 1. Vider le cache navigateur
```
Ctrl + Shift + Delete
→ Cocher "Cache"
→ Supprimer
```

### 2. Hard refresh
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

### 3. Tester avec un autre navigateur
```
- Chrome
- Firefox
- Edge
```

### 4. Vérifier l'URL backend
```
Frontend essaie de contacter:
https://zen-backend-jzjh.onrender.com

Tester directement:
https://zen-backend-jzjh.onrender.com/api/auth/login
→ Doit répondre (même si 404 ou 405, c'est OK)
→ Si timeout ou erreur réseau → Backend down
```

---

## 📊 ÉTAT DES DÉPLOIEMENTS

### Frontend (Vercel)
- ✅ Déployé avec succès
- Commit: `3c87fc0`
- URL: https://zen-lyart.vercel.app

### Backend (Render)
- ⚠️ Déployé mais erreur 500
- Commit: `a7a5159`
- URL: https://zen-backend-jzjh.onrender.com
- **Problème**: Colonne manquante en DB

### Database (Supabase)
- ❌ Script SQL non exécuté
- Colonne `profile_picture` manquante
- **Action**: Exécuter le script maintenant

---

## 🎯 RÉSOLUTION EN 3 ÉTAPES

1. **Ouvrir Supabase** → SQL Editor
2. **Copier-coller**:
   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;
   ```
3. **Cliquer** "Run" → Attendre 30s → Réessayer login

---

## ✅ VÉRIFICATION

Après avoir exécuté le script SQL:

1. Login devrait fonctionner ✅
2. Photos de profil disponibles dans Profile page ✅
3. Photos affichées dans Staff page ✅
4. Backend logs propres (pas d'erreur SQL) ✅

---

**Priorité**: 🔴 URGENTE  
**Temps estimé**: 2 minutes  
**Solution**: Exécuter le script SQL dans Supabase

---

💡 **Le problème est que le backend a été déployé AVANT que le script SQL soit exécuté. C'est un problème d'ordre de déploiement.**
