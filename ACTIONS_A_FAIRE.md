# ✅ ACTIONS À FAIRE MAINTENANT - LISTE COMPLÈTE

## 🎯 VOUS ÊTES ICI

Tous les fichiers sont **prêts localement** sur votre PC.  
Il faut maintenant les **copier sur GitHub** pour déployer.

---

## 📋 ACTIONS DÉTAILLÉES

### ▶️ ACTION 1: BACKEND - Fichier 1

**📍 Où**: https://github.dev/maga1234-0/zen_backend-

**📝 Créer**: `src/controllers/guestInvoiceController.ts`

**📂 Copier depuis**:
```
C:\Users\aubin\Downloads\kiro1\zen_backend\src\controllers\guestInvoiceController.ts
```

**🔧 Comment**:
1. Clic droit sur dossier `controllers`
2. "New File..."
3. Nom: `guestInvoiceController.ts`
4. Ouvrir fichier PC avec Notepad
5. Ctrl+A → Ctrl+C
6. Retour GitHub → Ctrl+V
7. Ctrl+S

**✅ Vérifier**: ~316 lignes copiées

---

### ▶️ ACTION 2: BACKEND - Fichier 2

**📝 Créer**: `src/routes/guestInvoiceRoutes.ts`

**📂 Copier depuis**:
```
C:\Users\aubin\Downloads\kiro1\zen_backend\src\routes\guestInvoiceRoutes.ts
```

**🔧 Comment**:
1. Clic droit sur dossier `routes`
2. "New File..."
3. Nom: `guestInvoiceRoutes.ts`
4. Ouvrir fichier PC
5. Ctrl+A → Ctrl+C
6. Retour GitHub → Ctrl+V
7. Ctrl+S

**✅ Vérifier**: ~20 lignes copiées

---

### ▶️ ACTION 3: BACKEND - Fichier 3 (Vérifier)

**📝 Ouvrir**: `src/routes/index.ts`

**🔍 Vérifier ces 2 lignes existent**:

**Ligne ~10**:
```typescript
import guestInvoiceRoutes from './guestInvoiceRoutes';
```

**Ligne ~26**:
```typescript
router.use('/guest-invoices', guestInvoiceRoutes);
```

**Si elles manquent**:
1. Ajouter import après ligne 9
2. Ajouter router.use après ligne 25
3. Ctrl+S

**✅ Vérifier**: 2 lignes présentes

---

### ▶️ ACTION 4: BACKEND - Push

**📍 Où**: Toujours dans GitHub Web Editor backend

**🔧 Comment**:
1. Cliquer icône "Source Control" (3ème à gauche)
2. Voir 2-3 fichiers modifiés
3. Message: `Add guest invoice system`
4. Cliquer: "Commit & Push"
5. Attendre: "Successfully pushed"

**✅ Vérifier**: Message succès affiché

---

### ▶️ ACTION 5: BACKEND - Surveiller Render

**📍 Où**: https://dashboard.render.com

**🔧 Comment**:
1. Ouvrir dashboard Render
2. Cliquer service: `zen-backend-jzjh`
3. Voir statut: "Building..." → "Deploying..." → "Live"

**⏱️ Attendre**: 3-5 minutes

**✅ Vérifier**: Badge "Live" en vert

---

### ▶️ ACTION 6: FRONTEND - Fichier 1

**📍 Où**: https://github.dev/maga1234-0/Zen (NOUVEL ONGLET)

**📝 Créer**: `src/components/GuestInvoiceModal.tsx`

**📂 Copier depuis**:
```
C:\Users\aubin\Downloads\kiro1\client\src\components\GuestInvoiceModal.tsx
```

**🔧 Comment**:
1. Clic droit sur dossier `components`
2. "New File..."
3. Nom: `GuestInvoiceModal.tsx`
4. Ouvrir fichier PC
5. Ctrl+A → Ctrl+C
6. Retour GitHub → Ctrl+V
7. Ctrl+S

**✅ Vérifier**: ~742 lignes copiées

---

### ▶️ ACTION 7: FRONTEND - Fichier 2 (Remplacer)

**📝 Ouvrir**: `src/pages/Payments.tsx`

**📂 Copier depuis**:
```
C:\Users\aubin\Downloads\kiro1\client\src\pages\Payments.tsx
```

**🔧 Comment**:
1. Ouvrir `Payments.tsx` dans GitHub
2. Ctrl+A (sélectionner TOUT)
3. Ouvrir fichier PC
4. Ctrl+A → Ctrl+C
5. Retour GitHub → Ctrl+V (remplace tout)
6. Ctrl+S

**✅ Vérifier**: ~1055 lignes au total

---

### ▶️ ACTION 8: FRONTEND - Push

**📍 Où**: Toujours dans GitHub Web Editor frontend

**🔧 Comment**:
1. Cliquer icône "Source Control"
2. Voir 2 fichiers modifiés
3. Message: `Add guest invoice tab`
4. Cliquer: "Commit & Push"
5. Attendre: "Successfully pushed"

**✅ Vérifier**: Message succès affiché

---

### ▶️ ACTION 9: FRONTEND - Attendre Vercel

**⏱️ Attendre**: 2-3 minutes (automatique)

