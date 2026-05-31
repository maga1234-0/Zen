# 🔧 CORRECTION - INVALID CREDENTIALS

## 🚨 PROBLÈME

Vous obtenez "Invalid credentials" lors de la connexion avec:
- Email: admin@hotel.com
- Mot de passe: admin123

---

## 🎯 SOLUTION RAPIDE (5 MINUTES)

### Étape 1: Exécuter le script de correction

1. **Ouvrir Supabase**
   - Aller sur https://supabase.com/dashboard
   - Sélectionner votre projet
   - Cliquer sur **SQL Editor**

2. **Copier le script**
   - Ouvrir le fichier `database/FIX_LOGIN_CREDENTIALS.sql`
   - Sélectionner tout (Ctrl+A)
   - Copier (Ctrl+C)

3. **Exécuter**
   - Coller dans SQL Editor (Ctrl+V)
   - Cliquer **RUN**
   - Attendre le message de confirmation

4. **Vérifier**
   - Vous devriez voir: "✅ UTILISATEUR ADMIN CRÉÉ AVEC SUCCÈS!"

### Étape 2: Vérifier le backend

1. **Vérifier que Render est déployé**
   - Aller sur https://dashboard.render.com
   - Vérifier que votre service backend est "Live"
   - Vérifier les logs (pas d'erreur de connexion DB)

2. **Vérifier DATABASE_URL**
   - Sur Render → Environment
   - Vérifier que `DATABASE_URL` pointe vers votre nouvelle base Supabase
   - Format: `postgresql://postgres.vzzznyrlbhftixgkqcca:MOT_DE_PASSE@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`

### Étape 3: Tester la connexion

1. **Ouvrir le frontend**
   - https://zen-lyart.vercel.app

2. **Se connecter**
   - Email: `admin@hotel.com`
   - Mot de passe: `admin123`

3. **Résultat attendu**
   - ✅ Connexion réussie
   - ✅ Redirection vers le dashboard

---

## 🔍 DIAGNOSTIC APPROFONDI

### Test 1: Vérifier que l'utilisateur existe

```sql
-- Exécuter dans Supabase SQL Editor
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    is_active,
    LENGTH(password_hash) as hash_length
FROM users 
WHERE email = 'admin@hotel.com';
```

**Résultat attendu**:
- 1 ligne retournée
- `hash_length` = 60 (hash bcrypt valide)
- `is_active` = true

**Si aucune ligne**: L'utilisateur n'existe pas → Exécuter `FIX_LOGIN_CREDENTIALS.sql`

**Si hash_length ≠ 60**: Hash invalide → Exécuter `FIX_LOGIN_CREDENTIALS.sql`

### Test 2: Vérifier la connexion backend

```bash
# Ouvrir dans le navigateur ou utiliser curl
https://VOTRE_BACKEND.onrender.com/api/health
```

**Résultat attendu**:
```json
{
  "status": "ok",
  "database": "connected"
}
```

**Si erreur 404**: Backend pas déployé → Redéployer sur Render

**Si "database": "error"**: Problème de connexion DB → Vérifier DATABASE_URL

### Test 3: Tester l'API de login directement

```bash
# Utiliser Postman ou curl
curl -X POST https://VOTRE_BACKEND.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hotel.com","password":"admin123"}'
```

**Résultat attendu**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@hotel.com",
    "role": "admin"
  }
}
```

**Si "Invalid credentials"**: Problème de hash → Exécuter `FIX_LOGIN_CREDENTIALS.sql`

**Si erreur réseau**: Backend pas accessible → Vérifier Render

---

## 🛠️ SOLUTIONS PAR CAUSE

### Cause 1: Utilisateur n'existe pas
**Symptôme**: "Invalid credentials"  
**Solution**: Exécuter `FIX_LOGIN_CREDENTIALS.sql`

### Cause 2: Hash de mot de passe invalide
**Symptôme**: "Invalid credentials"  
**Solution**: Exécuter `FIX_LOGIN_CREDENTIALS.sql`

### Cause 3: Backend pas déployé
**Symptôme**: Erreur réseau ou timeout  
**Solution**: 
1. Aller sur https://dashboard.render.com
2. Sélectionner le service backend
3. Cliquer "Manual Deploy"
4. Attendre 5-10 minutes

### Cause 4: DATABASE_URL incorrecte
**Symptôme**: Backend fonctionne mais "Invalid credentials"  
**Solution**:
1. Aller sur Render → Environment
2. Vérifier DATABASE_URL
3. Doit pointer vers la nouvelle base Supabase
4. Format: `postgresql://postgres.vzzznyrlbhftixgkqcca:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`

