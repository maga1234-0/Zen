# ✅ Fonctionnalités Édition/Suppression des Commandes

## 📋 Résumé

Ajout des fonctionnalités d'édition et de suppression pour les commandes du restaurant.

---

## 🎯 Fonctionnalités Implémentées

### 1. Édition de Commande
**Bouton**: "Modifier" (icône ✏️)
- Visible pour: admin, manager, restaurant_manager
- Disponible uniquement pour les commandes non terminées (pas completed/cancelled)

**Ce qu'on peut modifier:**
- Table assignée (pour dine-in)
- Instructions spéciales
- Articles de la commande (optionnel - avancé)
  - Ajouter/supprimer des articles
  - Modifier les quantités
  - Les totaux sont recalculés automatiquement

**Workflow:**
1. Clic sur "Modifier"
2. Modal s'ouvre avec les infos actuelles
3. Modification des champs souhaités
4. Clic "Enregistrer"
5. ✅ Commande mise à jour

### 2. Suppression de Commande
**Bouton**: "Supprimer" (icône 🗑️)
- Visible pour: admin, manager, restaurant_manager
- Disponible pour toutes les commandes
- Confirmation requise avant suppression

**Comportement:**
- Supprime la commande et tous ses articles
- Libère la table si elle était occupée
- Mise à jour automatique des statistiques
- Toast de confirmation

---

## 🔧 Implémentation Technique

### Backend (zen_backend)

#### Nouveaux Endpoints

**1. PUT `/api/restaurant/orders/:id`** - Éditer une commande
```typescript
Body: {
  table_id?: string,
  special_instructions?: string,
  items?: Array<{
    menu_item_id: string,
    item_name: string,
    quantity: number,
    unit_price: number,
    special_instructions?: string
  }>
}
```
- Met à jour les infos de base
- Si `items` fourni: supprime les anciens, insère les nouveaux, recalcule totaux
- Gère le changement de table (libère ancienne, occupe nouvelle)
- Permission: `restaurant.orders.update`

**2. DELETE `/api/restaurant/orders/:id`** - Supprimer une commande
```typescript
Retourne: {
  message: string,
  order_number: string,
  table_freed: boolean
}
```
- Supprime les articles (restaurant_order_items)
- Supprime la commande
- Libère la table si nécessaire
- Permission: `restaurant.orders.delete`

#### Fichiers Modifiés
- `zen_backend/src/controllers/restaurantController.ts`
  - `updateOrder()` - fonction complète d'édition
  - `deleteOrder()` - fonction de suppression avec transaction
- `zen_backend/src/routes/restaurantRoutes.ts`
  - Routes ajoutées avec middleware de permission

### Frontend (client)

#### Nouveau Composant
**`client/src/components/restaurant/EditOrderModal.tsx`**
- Modal Headless UI avec dark mode
- Formulaire complet d'édition
- Sélection de table (filtrée: disponibles + table actuelle)
- Zone de texte pour instructions spéciales
- Gestion avancée des articles (ajouter/supprimer/modifier)
- Auto-completion prix depuis menu
- Boutons Annuler/Enregistrer

#### Fichiers Modifiés
**`client/src/pages/Restaurant.tsx`**
- Import `EditOrderModal`
- States ajoutés:
  ```typescript
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  ```
- Permissions ajoutées:
  ```typescript
  const canUpdateOrder = hasPermission(user.role, 'restaurant.orders.update');
  const canDeleteOrder = hasPermission(user.role, 'restaurant.orders.delete');
  ```
- Mutations ajoutées:
  - `updateOrderMutation` - appelle `PUT /orders/:id`
  - `deleteOrderMutation` - appelle `DELETE /orders/:id`
- Boutons dans la liste des commandes:
  - Bouton "Modifier" (bleu) si `canUpdateOrder` et commande active
  - Bouton "Supprimer" (rouge) si `canDeleteOrder`
- Modal rendu en bas du composant

**`client/src/utils/permissions.ts`**
- Ajout du type: `'restaurant.orders.delete'`
- Permission ajoutée aux rôles:
  - `admin` ✅
  - `manager` ✅
  - `restaurant_manager` ✅
  - `restaurant_chef` ❌
  - `restaurant_server` ❌
  - `restaurant_cashier` ❌

---

## 🔐 Permissions

| Rôle | Éditer Commande | Supprimer Commande |
|------|----------------|-------------------|
| admin | ✅ | ✅ |
| manager | ✅ | ✅ |
| restaurant_manager | ✅ | ✅ |
| restaurant_chef | ❌ | ❌ |
| restaurant_server | ❌ | ❌ |
| restaurant_cashier | ❌ | ❌ |

