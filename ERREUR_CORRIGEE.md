# ✅ ERREUR CORRIGÉE - Script prêt à utiliser

## 🐛 Erreur rencontrée

```
ERROR: 42883: function max(uuid) does not exist
HINT: No function matches the given name and argument types.
```

**Cause**: PostgreSQL ne peut pas utiliser la fonction `MAX()` sur des colonnes de type UUID.

## ✅ Correction appliquée

Le script `database/SETUP_INITIAL_DATA.sql` a été corrigé :

**Avant** (incorrect):
```sql
SELECT COUNT(*), MAX(id), MAX(name) 
INTO hotel_count, hotel_id_var, hotel_name_var
FROM hotels;
```

**Après** (correct):
```sql
SELECT COUNT(*) INTO hotel_count FROM hotels;

IF hotel_count > 0 THEN
    SELECT id, name INTO hotel_id_var, hotel_name_var 
    FROM hotels 
    LIMIT 1;
END IF;
```

## 🚀 Action immédiate

Le script est maintenant corrigé et prêt à utiliser !

### Étapes:

1. **Ouvrir** Supabase SQL Editor
2. **Copier** TOUT le contenu de `database/SETUP_INITIAL_DATA.sql` (version corrigée)
3. **Coller** dans SQL Editor
4. **Cliquer** RUN
5. **Attendre** les messages de confirmation

**Résultat attendu**:
```
✅ 1 hôtel créé
✅ 24 types de chambres créés
✅ 1 utilisateur admin créé
```

## 📁 Fichier corrigé

- ✅ `database/SETUP_INITIAL_DATA.sql` - Version corrigée (sans erreur MAX)
- ✅ Poussé sur GitHub (commit: cb97ddb)

## 🎯 Prochaine étape

**Réessayez maintenant !** Le script devrait fonctionner parfaitement.

1. Copier le contenu de `database/SETUP_INITIAL_DATA.sql`
2. Coller dans Supabase SQL Editor
3. Cliquer RUN
4. Vérifier les messages de succès

**Tout devrait fonctionner maintenant !** 🚀

---

**Note**: Si vous aviez déjà exécuté une partie du script avant l'erreur, le script supprime automatiquement les anciennes données avant de recréer, donc pas de problème de doublons.
