# 🔧 SOLUTION : Problème hotel_id dans la base de données

## 🚨 PROBLÈME

```
Error: insert or update on table "bookings" violates foreign key constraint "bookings_hotel_id_fkey"
```

**Cause** : Aucun hôtel n'existe dans la table `hotels` de Supabase, ou le `hotel_id` récupéré n'est pas valide.

---

## ✅ SOLUTION : Exécuter le script SQL

### Étape 1 : Ouvrir Supabase

1. **Ouvrir** : https://supabase.com/dashboard
2. **Sélectionner** : Votre projet
3. **Cliquer** : "SQL Editor" (menu gauche)
4. **Cliquer** : "New query"

### Étape 2 : Copier-coller le script

**Fichier** : `database/FIX_HOTEL_ID_PROBLEM.sql`

**Ou copier directement** :

```sql
-- Vérifier si un hôtel existe
DO $$
DECLARE
    hotel_count INTEGER;
    new_hotel_id UUID;
BEGIN
    SELECT COUNT(*) INTO hotel_count FROM hotels;
    
    IF hotel_count = 0 THEN
        -- Créer un hôtel par défaut
        INSERT INTO hotels (
            id, name, address, city, country, phone, email, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            'Zen Hotel',
            '123 Main Street',
            'Kinshasa',
            'RDC',
            '+243 123 456 789',
            'contact@zenhotel.com',
            NOW(),
            NOW()
        )
        RETURNING id INTO new_hotel_id;
        
        RAISE NOTICE 'Hôtel créé avec succès';
        
        -- Mettre à jour les chambres orphelines
        UPDATE rooms SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = rooms.hotel_id);
        
        -- Mettre à jour les réservations orphelines
        UPDATE bookings SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = bookings.hotel_id);
    ELSE
        -- Utiliser le premier hôtel existant
        SELECT id INTO new_hotel_id FROM hotels ORDER BY created_at LIMIT 1;
        
        -- Mettre à jour les données orphelines
        UPDATE rooms SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = rooms.hotel_id);
        
        UPDATE bookings SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = bookings.hotel_id);
    END IF;
END $$;
```

### Étape 3 : Exécuter

1. **Cliquer** : "Run" (ou appuyer sur F5)
2. **Vérifier** : Message de succès

---

## 🧪 TESTER IMMÉDIATEMENT

**Pas besoin d'attendre un déploiement !** Le problème est dans la base de données, pas dans le code.

1. **Ouvrir** : https://zen-lyart.vercel.app/bookings
2. **Rafraîchir** : Ctrl+Shift+R
3. **Cliquer** : "New Booking"
4. **Remplir** : Informations de réservation
5. **Cliquer** : "Create Booking"
6. **Vérifier** : ✅ Message "Booking created successfully!"

---

## 💡 CE QUE FAIT LE SCRIPT

### Si aucun hôtel n'existe
1. ✅ Crée un hôtel "Zen Hotel"
2. ✅ Met à jour toutes les chambres orphelines
3. ✅ Met à jour toutes les réservations orphelines

### Si un hôtel existe déjà
1. ✅ Utilise le premier hôtel trouvé
2. ✅ Met à jour les données orphelines avec cet hôtel

---

## 📋 CHECKLIST

- [ ] Ouvrir Supabase SQL Editor
- [ ] Copier-coller le script
- [ ] Exécuter le script (F5)
- [ ] Vérifier le message de succès
- [ ] Tester la création de réservation
- [ ] Vérifier que ça fonctionne

---

## 🔍 VÉRIFICATION

Pour vérifier que tout est OK, exécutez cette requête dans Supabase :

```sql
-- Vérifier les hôtels
SELECT * FROM hotels;

-- Vérifier les chambres orphelines (doit retourner 0)
SELECT COUNT(*) FROM rooms r
WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = r.hotel_id);

-- Vérifier les réservations orphelines (doit retourner 0)
SELECT COUNT(*) FROM bookings b
WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = b.hotel_id);
```

**Résultat attendu** :
- ✅ Au moins 1 hôtel
- ✅ 0 chambres orphelines
- ✅ 0 réservations orphelines

---

## 🎯 RÉSULTAT ATTENDU

Après l'exécution du script :
- ✅ Un hôtel existe dans la base de données
- ✅ Toutes les chambres ont un `hotel_id` valide
- ✅ Toutes les réservations ont un `hotel_id` valide
- ✅ La création de réservation fonctionne
- ✅ Plus d'erreur `bookings_hotel_id_fkey`

---

## 📝 NOTES IMPORTANTES

### Pourquoi ce problème ?

Le script `SETUP_INITIAL_DATA.sql` que vous avez exécuté précédemment créait un hôtel avec un ID spécifique. Mais si ce script n'a pas été exécuté, ou si l'hôtel a été supprimé, la table `hotels` est vide.

### Solution permanente

Ce script :
1. Vérifie si un hôtel existe
2. En crée un si nécessaire
3. Corrige toutes les données orphelines

### Modification des informations de l'hôtel

Après l'exécution du script, vous pouvez modifier les informations de l'hôtel dans Supabase :
- Nom
- Adresse
- Téléphone
- Email
- Etc.

---

**🔧 EXÉCUTEZ LE SCRIPT MAINTENANT !** ⚡

**🧪 PUIS TESTEZ IMMÉDIATEMENT !** 📅

**✅ PAS BESOIN D'ATTENDRE UN DÉPLOIEMENT !** 🚀
