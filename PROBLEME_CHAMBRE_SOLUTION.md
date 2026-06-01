# ⚡ PROBLÈME CHAMBRE - SOLUTION IMMÉDIATE

## 🚨 ERREUR

Erreur 500 lors de la création d'une chambre

---

## ✅ SOLUTION (2 ÉTAPES - 5 MINUTES)

### ÉTAPE 1 : Diagnostic (2 min)

**Exécuter ce script dans Supabase** :

1. Ouvrir : https://supabase.com/dashboard → SQL Editor
2. Copier-coller : `database/DIAGNOSTIC_CHAMBRES.sql`
3. Cliquer : Run
4. Lire le résumé

---

### ÉTAPE 2 : Selon le résultat

#### Si "❌ Aucun hôtel" ou "❌ Aucun type"

**Exécuter le script d'initialisation** :

1. New query dans Supabase
2. Copier-coller : `database/SETUP_INITIAL_DATA.sql`
3. Cliquer : Run
4. Attendre 30 secondes
5. Retester la création de chambre

#### Si "✅ TOUT EST PRÊT"

**Vérifier le backend** :

1. Ouvrir : https://dashboard.render.com
2. Vérifier : `zen-backend-jzjh` est "Live"
3. Si pas Live : Attendre 5 minutes
4. Retester la création de chambre

---

## 🧪 TESTS RAPIDES

Ouvrir ces 3 URLs dans le navigateur :

1. https://zen-backend-jzjh.onrender.com/api/health
   → Doit retourner `{"status":"ok"}`

2. https://zen-backend-jzjh.onrender.com/api/rooms/types
   → Doit retourner 24 types de chambres

3. https://zen-backend-jzjh.onrender.com/api/rooms
   → Doit retourner `[]` ou une liste

---

## 📋 CHECKLIST

- [ ] Exécuter `DIAGNOSTIC_CHAMBRES.sql`
- [ ] Si nécessaire, exécuter `SETUP_INITIAL_DATA.sql`
- [ ] Tester les 3 URLs ci-dessus
- [ ] Vérifier que Render est "Live"
- [ ] Retester la création de chambre

---

## 📞 LIENS

- **Supabase** : https://supabase.com/dashboard
- **Render** : https://dashboard.render.com
- **Frontend** : https://zen-lyart.vercel.app/rooms

---

## 📖 GUIDES DÉTAILLÉS

- `REPARER_CREATION_CHAMBRE.md` - Guide complet
- `ERREUR_CREATION_CHAMBRE.md` - Diagnostic détaillé

---

**🚀 COMMENCEZ PAR LE DIAGNOSTIC !** ⚡
