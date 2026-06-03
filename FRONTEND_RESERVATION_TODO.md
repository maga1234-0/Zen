# 🎯 Frontend Réservations - À Terminer

## ✅ Ce Qui Est Fait

### 1. Modal de Modification Créé
**Fichier** : `client/src/components/restaurant/EditReservationModal.tsx`

**Fonctionnalités** :
- ✅ Form complet pour modifier tous les champs
- ✅ Sélection du statut avec badges colorés
- ✅ Date/heure picker
- ✅ Sélection de la table
- ✅ Champs guest_name, phone, email
- ✅ Nombre de convives et durée
- ✅ Demandes spéciales
- ✅ Validation des champs requis
- ✅ État de chargement

## ⏳ Ce Qu'Il Reste à Faire

### 1. Intégrer le Modal dans Restaurant.tsx (30 min)

Ajouter en haut du fichier `Restaurant.tsx` :

```tsx
import EditReservationModal from '../components/restaurant/EditReservationModal';
```

Ajouter les states :

```tsx
const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
```

Ajouter les handlers :

```tsx
const handleEditReservation = (reservation: Reservation) => {
  setEditingReservation(reservation);
  setIsEditModalOpen(true);
};

const handleSaveReservation = async (id: string, data: Partial<Reservation>) => {
  try {
    await api.put(`/restaurant/reservations/${id}`, data);
    toast.success('Réservation modifiée avec succès');
    refetchReservations();
  } catch (error) {
    toast.error('Erreur lors de la modification');
    throw error;
  }
};

const handleMarkArrived = async (id: string) => {
  try {
    await api.put(`/restaurant/reservations/${id}`, {
      status: 'seated'
    });
    toast.success('Client marqué comme arrivé');
    refetchReservations();
  } catch (error) {
    toast.error('Erreur lors du marquage');
  }
};

const handleDeleteReservation = async (id: string, guestName: string) => {
  if (!confirm(`Supprimer la réservation de ${guestName} ?`)) return;
  
  try {
    await api.delete(`/restaurant/reservations/${id}`);
    toast.success('Réservation supprimée');
    refetchReservations();
  } catch (error) {
    toast.error('Erreur lors de la suppression');
  }
};
```

### 2. Ajouter les Boutons d'Action (20 min)

Dans la section Réservations, trouver le tableau et ajouter une colonne Actions :

```tsx
<table className="min-w-full">
  <thead>
    <tr>
      <th>Client</th>
      <th>Date</th>
      <th>Heure</th>
      <th>Convives</th>
      <th>Table</th>
      <th>Statut</th>
      <th>Actions</th> {/* NOUVELLE COLONNE */}
    </tr>
  </thead>
  <tbody>
    {reservations.map(reservation => (
      <tr key={reservation.id}>
        <td>{reservation.guest_name}</td>
        <td>{formatDate(reservation.reservation_date)}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.number_of_guests}</td>
        <td>{reservation.table_number}</td>
        <td>
          <span className={getStatusBadgeClass(reservation.status)}>
            {getStatusLabel(reservation.status)}
          </span>
        </td>
        <td className="flex gap-2"> {/* NOUVELLE CELLULE */}
          {/* Bouton Modifier */}
          <button
            onClick={() => handleEditReservation(reservation)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          {/* Bouton Arrivé (seulement si confirmed) */}
          {reservation.status === 'confirmed' && (
            <button
              onClick={() => handleMarkArrived(reservation.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
              title="Marquer comme arrivé"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          
          {/* Bouton Supprimer (sauf si completed) */}
          {reservation.status !== 'completed' && (
            <button
              onClick={() => handleDeleteReservation(reservation.id, reservation.guest_name)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### 3. Ajouter le Modal Avant le Closing Tag (5 min)

À la fin du component Restaurant, avant le `return` final :

```tsx
return (
  <div>
    {/* ... tout le contenu existant ... */}
    
    {/* Modal de modification */}
    <EditReservationModal
      isOpen={isEditModalOpen}
      onClose={() => {
        setIsEditModalOpen(false);
        setEditingReservation(null);
      }}
      reservation={editingReservation}
      tables={tables}
      onSave={handleSaveReservation}
    />
  </div>
);
```

### 4. Ajouter les Imports Manquants (5 min)

En haut de Restaurant.tsx :

```tsx
import { Edit, Check, Trash2 } from 'lucide-react';
```

### 5. Ajouter Badges pour Commandes Internes (10 min)

Dans la section Commandes, ajouter après le numéro de commande :

```tsx
<div className="flex items-center gap-2">
  <span>#{order.order_number}</span>
  
  {/* Badge Interne */}
  {order.order_type === 'room_service' && (
    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
      Interne
    </span>
  )}
  
  {/* Chambre */}
  {order.room_number && (
    <span className="text-sm text-gray-600">
      Chambre {order.room_number}
    </span>
  )}
  
  {/* Badge Facturé */}
  {order.payment_status === 'charged_to_room' && (
    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
      Facturé à la chambre
    </span>
  )}
</div>
```

## 📝 Helpers Utiles

Ajouter ces fonctions helper dans Restaurant.tsx :

```tsx
const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs',
    confirmed: 'px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs',
    seated: 'px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs',
    completed: 'px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs',
    cancelled: 'px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs',
    no_show: 'px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs',
  };
  return classes[status] || '';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    seated: 'Assis',
    completed: 'Terminée',
    cancelled: 'Annulée',
    no_show: 'Absent',
  };
  return labels[status] || status;
};
```

## 🧪 Tests à Faire

Une fois l'intégration terminée :

1. **Test Modification** :
   - Cliquer sur ✏️ sur une réservation
   - Modifier l'heure
   - Sauvegarder
   - Vérifier que la réservation est mise à jour

2. **Test Arrivé** :
   - Cliquer sur ✅ sur une réservation confirmée
   - Vérifier que le statut passe à "Assis"
   - Vérifier dans la table `table_reservations` que `arrived_at` est défini

3. **Test Suppression** :
   - Cliquer sur 🗑️
   - Confirmer
   - Vérifier que la réservation disparaît

4. **Test Badges Commandes** :
   - Créer une commande room_service
   - Vérifier que le badge "Interne" apparaît
   - Vérifier que "Chambre XXX" s'affiche

## 📦 Commit et Déploiement

Une fois terminé :

```bash
cd c:\Users\aubin\Downloads\kiro1
git add client/src/components/restaurant/EditReservationModal.tsx
git add client/src/pages/Restaurant.tsx
git commit -m "feat: add reservation management UI with edit/delete/arrived actions"
git push origin main
```

Vercel déploiera automatiquement en 2-3 minutes.

## 📊 Temps Estimé

- ✅ Modal créé : Fait
- ⏳ Intégration dans Restaurant.tsx : 30 min
- ⏳ Boutons d'action : 20 min
- ⏳ Badges commandes : 10 min
- ⏳ Tests : 20 min

**Total** : ~1h20

---

**Fichier créé** : `client/src/components/restaurant/EditReservationModal.tsx` ✅  
**Prochaine action** : Intégrer le modal dans Restaurant.tsx
