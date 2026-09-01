# ⚡ URGENT: Configurer Render avec la Nouvelle Base de Données

## 🎯 Problème

Votre Dashboard ne montre pas les paiements car **Render est probablement encore connecté à l'ANCIENNE base de données**.

Vous avez créé une **NOUVELLE** base Supabase (eu-central-2) mais Render utilise peut-être encore l'ancienne (ap-southeast-1).

---

## ✅ SOLUTION EN 5 MINUTES

### Étape 1: Aller sur Render

1. Ouvrir https://dashboard.render.com
2. Se connecter
3. Trouver le service **zen-backend**
4. Cliquer dessus

### Étape 2: Vérifier DATABASE_URL

1. Dans le menu de gauche, cliquer sur **Environment**
2. Chercher la variable **`DATABASE_URL`**
3. Cliquer sur **Show** ou l'icône œil pour voir la valeur

### Étape 3: Comparer les URLs

**Votre NOUVELLE base de données** (que vous devez utiliser):
```
postgresql://postgres.hxvhkhwhhfwtthujkahx:suUxX267q1OWx3Kw@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```

**Ancienne base de données** (à NE PLUS utiliser):
```
postgresql://postgres...@aws-1-ap-southeast-1...
```

**Vérifiez**:
- ✅ Si URL contient `eu-central-2` et `hxvhkhwhhfwtthujkahx` → **CORRECT**
- ❌ Si URL contient `ap-southeast-1` ou autre projet → **INCORRECT, à changer**

### Étape 4: Mettre à Jour DATABASE_URL (si nécessaire)

Si l'URL est incorrecte:

1. Cliquer sur l'icône **Edit** (crayon) à côté de DATABASE_URL
2. Remplacer TOUTE la valeur par:
```
postgresql://postgres.hxvhkhwhhfwtthujkahx:suUxX267q1OWx3Kw@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```
3. Cliquer **Save Changes**
4. Render va automatiquement redémarrer le service (2-3 minutes)

### Étape 5: Attendre le Redémarrage

1. Rester sur la page Render
2. Vous verrez "Deploying..." puis "Live"
3. Attendre que le status devienne **"Live"** (vert)
4. Ça prend 2-3 minutes

---

## 🧪 TESTER

Une fois Render redémarré:

1. Aller sur votre Dashboard: https://zen-lyart.vercel.app
2. **Rafraîchir** avec Ctrl+Shift+R
3. Le revenu devrait maintenant afficher **179.98** ✅

---

## 🔧 CE QUI A ÉTÉ CORRIGÉ

### Commit d68b676 (Backend)
**Message**: "fix: utiliser payment_status au lieu de status"

**Changement**:
- AVANT: `p.status = 'completed'`
- APRÈS: `p.payment_status = 'completed'`

**Raison**: Votre table `payments` utilise la colonne `payment_status`, pas `status`.

---

## 📊 VÉRIFICATION RAPIDE

Si vous voulez vérifier que Render utilise la bonne base:

1. Dans Supabase, exécuter:
```sql
SELECT COUNT(*) FROM payments WHERE payment_status = 'completed';
```
Résultat attendu: **1** (votre paiement de 179.98)

2. Si le Dashboard affiche 179.98 après le redémarrage → **Render est bien connecté** ✅
3. Si le Dashboard affiche toujours 0 → **Render utilise encore l'ancienne base** ❌

---

## ⚠️ IMPORTANT

### Les 2 Bases de Données

Vous avez maintenant **2 bases de données Supabase**:

1. **Ancienne**: ap-southeast-1 (Asie du Sud-Est)
   - Contenait vos anciennes données
   - Ne devrait PLUS être utilisée

2. **Nouvelle**: eu-central-2 (Europe)
   - C'est celle que vous utilisez maintenant
   - Contient votre paiement de 179.98
   - **C'est celle-ci que Render doit utiliser**

### Configuration

**Local** (`zen_backend/.env`):
- ✅ Déjà configuré avec la nouvelle URL

**Render** (zen-backend service):
- ⚠️ À vérifier et corriger si nécessaire

**Vercel** (Frontend):
- ✅ Pas de DATABASE_URL (le frontend ne se connecte pas directement)

---

## 🎯 CHECKLIST

- [ ] Aller sur https://dashboard.render.com
- [ ] Ouvrir le service **zen-backend**
- [ ] Vérifier **Environment** → **DATABASE_URL**
- [ ] Comparer avec la nouvelle URL (eu-central-2)
- [ ] Si différent, **modifier** DATABASE_URL
- [ ] **Sauvegarder** et attendre le redéploiement
- [ ] **Tester** le Dashboard (Ctrl+Shift+R)
- [ ] Vérifier que 179.98 s'affiche ✅

---

## 💡 APRÈS LA CORRECTION

Une fois DATABASE_URL corrigée sur Render:

**Automatiquement**:
- Render redémarre (2-3 min)
- Backend se connecte à la nouvelle base
- Dashboard affiche les bonnes données

**Manuellement**:
- Rafraîchir le Dashboard (Ctrl+Shift+R)
- Vérifier que les paiements s'affichent

---

## 🆘 SI ÇA NE FONCTIONNE TOUJOURS PAS

Après avoir mis à jour DATABASE_URL et attendu 3 minutes:

1. Vérifier les logs Render:
   - Dashboard Render → zen-backend → **Logs**
   - Chercher des erreurs de connexion PostgreSQL

2. Vérifier que le commit d68b676 est déployé:
   - Dashboard Render → zen-backend → **Events**
   - Le dernier déploiement doit montrer "d68b676"

3. Tester la connexion backend directement:
   - Ouvrir https://zen-backend-jzjh.onrender.com/health
   - Devrait retourner un statut OK

---

**Date**: 31 août 2026  
**Commit**: d68b676  
**Action requise**: Mettre à jour DATABASE_URL sur Render  
**Temps**: 5 minutes