**📍 Optionnel**: https://vercel.com/dashboard
- Voir projet "Zen"
- Statut: "Building" → "Ready"

**✅ Vérifier**: Déploiement terminé

---

### ▶️ ACTION 10: TEST - API Backend

**📍 Où**: https://zen-backend-jzjh.onrender.com/api/guest-invoices/unpaid

**🔧 Comment**:
1. Ouvrir URL dans navigateur
2. Voir résultat

**✅ Succès si**:
```json
[]
```
ou
```json
[{"guest_id":"...","guest_name":"..."}]
```

**❌ Échec si**: "Cannot GET..." → Attendre 2 min

---

### ▶️ ACTION 11: TEST - Login Application

**📍 Où**: https://zen-lyart.vercel.app

**🔧 Comment**:
1. Ouvrir application
2. Login:
   - Email: `aubinmaga@gmail.com`
   - Password: `admin123`
3. Cliquer "Login"

**✅ Succès si**: Redirection vers Dashboard

---

### ▶️ ACTION 12: TEST - Navigation Payments

**🔧 Comment**:
1. Dans menu latéral gauche
2. Cliquer: "Payments"

**✅ Succès si**: Page Payments s'affiche

---

### ▶️ ACTION 13: TEST - Vérifier Onglets

**🔧 Comment**:
1. En haut de la page Payments
2. Compter les onglets

**✅ Succès si**: 3 onglets visibles:
1. Paiements
2. Factures Consolidées
3. **Factures Par Client** ⭐ NOUVEAU

**❌ Échec si**: Seulement 2 onglets → Ctrl+Shift+R

---

### ▶️ ACTION 14: TEST - Onglet Factures Par Client

**🔧 Comment**:
1. Cliquer sur: "Factures Par Client"

**✅ Succès si**: Tableau s'affiche avec colonnes:
- Client
- Contact
- 🏨 Chambres
- 🍽️ Restaurant
- 💆 Spa
- Total
- Solde
- Actions

**OU**: Message "Aucun client avec solde impayé"

---

### ▶️ ACTION 15: TEST - Modal (Si clients présents)

**🔧 Comment**:
1. Cliquer: "Voir Détails" sur un client

**✅ Succès si**: Modal s'ouvre avec:
- Informations client
- Tous les achats détaillés
- Résumé avec solde
- Formulaire de paiement (si solde > 0)

**❌ Échec si**: Rien ne se passe → F12 → Console

---

### ▶️ ACTION 16: TEST - Paiement (Si solde > 0)

**🔧 Comment**:
1. Dans modal, cliquer: "Enregistrer un Paiement"
2. Montant: Laisser par défaut
3. Méthode: Choisir (ex: Espèces)
4. Cliquer: "Confirmer"

**✅ Succès si**:
- Toast: "Paiement enregistré avec succès!"
- Solde se met à jour
- Message "Tout est Payé" si solde = 0

---

## 🎉 TERMINÉ !

Si toutes les actions sont ✅:
- ✅ Backend déployé
- ✅ Frontend déployé
- ✅ Nouvel onglet fonctionnel
- ✅ Système de paiement opérationnel

---

## 📊 RÉCAPITULATIF RAPIDE

| Action | Quoi | Où | Durée |
|--------|------|-----|-------|
| 1-3 | Copier 3 fichiers | Backend GitHub | 3 min |
| 4 | Push backend | Source Control | 1 min |
| 5 | Attendre Render | Dashboard | 3-5 min |
| 6-7 | Copier 2 fichiers | Frontend GitHub | 2 min |
| 8 | Push frontend | Source Control | 1 min |
| 9 | Attendre Vercel | (Automatique) | 2-3 min |
| 10-16 | Tests complets | Application | 3-5 min |
| **TOTAL** | | | **15-20 min** |

---

## 🔗 LIENS ACTIONS

| Action | Lien Direct |
|--------|-------------|
| 1-4 | https://github.dev/maga1234-0/zen_backend- |
| 5 | https://dashboard.render.com |
| 6-8 | https://github.dev/maga1234-0/Zen |
| 9 | https://vercel.com/dashboard |
| 10 | https://zen-backend-jzjh.onrender.com/api/guest-invoices/unpaid |
| 11-16 | https://zen-lyart.vercel.app |

---

## 🆘 PROBLÈMES RAPIDES

| Problème | Solution Rapide |
|----------|-----------------|
| Backend 404 | Attendre 2-3 min |
| Onglet manquant | Ctrl+Shift+R |
| Modal erreur | F12 → Console |
| Paiement erreur | Client doit avoir chambre |

---

## 📚 GUIDES COMPLETS

Si besoin de plus de détails:
- **Visuel**: `GUIDE_VISUEL_SIMPLE.md`
- **Détaillé**: `DEPLOIEMENT_ETAPE_PAR_ETAPE.md`
- **Index**: `INDEX_DEPLOIEMENT_COMPLET.md`

---

## ▶️ COMMENCER MAINTENANT

**Premier lien à ouvrir**:
```
https://github.dev/maga1234-0/zen_backend-
```

**Puis suivre**: Actions 1-4

**GO ! 🚀**

---

*Liste d'actions créée le 3 septembre 2026*  
*Déploiement système facturation consolidée par client*  
*Version 1.0.0*
