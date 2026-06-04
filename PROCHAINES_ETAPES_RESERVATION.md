# 🎯 Prochaines Étapes - Intégration Réservations

## ✅ Ce Qui Est Fait

1. **Modal EditReservationModal créé** ✅
   - Fichier: `client/src/components/restaurant/EditReservationModal.tsx`
   - Formulaire complet avec tous les champs
   - Sélection de statut avec badges colorés
   - Validation et loading state

2. **Package @headlessui/react installé** ✅
   - Commit: `ac22668`
   - Déploiement Vercel en cours

3. **Backend API prêt** ✅
   - `PUT /api/restaurant/reservations/:id` - Modifier réservation
   - `DELETE /api/restaurant/reservations/:id` - Supprimer réservation
   - Déployé sur Render

4. **Triggers SQL créés** ⏳ (pas encore exécutés)
   - Fichier: `database/RESTAURANT_AUTOMATION_TRIGGERS.sql`
   - Automatisation statut tables
   - Ajout automatique commandes internes à facture

---

## 📋 Ce Qu'il Reste à Faire

### ÉTAPE 1: Intégrer le Modal dans Restaurant.tsx (~30 min)

#### 1.1 Ajouter l'import
```tsx
import EditReservationModal from '@/components/restaurant/EditReservationModal';
import { Check } from 'lucide-react';
```

#### 1.2 Ajouter les states (après les autres states)
```tsx
const [editingReservation, setEditingReservation] = useState<any>(null);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
```

#### 1.3 Ajouter les handlers (après les autres mutations)
```tsx
// Handlers pour réservations
const handleEditReservation = (reservation: any) => {
  setEditingReservation(reservation);
  setIsEditModalOpen(true);
};

const handleSaveReservation = async (id: string, data: any) => {
  try {
    await api.put(`/restaurant/reservations/${id}`, data);
    queryClient.invalidateQueries({ queryKey: ['table-reservations'] });
    queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
    toast.success('Réservation modifiée avec succès');
    setIsEditModalOpen(false);
    setEditingReservation(null);
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    throw error;
  }
};

const handleMarkArrived = async (id: string) => {
  try {
    await api.put(`/restaurant/reservations/${id}`, { status: 'seated' });
    queryClient.invalidateQueries({ queryKey: ['table-reservations'] });
    queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
    toast.success('Client marqué comme arrivé');
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erreur');
  }
};

const handleDeleteReservation = async (id: string, guestName: string) => {
  if (!confirm(`Supprimer la réservation de ${guestName} ?`)) return;
  
  try {
    await api.delete(`/restaurant/reservations/${id}`);
    queryClient.invalidateQueries({ queryKey: ['table-reservations'] });
    queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
    toast.success('Réservation supprimée');
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
  }
};

// Helper functions
const getReservationStatusBadge = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium',
    confirmed: 'px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium',
    seated: 'px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium',
    completed: 'px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium',
    cancelled: 'px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium',
    no_show: 'px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium',
  };
  return classes[status] || classes.pending;
};

const getReservationStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    seated: 'Client assis',
    completed: 'Terminée',
    cancelled: 'Annulée',
    no_show: 'Absent',
  };
  return labels[status] || status;
};
```

#### 1.4 Trouver la section Réservations et modifier le tableau

Chercher dans le code la partie où les réservations sont affichées (probablement dans un `<table>`), et ajouter une colonne Actions:

```tsx
<thead>
  <tr>
    <th>Client</th>
    <th>Contact</th>
    <th>Date & Heure</th>
    <th>Convives</th>
    <th>Table</th>
    <th>Statut</th>
    <th>Actions</th> {/* NOUVELLE COLONNE */}
  </tr>
</thead>
<tbody>
  {reservations?.map((reservation: any) => (
    <tr key={reservation.id}>
      <td>{reservation.guest_name}</td>
      <td>{reservation.guest_phone}</td>
      <td>
        {new Date(reservation.reservation_date).toLocaleDateString('fr-FR')}
        {' à '}
        {reservation.reservation_time}
      </td>
      <td>{reservation.number_of_guests}</td>
      <td>Table {reservation.table_number || '-'}</td>
      <td>
        <span className={getReservationStatusBadge(reservation.status)}>
          {getReservationStatusLabel(reservation.status)}
        </span>
      </td>
      <td> {/* NOUVELLE CELLULE */}
        <div className="flex gap-2">
          {/* Bouton Modifier */}
          <button
            onClick={() => handleEditReservation(reservation)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          {/* Bouton Arrivé (seulement si confirmed) */}
          {reservation.status === 'confirmed' && (
            <button
              onClick={() => handleMarkArrived(reservation.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Marquer comme arrivé"
            >
              <Check className="h-5 w-5" />
            </button>
          )}
          
          {/* Bouton Supprimer (sauf si completed) */}
          {reservation.status !== 'completed' && (
            <button
              onClick={() => handleDeleteReservation(reservation.id, reservation.guest_name)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  ))}
</tbody>
```

