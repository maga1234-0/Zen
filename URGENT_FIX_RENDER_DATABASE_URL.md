# 🚨 ACTION URGENTE: Corriger DATABASE_URL sur Render

## PROBLÈME ACTUEL

**Le login ne fonctionne pas** car la variable d'environnement `DATABASE_URL` sur Render est incorrecte.

### Erreur actuelle:
```
ENOTFOUND postgres.vzzznyrlbhftixgkqcca
tenant/user postgres.vzzznyrlbhftixgkqcca not found
```

Cette erreur signifie que Render essaie de se connecter à Supabase avec une **ancienne URL de connexion qui n'existe plus**.

---

## ✅ SOLUTION EN 3 ÉTAPES (5 MINUTES)

### ÉTAPE 1: Ouvrir les paramètres Render

1. **Aller sur**: https://dashboard.render.com
2. **Connectez-vous** avec votre compte
3. **Cliquez sur** votre service backend: `zen-backend-jzjh`
4. **Cliquez sur** l'onglet **"Environment"** dans le menu de gauche

---

### ÉTAPE 2: Mettre à jour DATABASE_URL

Dans la section **Environment Variables**, vous devez:

1. **Trouver** la variable `DATABASE_URL`
2. **Cliquer** sur le bouton **"Edit"** (crayon/icône d'édition)
3. **Remplacer** la valeur actuelle par:

```
postgresql://postgres.vzzznyrlbhftixgkqcca:6OjTIB6BXw1oslvy@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

4. **Cliquer** sur **"Save Changes"** en bas de la page

---

### ÉTAPE 3: Attendre le redéploiement automatique

Après avoir sauvegardé:

1. Render va **automatiquement redéployer** le backend (3-5 minutes)
2. Vous verrez les logs en temps réel dans l'onglet **"Logs"**
3. Attendez de voir: `✓ Server is running on port XXXX`

---

## 🧪 TESTER LA CONNEXION

Une fois le déploiement terminé (après 3-5 minutes):

### Test 1: Vérifier le backend
Ouvrez cette URL dans votre navigateur:
```
https://zen-backend-jzjh.onrender.com/api/auth/verify
```

**✅ Résultat attendu**: 
```json
{
  "message": "Server is running"
}
```

---

### Test 2: Tester le login
1. Allez sur: https://zen-lyart.vercel.app
2. **Email**: `admin@zenith.com`
3. **Mot de passe**: `admin123`
4. Cliquez sur **"Se connecter"**

**✅ Résultat attendu**: Vous accédez au Dashboard sans erreur

---

## 📊 POURQUOI CE PROBLÈME S'EST PRODUIT?

L'URL de connexion à Supabase utilise le **Connection Pooler** (port 6543). Cette URL peut changer si:

- La base de données est mise en pause/réactivée
- Le projet Supabase est migré
- Les credentials sont régénérés

**Solution permanente**: Toujours utiliser l'URL du **Connection Pooler** visible dans Supabase Dashboard → Database → Connection Pooling.

---

## 🔍 VÉRIFIER L'URL ACTUELLE DANS SUPABASE

Si le problème persiste après cette correction:

1. Allez sur: https://supabase.com/dashboard/project/vzzznyrlbhftixgkqcca
2. **Database** → **Connection Pooling**
3. **Mode**: Transaction
4. **Port**: 6543
5. Copiez l'URL **Connection string**
6. Utilisez cette URL dans Render

---

## 📋 CHECKLIST DE VÉRIFICATION

- [ ] DATABASE_URL mise à jour sur Render
- [ ] Render redéployé avec succès (logs affichent "Server is running")
- [ ] Backend accessible: https://zen-backend-jzjh.onrender.com/api/auth/verify
- [ ] Login fonctionne sur: https://zen-lyart.vercel.app
- [ ] Dashboard s'affiche correctement après connexion

---

## ⚠️ REMARQUE IMPORTANTE

**NE PAS** committer le fichier `zen_backend/.env` dans Git. Ce fichier contient des informations sensibles et doit rester local.

Les variables d'environnement doivent être configurées:
- **Render**: Dans Dashboard → Environment
- **Vercel**: Dans Dashboard → Settings → Environment Variables

---

## 📞 SI LE PROBLÈME PERSISTE

Si après avoir suivi ces étapes le login ne fonctionne toujours pas:

1. **Vérifiez les logs Render**: Dashboard → Logs
2. **Vérifiez que Supabase est actif**: Dashboard Supabase doit afficher "Active"
3. **Testez la connexion directe**: Utilisez l'URL Direct Connection (port 5432) au lieu du pooler
4. **Partagez les logs d'erreur**: Copiez les logs Render pour diagnostic

---

## ✅ PROCHAINES ÉTAPES APRÈS LE FIX

Une fois le login restauré, vous pourrez tester:

1. **Photos de profil**: Upload dans page Staff
2. **Restaurant Room Service**: Commandes en room service
3. **Bouton "Commencer"**: Démarrage de la préparation des commandes

**Mais d'abord: CORRIGEZ DATABASE_URL sur Render! 🚀**
