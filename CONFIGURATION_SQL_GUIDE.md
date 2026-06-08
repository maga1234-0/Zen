# 🗄️ Guide Exécution Script SQL - Tables Email

## 🎯 Objectif
Créer les tables nécessaires pour le système d'emails dans Supabase.

---

## 📍 ÉTAPE 3: Exécution du Script SQL

### Ce qui sera créé
- ✅ Table `email_logs` (historique de tous les emails)
- ✅ Table `email_templates` (templates configurables)
- ✅ Table `email_queue` (queue d'envoi asynchrone)
- ✅ 5 templates de base (confirmation, rappel, facture, etc.)
- ✅ Vues statistiques
- ✅ Fonctions helpers

---

## 🚀 Étapes d'Exécution

### 3.1 Ouvrir Supabase
1. Aller sur: **https://supabase.com**
2. Se connecter avec votre compte
3. Sélectionner votre projet hôtel

### 3.2 Ouvrir SQL Editor
1. Menu latéral gauche → Cliquer sur **"SQL Editor"**
2. Ou icône `</>` dans le menu
3. Cliquer sur **"+ New query"** (en haut)

### 3.3 Copier le Script SQL
1. Ouvrir le fichier: `database/add-email-system.sql`
2. **Sélectionner TOUT le contenu** (Ctrl+A)
3. **Copier** (Ctrl+C)

**Chemin complet**: 
```
c:\Users\aubin\Downloads\kiro1\database\add-email-system.sql
```

### 3.4 Coller et Exécuter
1. **Coller** dans l'éditeur SQL Supabase (Ctrl+V)
2. **Exécuter** le script:
   - Cliquer sur le bouton **"Run"** (en haut à droite)
   - Ou raccourci: **Ctrl + Enter**

### 3.5 Attendre l'Exécution
- Durée: ~5-10 secondes
- Barre de progression en haut

### 3.6 Vérifier le Succès
**Résultat attendu** (en bas de l'écran):
```
✅ Success. No rows returned
```

Ou un message indiquant:
```
Email system tables created successfully!
```

---

## ✅ Vérification des Tables

### Vérifier que les tables existent

**Nouvelle Query** (+ New query) et exécuter:

```sql
-- Vérifier les 3 tables principales
SELECT COUNT(*) as email_logs_count FROM email_logs;
SELECT COUNT(*) as email_templates_count FROM email_templates;
SELECT COUNT(*) as email_queue_count FROM email_queue;
```

**Résultats attendus**:
- `email_logs`: 0 (vide, normal)
- `email_templates`: 5 (5 templates insérés)
- `email_queue`: 0 (vide, normal)

### Voir les templates créés

```sql
SELECT id, name, code FROM email_templates ORDER BY id;
```

**Résultat attendu** (5 lignes):
```
1 | Confirmation de Réservation | booking_confirmation
2 | Rappel Check-in | checkin_reminder
3 | Envoi de Facture | invoice
4 | Réinitialisation Mot de Passe | password_reset
5 | Bienvenue | welcome
```

✅ **Parfait!** Les tables sont créées.

---

## 🗂️ Tables Créées

### 1. email_logs (Historique)
Stocke tous les emails envoyés par le système.

**Colonnes principales**:
- `id` - UUID unique
- `type` - Type d'email (booking_confirmation, invoice, etc.)
- `recipient_email` - Email destinataire
- `subject` - Sujet de l'email
- `status` - Statut (pending, sent, failed)
- `sent_at` - Date d'envoi
- `created_at` - Date de création

### 2. email_templates (Templates)
Templates configurables pour les emails.

**Colonnes principales**:
- `id` - ID auto-incrémenté
- `code` - Code unique (booking_confirmation, etc.)
- `name` - Nom lisible
- `subject` - Sujet du template
- `html_content` - Contenu HTML
- `variables` - Liste des variables (JSON)
- `is_active` - Actif ou non

### 3. email_queue (Queue Asynchrone)
Queue pour envoi différé ou en masse.

**Colonnes principales**:
- `id` - UUID unique
- `template_code` - Template à utiliser
- `recipient_email` - Destinataire
- `data` - Données JSON pour le template
- `status` - Statut (pending, processing, sent, failed)
- `scheduled_at` - Date programmée
- `priority` - Priorité (1=haute, 5=basse)

---

## 📊 Visualiser les Tables

### Dans Supabase
1. Menu latéral → **"Table Editor"**
2. Voir les 3 nouvelles tables:
   - `email_logs`
   - `email_templates`
   - `email_queue`

### Structure des données
Cliquer sur chaque table pour voir:
- Les colonnes
- Les types de données
- Les contraintes
- Les index

---

## 🧪 Test Optionnel: Insérer un Log Test

```sql
-- Créer un log d'email test
INSERT INTO email_logs (
  type,
  recipient_email,
  recipient_name,
  subject,
  status
) VALUES (
  'booking_confirmation',
  'test@example.com',
  'Jean Test',
  'Test Email',
  'pending'
);

-- Vérifier
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 1;
```

✅ Si ça fonctionne, les tables sont bien configurées!

---

## ✅ Checklist Étape 3 Terminée

- [ ] Supabase ouvert
- [ ] SQL Editor ouvert
- [ ] Script `add-email-system.sql` copié
- [ ] Script exécuté avec succès
- [ ] Tables vérifiées (3 tables)
- [ ] Templates vérifiés (5 templates)

**Une fois cette checklist complète, passez à l'ÉTAPE 4: Installation npm**

---

## 🆘 Problèmes Courants

### ❌ Error: relation "email_logs" already exists
**Cause**: Tables déjà créées (script exécuté 2 fois)  
**Solution**: 
- C'est OK, ignorer l'erreur
- Ou supprimer tables et réexécuter:
```sql
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;
DROP TABLE IF EXISTS email_queue CASCADE;
-- Puis réexécuter le script complet
```

### ❌ Error: extension "uuid-ossp" does not exist
**Cause**: Extension UUID pas activée  
**Solution**: Exécuter d'abord:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### ❌ Permission denied for table...
**Cause**: Droits insuffisants  
**Solution**: 
- Vérifier que vous êtes connecté en tant qu'admin
- Ou: Contacter support Supabase

### ❌ Script timeout
**Cause**: Script trop long  
**Solution**:
- Exécuter en 2 parties (tables d'abord, puis inserts)
- Ou augmenter timeout dans settings Supabase

---

## 📝 Notes Importantes

### Données de Production
⚠️ Ce script crée des templates de BASE uniquement.  
Les templates HTML seront améliorés dans le code Handlebars.

### Sauvegarde
💾 Recommandé: Faire un backup Supabase avant modifications importantes.

### Migrations
📦 Pour production future, utiliser des migrations versionnées.

---

**Prêt?** Dites-moi "SQL exécuté avec succès" et je passe à l'étape 4!
