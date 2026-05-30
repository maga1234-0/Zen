# ⚡ Démarrage rapide - Réservation en ligne

## 🚀 Installation en 3 étapes (5 minutes)

### 1️⃣ Base de données (Supabase)
```sql
-- Copier et exécuter dans Supabase SQL Editor:
-- Fichier: database/online-booking-module.sql
```
✅ Crée 6 tables + fonctions + données initiales

### 2️⃣ Backend (Render)
```bash
# Le code est déjà pushé sur GitHub
# Juste redéployer sur Render
```
✅ 15 endpoints API disponibles

### 3️⃣ Frontend (Vercel)
```bash
# Vercel déploie automatiquement depuis GitHub
# Ou cliquer sur "Redeploy"
```
✅ Page `/book` accessible

---

## 🎯 Accès rapide

### Page publique
```
https://votre-app.vercel.app/book
```

### API publique
```
GET  /api/online-booking/public/availability?check_in=2026-06-01&check_out=2026-06-05
POST /api/online-booking/public/bookings
POST /api/online-booking/public/validate-promo
```

### API admin (authentification requise)
```
GET  /api/online-booking/admin/bookings
GET  /api/online-booking/admin/stats
POST /api/online-booking/admin/bookings/:id/convert
```

---

## 📋 Codes promo inclus

| Code | Réduction | Conditions |
|------|-----------|------------|
| `WELCOME10` | 10% | Min 2 nuits |
| `SUMMER2026` | 15% | Min 3 nuits, été 2026 |
| `LONGSTAY` | 20% | Min 7 nuits |

---

## 🔧 Configuration rapide

### Modifier les paramètres
```sql
UPDATE online_booking_settings SET
  deposit_percentage = 50.00,  -- Acompte 50%
  cancellation_hours = 48;     -- Annulation 48h avant
```

### Créer un code promo
```sql
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_nights, valid_from, valid_until)
VALUES ('PROMO2026', 'Promotion spéciale', 'percentage', 20.00, 2, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year');
```

### Désactiver temporairement
```sql
UPDATE online_booking_settings SET is_enabled = false;
```

---

## 📊 Statistiques rapides

```sql
-- Voir toutes les réservations
SELECT * FROM v_online_bookings_summary ORDER BY created_at DESC;

-- Statistiques
SELECT * FROM v_online_booking_stats;

-- Réservations en attente
SELECT * FROM online_bookings WHERE status = 'pending';
```

---

## 🧪 Test rapide

1. Aller sur `/book`
2. Sélectionner dates: demain → dans 3 jours
3. Choisir une chambre
4. Remplir: Test User, test@example.com, +33612345678
5. Code promo: `WELCOME10`
6. Confirmer → Recevoir référence REF-YYYYMMDD-XXXX

---

## 📚 Documentation complète

- **Guide complet**: `ONLINE_BOOKING_MODULE.md`
- **Installation**: `SETUP_ONLINE_BOOKING.md`
- **Résumé**: `ONLINE_BOOKING_COMPLETE.md`
- **Session**: `SESSION_SUMMARY.md`

---

## 🆘 Aide rapide

### Problème: Pas de chambres disponibles
```sql
SELECT type, COUNT(*) FROM rooms GROUP BY type;
```

### Problème: Code promo ne marche pas
```sql
SELECT * FROM promo_codes WHERE code = 'WELCOME10';
```

### Problème: Page /book ne s'affiche pas
1. Vider cache navigateur (Ctrl+Shift+R)
2. Vérifier console navigateur (F12)
3. Vérifier que backend est accessible

---

## ✅ Checklist

- [ ] SQL exécuté dans Supabase
- [ ] Backend redéployé sur Render
- [ ] Frontend redéployé sur Vercel
- [ ] Page /book accessible
- [ ] Test de réservation réussi
- [ ] Réservation visible dans Supabase

---

## 🎉 C'est prêt !

Votre système de réservation en ligne est opérationnel !

**URL**: https://votre-app.vercel.app/book

---

**Version**: 1.0.0  
**Commits**: 4df6cb0, 2e42dc4, ddf4797, dbd29f3  
**Date**: 30 Mai 2026
