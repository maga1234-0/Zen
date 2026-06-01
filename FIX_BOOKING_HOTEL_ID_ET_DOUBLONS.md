# ✅ FIX: Erreur hotel_id et problème de doublons

## 🚨 ERREURS CORRIGÉES

### Erreur 1
```
insert or update on table "bookings" violates foreign key constraint "bookings_hotel_id_fkey"
```

### Problème 2
```
Deux personnes peuvent avoir le même nom
Le système réutilisait le même client pour des personnes différentes
```

---

## 🔍 CAUSES

### Cause 1 : hotelId codé en dur
Le code utilisait un `hotelId` codé en dur qui n'existe pas dans Supabase :
```typescript
hotelId: '550e8400-e29b-41d4-a716-446655440000'
```

### Cause 2 : Logique de détection des doublons trop simple
Le système cherchait un client existant par nom :
```typescript
const existingGuest = guestsResponse.data.find((g: any) => {
  return existingFirst === inputFirst && existingLast === inputLast;
});
```

**Problème** : Si deux personnes s'appellent "John Doe", le système réutilise le premier "John Doe" trouvé, même si c'est une personne différente.

---

## ✅ SOLUTIONS APPLIQUÉES

### Solution 1 : Récupération dynamique du hotelId

**Ajout de useQuery pour récupérer les hôtels** :
```typescript
// Get hotel ID dynamically
const { data: hotels } = useQuery({
  queryKey: ['hotels'],
  queryFn: async () => {
    const res = await api.get('/hotels');
    return res.data;
  },
});

const hotelId = hotels?.[0]?.id;
```

**Utilisation du hotelId dynamique** :
```typescript
if (!hotelId) {
  toast.error('Hotel not found. Please contact administrator.');
  return;
}

const payload = {
  hotelId, // Dynamique au lieu de codé en dur
  guestId,
  roomId: bookingData.roomId,
  // ...
};
```

### Solution 2 : Créer un nouveau client à chaque fois

**AVANT** : Cherchait un client existant et le réutilisait
**APRÈS** : Crée toujours un nouveau client

```typescript
// Always create a new guest for each booking to avoid confusion
// Users can merge duplicates later in the Guests page if needed
const guestResponse = await api.post('/guests', {
  firstName: firstName.trim(),
  lastName: lastName.trim() || firstName.trim(),
  phone: '000-000-0000', // Placeholder
  email: `${firstName.toLowerCase().trim()}@placeholder.com`, // Placeholder
});
const guestId = guestResponse.data.id;
toast.info('New guest created. Complete their details in the Guests page.');
```

**Avantages** :
- ✅ Pas de confusion entre deux personnes avec le même nom
- ✅ Chaque réservation a son propre client
- ✅ L'utilisateur peut fusionner les doublons manuellement plus tard dans la page Guests

---

## 📤 POUSSÉ SUR GITHUB

- ✅ Commit : `Fix: Récupérer hotelId dynamiquement et créer nouveau guest à chaque réservation`
- ✅ Poussé sur : https://github.com/maga1234-0/Zen
- ⏳ Vercel va redéployer automatiquement (2-3 minutes)

---

## ⏱️ TEMPS D'ATTENTE

```
Vercel (Frontend) : 2-3 minutes
```

---

## 🧪 TEST APRÈS REDÉPLOIEMENT

1. **Attendre** : 3 minutes
2. **Ouvrir** : https://zen-lyart.vercel.app/bookings
3. **Cliquer** : "New Booking"
4. **Remplir** :
   - Guest Name : Joe Mukendi
   - Room : Sélectionner une chambre disponible
   - Check-in Date : 02/06/2026
   - Check-out Date : 05/06/2026
   - Number of Guests : 1
5. **Cliquer** : "Create Booking"
6. **Vérifier** : 
   - ✅ Message "Booking created successfully!"
   - ✅ Message "New guest created. Complete their details in the Guests page."
   - ✅ Pas d'erreur 500

---

## 💡 COMMENT ÇA FONCTIONNE MAINTENANT

### Scénario 1 : Première réservation pour "John Doe"
1. Utilisateur entre "John Doe"
2. Système crée un nouveau client "John Doe" (ID: abc123)
3. Réservation créée avec ce client
4. Message : "New guest created"

### Scénario 2 : Deuxième réservation pour "John Doe" (personne différente)
1. Utilisateur entre "John Doe" (une autre personne)
2. Système crée un **nouveau** client "John Doe" (ID: def456)
3. Réservation créée avec ce nouveau client
4. Message : "New guest created"

**Résultat** : Deux clients "John Doe" distincts, pas de confusion !

### Gestion des doublons

Si l'utilisateur réalise plus tard que les deux "John Doe" sont la même personne :
1. Aller dans la page **Guests**
2. Compléter les informations (téléphone, email, adresse)
3. Fusionner manuellement les doublons si nécessaire

---

## 📋 CHECKLIST

- [x] Erreur hotel_id identifiée
- [x] Problème doublons identifié
- [x] Code corrigé (hotelId dynamique)
- [x] Code corrigé (nouveau guest à chaque fois)
- [x] Commit créé
- [x] Poussé sur GitHub
- [ ] Attendre 3 minutes (Vercel)
- [ ] Rafraîchir la page
- [ ] Tester la création de réservation

---

## 🎯 RÉSULTAT ATTENDU

Après le redéploiement (3 minutes) :
- ✅ Plus d'erreur "bookings_hotel_id_fkey"
- ✅ Création de réservation fonctionne
- ✅ Chaque réservation crée un nouveau client
- ✅ Pas de confusion entre personnes avec le même nom
- ✅ Possibilité de compléter les infos dans la page Guests

---

## 📝 NOTES IMPORTANTES

### Pourquoi créer un nouveau client à chaque fois ?

**Problème avec l'ancienne méthode** :
- John Doe (client 1) fait une réservation
- Jane Smith (client 2) fait une réservation
- John Doe (client 3, personne différente) fait une réservation
- ❌ Le système réutilise le client 1, même si c'est une personne différente !

**Avantage de la nouvelle méthode** :
- Chaque réservation = nouveau client
- Pas de confusion
- L'utilisateur peut fusionner les doublons manuellement plus tard

### Gestion des informations

Les informations placeholder peuvent être complétées dans la page **Guests** :
- Téléphone réel
- Email réel
- Adresse
- Date de naissance
- Etc.

---

**⏱️ DANS 3 MINUTES, L'ERREUR SERA CORRIGÉE !** ⚡

**🔄 RAFRAÎCHISSEZ LA PAGE APRÈS 3 MINUTES !** 🔍

**🧪 TESTEZ LA CRÉATION DE RÉSERVATION !** 📅

**👥 CHAQUE RÉSERVATION CRÉE UN NOUVEAU CLIENT !** ✨
