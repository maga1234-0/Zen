# ⚡ ACTION URGENTE MAINTENANT

## 🚨 PROBLÈME ACTUEL

La création de réservation ne fonctionne toujours pas car **aucun hôtel n'existe dans Supabase**.

---

## ✅ SOLUTION (2 MINUTES)

### 1. Ouvrir Supabase
https://supabase.com/dashboard

### 2. SQL Editor → New query

### 3. Copier-coller ce script

```sql
DO $$
DECLARE
    hotel_count INTEGER;
    new_hotel_id UUID;
BEGIN
    SELECT COUNT(*) INTO hotel_count FROM hotels;
    
    IF hotel_count = 0 THEN
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
        
        UPDATE rooms SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = rooms.hotel_id);
        
        UPDATE bookings SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = bookings.hotel_id);
        
        RAISE NOTICE 'Hotel cree avec succes';
    ELSE
        SELECT id INTO new_hotel_id FROM hotels ORDER BY created_at LIMIT 1;
        
        UPDATE rooms SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = rooms.hotel_id);
        
        UPDATE bookings SET hotel_id = new_hotel_id
        WHERE NOT EXISTS (SELECT 1 FROM hotels h WHERE h.id = bookings.hotel_id);
        
        RAISE NOTICE 'Donnees mises a jour';
    END IF;
END $$;
```

### 4. Cliquer "Run" (F5)

### 5. Tester immédiatement
https://zen-lyart.vercel.app/bookings

---

## 📋 CHECKLIST

- [ ] Ouvrir Supabase
- [ ] SQL Editor → New query
- [ ] Copier-coller le script
- [ ] Run (F5)
- [ ] Tester création réservation

---

## 🎯 APRÈS LE SCRIPT

1. ✅ Un hôtel existe dans Supabase
2. ✅ Toutes les chambres ont un hotel_id valide
3. ✅ Toutes les réservations ont un hotel_id valide
4. ✅ La création de réservation fonctionne

---

## ⏰ PUIS ATTENDRE 3 MINUTES

Le Dashboard sera en temps réel après le déploiement Vercel (3 minutes).

---

**⚡ EXÉCUTEZ LE SCRIPT MAINTENANT !**

**🧪 TESTEZ IMMÉDIATEMENT APRÈS !**

**⏰ PUIS ATTENDEZ 3 MIN POUR LE DASHBOARD !**