#### 1.5 Ajouter le Modal avant le closing tag du component

Tout à la fin du `return`, avant le `</div>` final:

```tsx
      {/* Modal de modification de réservation */}
      <EditReservationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingReservation(null);
        }}
        reservation={editingReservation}
        tables={tables || []}
        onSave={handleSaveReservation}
      />
    </div>
  );
};
```

---

### ÉTAPE 2: Ajouter Badges pour Commandes Internes (~10 min)

Dans la section où les commandes sont affichées, modifier l'affichage du numéro de commande:

```tsx
<div className="flex items-center gap-2 flex-wrap">
  <span className="font-medium">#{order.order_number}</span>
  
  {/* Badge Interne */}
  {order.order_type === 'room_service' && (
    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
      🏨 Interne
    </span>
  )}
  
  {/* Numéro de chambre */}
  {order.room_number && (
    <span className="text-sm text-gray-600 dark:text-slate-400">
      Chambre {order.room_number}
    </span>
  )}
  
  {/* Badge Facturé à la chambre */}
  {order.payment_status === 'charged_to_room' && (
    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
      ✓ Facturé
    </span>
  )}
</div>
```

---

### ÉTAPE 3: Exécuter les Triggers SQL (~5 min)

1. Ouvrir Supabase SQL Editor
2. Copier-coller le contenu de `database/RESTAURANT_AUTOMATION_TRIGGERS.sql`
3. Exécuter le script
4. Vérifier les messages de succès

---

### ÉTAPE 4: Commit et Push (~5 min)

```bash
cd c:\Users\aubin\Downloads\kiro1
git add client/src/pages/Restaurant.tsx
git commit -m "feat: integrate reservation management with edit/delete/arrived actions"
git push origin main
```

---

## 🧪 Tests à Effectuer Après Déploiement

### Test 1: Modification de Réservation
1. Aller dans Restaurant > Réservations
2. Cliquer sur ✏️ sur une réservation
3. Modifier l'heure de 18:00 à 19:00
4. Cliquer "Enregistrer"
5. **Attendu**: Réservation mise à jour, toast de succès

### Test 2: Marquer Arrivé
1. Trouver une réservation avec statut "Confirmée"
2. Cliquer sur ✅
3. **Attendu**: Statut passe à "Client assis", table passe à "occupied"

### Test 3: Suppression
1. Cliquer sur 🗑️ sur une réservation
2. Confirmer
3. **Attendu**: Réservation supprimée, table libérée

### Test 4: Commandes Internes
1. Créer une commande room_service pour la chambre 101
2. **Attendu**: Badges "🏨 Interne" et "Chambre 101" affichés
3. Vérifier dans la table `payments` que la commande est ajoutée automatiquement

### Test 5: Automatisation Table Status
1. Créer une réservation pour une table
2. Marquer comme "Confirmée"
3. **Attendu**: Table passe à "reserved"
4. Marquer comme "Client assis"
5. **Attendu**: Table passe à "occupied"

---

## 📊 Temps Estimé

- ✅ Modal créé: **Fait**
- ✅ Package installé: **Fait**
- ⏳ Intégration Restaurant.tsx: **30 min**
- ⏳ Badges commandes: **10 min**
- ⏳ Exécuter SQL: **5 min**
- ⏳ Tests: **20 min**

**TOTAL RESTANT**: ~1h05

---

## 🎯 Priorité

1. **URGENT**: Attendre que Vercel finisse le déploiement (2-3 min)
2. **MAINTENANT**: Intégrer le modal dans Restaurant.tsx
3. **ENSUITE**: Ajouter les badges pour commandes internes
4. **APRÈS**: Exécuter les triggers SQL
5. **FINAL**: Tests end-to-end

---

## 📝 Notes Importantes

- Le modal utilise `@headlessui/react` qui est maintenant installé
- Les endpoints backend sont déjà déployés sur Render
- Les triggers SQL permettront l'automatisation complète
- Tout est prêt côté backend, il ne reste que le frontend

---

**Status**: 🟡 En cours - Déploiement Vercel en cours
**Prochaine action**: Intégrer le modal dans Restaurant.tsx dès que Vercel a terminé
