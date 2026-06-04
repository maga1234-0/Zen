# 🔍 DIAGNOSTIC: TESTER L'API BACKEND

## PROBLÈME

- ✅ Base de données: 10 rôles présents
- ❌ Application: Seulement 4 rôles restaurant affichés
- ❓ Backend API: À vérifier

---

## ÉTAPE 1: Tester l'API Backend directement

### Option A: Dans le navigateur

1. Ouvrir un nouvel onglet
2. Aller sur: `https://zen-backend-jzjh.onrender.com/auth/roles`
3. Vous devriez voir un JSON avec tous les rôles

**Résultat attendu:**
```json
[
  {
    "id": "...",
    "name": "admin",
    "description": "Admin",
    "is_active": true
  },
  {
    "id": "...",
    "name": "manager",
    "description": "Manager",
    "is_active": true
  },
  ...
]
```

### Option B: Vérifier dans Supabase

Exécuter cette requête dans Supabase SQL Editor:

```sql
SELECT id, name, description, is_active 
FROM roles 
WHERE is_active = true 
ORDER BY 
  CASE name
    WHEN 'admin' THEN 1
    WHEN 'manager' THEN 2
    WHEN 'receptionist' THEN 3
    WHEN 'housekeeping' THEN 4
    WHEN 'maintenance' THEN 5
    WHEN 'accountant' THEN 6
    ELSE 99
  END,
  name;
```

**Doit retourner 10 lignes**

---

## ÉTAPE 2: Vérifier le cache du navigateur

1. Ouvrir l'application: https://zen-lyart.vercel.app
2. Appuyer sur **F12** (ouvrir DevTools)
3. Onglet **Console**
4. Exécuter cette commande:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload(true);
   ```

---

## ÉTAPE 3: Vérifier la requête réseau

1. Dans DevTools, aller sur l'onglet **Network**
2. Rafraîchir la page (F5)
3. Chercher la requête `roles` ou `/auth/roles`
4. Cliquer dessus
5. Onglet **Response** → Voir combien de rôles sont retournés

**Questions:**
- Combien de rôles dans la Response?
- Status Code: 200 OK?

---

## ÉTAPE 4: Vérifier la console pour erreurs

Dans DevTools → Console, cherchez des erreurs en rouge comme:
- `Failed to load roles`
- `Network error`
- `CORS error`

---

## SI L'API RETOURNE SEULEMENT 4 RÔLES

Cela signifie que le backend ne voit que les rôles restaurant dans la base.

**Solution: Re-vérifier Supabase**

```sql
-- Compter les rôles actifs
SELECT COUNT(*) FROM roles WHERE is_active = true;
```

Si le résultat est **4** au lieu de **10**, cela signifie que le script n'a pas été complètement exécuté.

**Action: Ré-exécuter le script complet**
1. Ouvrir: `database/RESTAURER_TOUS_LES_ROLES.sql`
2. Tout sélectionner (Ctrl+A)
3. Copier (Ctrl+C)
4. Supabase → SQL Editor → New Query
5. Coller et Run

---

## SI L'API RETOURNE 10 RÔLES MAIS L'APP N'AFFICHE QUE 4

Le problème est dans le frontend (cache ou code).

**Solution 1: Vider le cache complet**
```
1. Chrome/Edge: Ctrl+Shift+Delete
2. Cocher "Cached images and files"
3. Cocher "Cookies and site data"
4. Time range: "All time"
5. Clear data
6. Fermer et rouvrir le navigateur
```

**Solution 2: Mode incognito**
```
1. Ouvrir une fenêtre privée/incognito
2. Aller sur https://zen-lyart.vercel.app
3. Se connecter
4. Tester Staff → Add New Staff
```

---

## DITES-MOI LE RÉSULTAT

**Combien de rôles l'API retourne?**
- [ ] 4 rôles (seulement restaurant)
- [ ] 10 rôles (tous les rôles)
- [ ] Erreur 500
- [ ] Autre: _______

**Après avoir vidé le cache, combien de rôles dans le dropdown?**
- [ ] 4 rôles
- [ ] 10 rôles
- [ ] Aucun rôle
- [ ] Autre: _______
