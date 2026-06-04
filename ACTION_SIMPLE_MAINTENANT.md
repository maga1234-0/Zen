# 🎯 ACTION SIMPLE À FAIRE MAINTENANT

## LE PROBLÈME EN 1 PHRASE
**Tous les rôles ont disparu de la liste Staff parce qu'ils ont été supprimés de la base de données.**

---

## LA SOLUTION EN 1 MINUTE ⏱️

### ÉTAPE 1: Ouvrir Supabase
1. Aller sur https://supabase.com
2. Se connecter
3. Ouvrir votre projet Zen
4. Menu gauche → **SQL Editor**

### ÉTAPE 2: Copier le script
1. Ouvrir le fichier: `database/RESTAURER_TOUS_LES_ROLES.sql`
2. Sélectionner TOUT (Ctrl+A)
3. Copier (Ctrl+C)

### ÉTAPE 3: Exécuter dans Supabase
1. Dans SQL Editor, cliquer "New query"
2. Coller le script (Ctrl+V)
3. Cliquer sur **"Run"** (ou F5)
4. Attendre 5 secondes

### ÉTAPE 4: Vérifier
Dans Supabase, exécuter:
```sql
SELECT name FROM roles WHERE is_active = true ORDER BY name;
```

**✅ Vous devez voir 10 rôles:**
```
accountant
admin
housekeeping
maintenance
manager
receptionist
restaurant_cashier
restaurant_chef
restaurant_manager
restaurant_server
```

### ÉTAPE 5: Tester l'application
1. Aller sur https://zen-lyart.vercel.app
2. Appuyer sur **Ctrl+Shift+R** (hard refresh)
3. Aller sur **Staff** → **Add Staff**
4. Ouvrir le dropdown **"Role"**
5. ✅ Les 10 rôles doivent apparaître

---

## POURQUOI CE PROBLÈME?

**Le frontend était hardcodé** → Les rôles n'étaient pas chargés depuis la base de données.

**Maintenant c'est corrigé:**
- ✅ Backend: Route `/auth/roles` créée (déployé)
- ✅ Frontend: Chargement dynamique des rôles depuis l'API (déployé)
- ✅ Database: Script pour restaurer tous les rôles (prêt)

**Il ne reste plus qu'à exécuter le script SQL!**

---

## LES 10 RÔLES QUI SERONT RESTAURÉS

### Rôles Originaux (6):
1. ✅ **admin** - Administrateur (accès complet)
2. ✅ **manager** - Manager (gestion opérationnelle)
3. ✅ **receptionist** - Réceptionniste
4. ✅ **housekeeping** - Entretien
5. ✅ **maintenance** - Maintenance
6. ✅ **accountant** - Comptable

### Rôles Restaurant (4):
7. ✅ **restaurant_manager** - Responsable Restaurant
8. ✅ **restaurant_chef** - Chef de Cuisine
9. ✅ **restaurant_server** - Serveur Restaurant
10. ✅ **restaurant_cashier** - Caissier Restaurant

---

## CE QUI VA ÊTRE RÉSOLU

1. ✅ **Liste des rôles vide** → Les 10 rôles apparaîtront
2. ✅ **Erreur 500 Restaurant** → Admin/Manager auront les permissions restaurant
3. ✅ **Permissions manquantes** → Toutes les permissions seront ajoutées

---

## FICHIERS IMPORTANTS

📁 **À exécuter dans Supabase:**
- `database/RESTAURER_TOUS_LES_ROLES.sql` ← **EXÉCUTER CELUI-CI**

📖 **Documentation:**
- `GUIDE_RESTAURATION_ROLES.md` - Guide détaillé
- `SITUATION_ROLES_MAINTENANT.md` - Explication complète du problème

❌ **NE PLUS UTILISER:**
- `database/FORCE_FIX_ROLES.sql` (supprime les rôles)
- `database/add-restaurant-roles.sql` (ancien, incomplet)

---

## EN CAS DE PROBLÈME

### Si les rôles n'apparaissent toujours pas après le script:

**1. Vérifier que le script a bien été exécuté:**
```sql
SELECT COUNT(*) FROM roles WHERE is_active = true;
```
→ Doit retourner: **10**

**2. Vérifier l'API:**
Ouvrir: https://zen-backend-jzjh.onrender.com/auth/roles
→ Doit afficher un JSON avec 10 rôles

**3. Vider le cache navigateur:**
- Chrome/Edge: Ctrl+Shift+Delete → Cocher "Cached images and files" → Clear
- OU simplement: Ctrl+Shift+R (hard refresh)

**4. Vérifier la console:**
- F12 → Console
- Chercher des erreurs en rouge

---

## RÉSUMÉ VISUEL

```
AVANT:
┌──────────────────┐
│  Base de données │
│                  │
│  Roles: []       │  ❌ VIDE
│                  │
└──────────────────┘
         ↓
┌──────────────────┐
│    Frontend      │
│                  │
│  Dropdown: []    │  ❌ VIDE
│                  │
└──────────────────┘

APRÈS EXÉCUTION DU SCRIPT:
┌──────────────────────────────┐
│      Base de données         │
│                              │
│  Roles: [admin, manager,     │
│          receptionist,       │  ✅ 10 RÔLES
│          housekeeping,       │
│          maintenance,        │
│          accountant,         │
│          restaurant_*]       │
│                              │
└──────────────────────────────┘
         ↓ GET /auth/roles
┌──────────────────────────────┐
│         Frontend             │
│                              │
│  Dropdown:                   │
│   - Admin                    │
│   - Manager                  │  ✅ 10 RÔLES
│   - Receptionist             │     AFFICHÉS
│   - Housekeeping             │
│   - Maintenance              │
│   - Accountant               │
│   - Serveur Restaurant       │
│   - Caissier Restaurant      │
│   - Responsable Restaurant   │
│   - Chef de Cuisine          │
│                              │
└──────────────────────────────┘
```

---

**🚀 PRÊT? ALLEZ-Y!**

1. Ouvrir Supabase
2. Copier `database/RESTAURER_TOUS_LES_ROLES.sql`
3. Exécuter dans SQL Editor
4. Rafraîchir l'application
5. ✅ Vérifier que ça marche!

**Date**: 2 juin 2026  
**Temps estimé**: 1-2 minutes  
**Difficulté**: ⭐ Facile