**Logique métier:**
- Chef peut changer le statut mais pas éditer/supprimer
- Serveur peut créer mais pas éditer/supprimer
- Seuls les managers peuvent modifier ou annuler complètement

---

## 🎨 Interface Utilisateur

### Section Commandes
```
┌─────────────────────────────────────────┐
│ Commande ORD-20260604-0001             │
│ Table 5 - Terrasse                      │
│                                         │
│ Client: Jean Dupont                     │
│ Montant: 45.00€                         │
│                                         │
│ [Commencer] [Modifier] [Supprimer]     │
└─────────────────────────────────────────┘
```

### Boutons
- **Commencer** (Orange) - Change statut → preparing
- **Modifier** (Bleu) - Ouvre modal d'édition
- **Supprimer** (Rouge) - Demande confirmation puis supprime

### Modal d'Édition
```
╔════════════════════════════════════════╗
║ Modifier Commande ORD-20260604-0001   ║
╟────────────────────────────────────────╢
║ Table: [Dropdown]                      ║
║ Table 5 - Terrasse (Cap: 4)           ║
║                                        ║
║ Instructions Spéciales:                ║
║ [Textarea]                             ║
║                                        ║
║ Articles (optionnel):     [+ Ajouter] ║
║ ┌──────────────────────────────────┐  ║
║ │ [Menu Item ▼] [Qté: 1]     [🗑️] │  ║
║ └──────────────────────────────────┘  ║
║                                        ║
║ ℹ️ Statut actuel: pending             ║
║    Pour changer le statut, utilisez   ║
║    les boutons de statut              ║
║                                        ║
║ [Annuler]              [Enregistrer]  ║
╚════════════════════════════════════════╝
```

---

## 📦 Déploiement

### Commits

**Frontend:**
1. `074f6b3` - feat: add edit and delete functionality for restaurant orders
2. `a03c876` - fix: add missing restaurant.orders.delete permission

**Backend:**
1. `2cf5a7d` - feat: add update and delete endpoints for restaurant orders

### Status
- ✅ Frontend: Pushed → Vercel en cours de déploiement
- ✅ Backend: Pushed → Render en cours de déploiement

### URLs
- Frontend: https://zen-lyart.vercel.app
- Backend: https://zen-backend-jzjh.onrender.com

---

## 🧪 Tests à Faire

### Test 1: Édition Basique
1. Se connecter en tant que admin/manager/restaurant_manager
2. Aller dans Restaurant > Commandes
3. Trouver une commande active (pending/preparing)
4. Cliquer "Modifier"
5. Changer la table
6. Modifier les instructions spéciales
7. Cliquer "Enregistrer"
8. ✅ Vérifier que la commande est mise à jour

### Test 2: Édition avec Articles
1. Ouvrir modal d'édition
2. Cliquer "+ Ajouter" dans section Articles
3. Sélectionner un article du menu
4. Définir quantité
5. Cliquer "Enregistrer"
6. ✅ Vérifier que les totaux sont recalculés

### Test 3: Suppression
1. Cliquer "Supprimer" sur une commande
2. Confirmer dans la popup
3. ✅ Vérifier que:
   - Commande disparaît de la liste
   - Table est libérée (si dine-in)
   - Toast de confirmation s'affiche

### Test 4: Permissions
1. Se connecter en tant que restaurant_chef
2. ✅ Vérifier que les boutons "Modifier" et "Supprimer" ne sont PAS visibles

---

## 🐛 Problèmes Connus

### ⚠️ Erreur 500 "Commencer" Toujours Présente
Le bouton "Commencer" donne toujours erreur 500 car la contrainte de base de données n'a pas été modifiée.

**Solution**: Exécuter `database/FIX_ORDER_STATUS_CONSTRAINT.sql` dans Supabase

---

## 📚 Prochaines Étapes

1. ⏳ Attendre fin déploiement Vercel + Render (~5 minutes)
2. 🔧 Exécuter `database/FIX_ORDER_STATUS_CONSTRAINT.sql`
3. ✅ Tester toutes les fonctionnalités
4. 🎉 Fonctionnalités complètes!

---

**Temps total d'implémentation:** ~45 minutes  
**Fichiers créés:** 1 (EditOrderModal.tsx)  
**Fichiers modifiés:** 4 (restaurantController.ts, restaurantRoutes.ts, Restaurant.tsx, permissions.ts)  
**Lignes de code:** ~600