### Cause 5: Base de données vide
**Symptôme**: "Invalid credentials"  
**Solution**: Exécuter `complete-database.sql` puis `FIX_LOGIN_CREDENTIALS.sql`

---

## 📋 CHECKLIST COMPLÈTE

- [ ] Base de données créée (tables existent)
- [ ] Utilisateur admin créé avec hash valide
- [ ] Backend déployé sur Render
- [ ] DATABASE_URL configurée sur Render
- [ ] Backend accessible (test /api/health)
- [ ] Frontend accessible (https://zen-lyart.vercel.app)
- [ ] Connexion réussie

---

## 🔐 CRÉER UN NOUVEL UTILISATEUR MANUELLEMENT

Si vous voulez créer un utilisateur avec un mot de passe différent:

### Option 1: Via Node.js (Recommandé)

```javascript
// Créer un fichier hash-password.js
const bcrypt = require('bcrypt');

const password = 'VotreMotDePasse123';
bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log('Hash:', hash);
    console.log('\nSQL:');
    console.log(`INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)`);
    console.log(`VALUES ('votre@email.com', '${hash}', 'Prénom', 'Nom', 'admin', true);`);
});
```

Exécuter:
```bash
npm install bcrypt
node hash-password.js
```

### Option 2: Via un générateur en ligne

1. Aller sur https://bcrypt-generator.com/
2. Entrer votre mot de passe
3. Rounds: 10
4. Cliquer "Generate"
5. Copier le hash
6. Exécuter dans Supabase:

```sql
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
VALUES (
    'votre@email.com',
    'HASH_COPIÉ_ICI',
    'Prénom',
    'Nom',
    'admin',
    true
);
```

---

## 🆘 TOUJOURS PAS DE SOLUTION?

### Vérifications finales

1. **Console du navigateur**
   - Ouvrir F12
   - Onglet Console
   - Chercher des erreurs

2. **Logs Render**
   - Aller sur Render Dashboard
   - Sélectionner le service
   - Onglet "Logs"
   - Chercher des erreurs

3. **Logs Supabase**
   - Aller sur Supabase Dashboard
   - Logs & Analytics
   - Chercher des erreurs

### Réinitialisation complète

Si rien ne fonctionne, réinitialiser complètement:

```sql
-- ⚠️ ATTENTION: Ceci supprime TOUTES les données!

-- Supprimer tous les utilisateurs
DELETE FROM users;

-- Recréer l'admin
-- (Copier le contenu de FIX_LOGIN_CREDENTIALS.sql)
```

---

## 📞 LIENS UTILES

- **Frontend**: https://zen-lyart.vercel.app
- **Supabase**: https://supabase.com/dashboard
- **Render**: https://dashboard.render.com
- **Script de correction**: `database/FIX_LOGIN_CREDENTIALS.sql`

---

## ⏱️ TEMPS ESTIMÉ

| Action | Temps |
|--------|-------|
| Exécuter FIX_LOGIN_CREDENTIALS.sql | 1 min |
| Vérifier backend | 2 min |
| Tester connexion | 1 min |
| **TOTAL** | **4 min** |

---

**👉 PROCHAINE ACTION: Exécuter `FIX_LOGIN_CREDENTIALS.sql` dans Supabase!**

**C'est la solution la plus rapide!** 🚀
