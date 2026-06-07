# ⚠️ RAPPEL: Scripts SQL à Exécuter dans Supabase

## 📋 Scripts en Attente d'Exécution

Il y a **3 scripts SQL** créés mais **non encore exécutés** dans Supabase qui sont nécessaires pour le bon fonctionnement du système:

---

## 1️⃣ FIX_ORDER_STATUS_CONSTRAINT.sql ⚠️ **CRITIQUE**

### Problème
Le bouton "Commencer" dans la page Restaurant retourne une erreur 500 car la contrainte de statut dans la base de données ne permet pas le statut 'preparing'.

### Impact
- ❌ Impossible de démarrer la préparation des commandes
- ❌ Workflow des commandes bloqué

### Solution
**Fichier**: `database/FIX_ORDER_STATUS_CONSTRAINT.sql`

```sql
-- Supprimer l'ancienne contrainte
ALTER TABLE restaurant_orders 
DROP CONSTRAINT IF EXISTS restaurant_orders_status_check;

-- Recréer la contrainte avec tous les statuts
ALTER TABLE restaurant_orders 
ADD CONSTRAINT restaurant_orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'));
```

### 📍 Comment Exécuter
1. Aller sur https://supabase.com
2. Ouvrir votre projet
3. Aller dans "SQL Editor"
4. Coller le contenu du fichier `database/FIX_ORDER_STATUS_CONSTRAINT.sql`
5. Cliquer sur "Run"

---

## 2️⃣ FIX_PAYMENTS_DESCRIPTION.sql ⚠️ **IMPORTANT**

### Problème
Erreur lors de la création de commandes restaurant: `column "description" of relation "payments" does not exist`

### Impact
- ❌ Impossible de créer des commandes restaurant (500 error)
- ❌ Paiements non générés automatiquement

### Solution
**Fichier**: `database/FIX_PAYMENTS_DESCRIPTION.sql`

```sql
-- Ajouter la colonne description à la table payments
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS description TEXT;
```

### 📍 Comment Exécuter
1. Aller sur https://supabase.com
2. Ouvrir votre projet
3. Aller dans "SQL Editor"
4. Coller le contenu du fichier `database/FIX_PAYMENTS_DESCRIPTION.sql`
5. Cliquer sur "Run"

---

## 3️⃣ RESTAURANT_AUTOMATION_TRIGGERS.sql ℹ️ **OPTIONNEL**

### Fonctionnalité
Automatisation des tâches restaurant:
- **Trigger 1**: Met à jour automatiquement le statut des tables en fonction des réservations
- **Trigger 2**: Ajoute automatiquement les commandes room_service à la table payments

### Impact
- Sans ce trigger: Vous devez gérer manuellement les statuts de tables
- Avec ce trigger: Automatisation complète du workflow

### Solution
**Fichier**: `database/RESTAURANT_AUTOMATION_TRIGGERS.sql`

```sql
-- Trigger pour mettre à jour le statut des tables
CREATE OR REPLACE FUNCTION update_table_status_on_reservation()
RETURNS TRIGGER AS $$
BEGIN
  -- Logique d'automatisation...
END;
$$ LANGUAGE plpgsql;

-- Trigger pour ajouter les room_service aux paiements
CREATE OR REPLACE FUNCTION add_room_service_to_payments()
RETURNS TRIGGER AS $$
BEGIN
  -- Logique d'automatisation...
END;
$$ LANGUAGE plpgsql;
```

### 📍 Comment Exécuter
1. Aller sur https://supabase.com
2. Ouvrir votre projet
3. Aller dans "SQL Editor"
4. Coller le contenu du fichier `database/RESTAURANT_AUTOMATION_TRIGGERS.sql`
5. Cliquer sur "Run"

---

## 📊 Priorité d'Exécution

| Script | Priorité | Impact | Statut |
|--------|----------|--------|--------|
| `FIX_ORDER_STATUS_CONSTRAINT.sql` | 🔴 **CRITIQUE** | Bouton "Commencer" ne fonctionne pas | ⏳ À exécuter |
| `FIX_PAYMENTS_DESCRIPTION.sql` | 🟠 **IMPORTANT** | Erreur lors création commandes | ⏳ À exécuter |
| `RESTAURANT_AUTOMATION_TRIGGERS.sql` | 🟢 **OPTIONNEL** | Automatisation avancée | ⏳ À exécuter |

---

## ✅ Après Exécution

Une fois les 3 scripts exécutés:
1. ✅ Le bouton "Commencer" fonctionnera
2. ✅ Les commandes restaurant seront créées sans erreur
3. ✅ Les tables seront gérées automatiquement
4. ✅ Les paiements room_service seront ajoutés automatiquement

---

## 📝 Instructions Détaillées

### Étape par Étape:
1. **Ouvrir Supabase**
   - URL: https://supabase.com
   - Se connecter avec votre compte

2. **Sélectionner le Projet**
   - Cliquer sur votre projet hotel

3. **Ouvrir SQL Editor**
   - Menu latéral → "SQL Editor"
   - Cliquer sur "+ New query"

4. **Exécuter Script 1** (CRITIQUE)
   - Ouvrir `database/FIX_ORDER_STATUS_CONSTRAINT.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL
   - Cliquer sur "Run" ou Ctrl+Enter
   - ✅ Vérifier "Success"

5. **Exécuter Script 2** (IMPORTANT)
   - Ouvrir `database/FIX_PAYMENTS_DESCRIPTION.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL
   - Cliquer sur "Run" ou Ctrl+Enter
   - ✅ Vérifier "Success"

6. **Exécuter Script 3** (OPTIONNEL)
   - Ouvrir `database/RESTAURANT_AUTOMATION_TRIGGERS.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL
   - Cliquer sur "Run" ou Ctrl+Enter
   - ✅ Vérifier "Success"

---

## 🚨 En Cas d'Erreur

Si vous rencontrez des erreurs lors de l'exécution:
1. Lire le message d'erreur SQL
2. Vérifier que la table existe
3. Vérifier les contraintes existantes
4. Me contacter avec l'erreur exacte

---

## 📌 Notes Importantes

- ⚠️ Ces scripts modifient la structure de la base de données
- ⚠️ Faire une sauvegarde avant si possible
- ⚠️ Les scripts utilisent `IF NOT EXISTS` pour éviter les doublons
- ✅ Ils peuvent être exécutés plusieurs fois sans danger

---

**Date**: 7 juin 2026  
**Statut**: ⏳ EN ATTENTE D'EXÉCUTION PAR L'UTILISATEUR
