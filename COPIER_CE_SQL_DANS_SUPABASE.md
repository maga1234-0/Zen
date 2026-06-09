# 📋 ÉTAPE 3: Copier ce SQL dans Supabase

## ⚠️ IMPORTANT

L'erreur que vous avez vue est **NORMALE** car les tables n'existent pas encore!

Vous avez essayé de vérifier si les tables existaient, mais elles n'ont pas encore été créées.

---

## 🎯 Ce qu'il faut faire

### 1️⃣ Effacer ce que vous avez dans Supabase SQL Editor
- Sélectionnez tout (Ctrl+A)
- Supprimez (Delete ou Backspace)

### 2️⃣ Ouvrir le fichier SQL complet
**Chemin du fichier:**
```
c:\Users\aubin\Downloads\kiro1\database\add-email-system.sql
```

**Sur Windows:**
1. Ouvrir l'Explorateur de fichiers (Windows + E)
2. Aller à: `c:\Users\aubin\Downloads\kiro1\database\`
3. Trouver le fichier: `add-email-system.sql`
4. Double-cliquer pour l'ouvrir (avec Notepad ou VS Code)
5. Sélectionner **TOUT** le contenu (Ctrl+A)
6. Copier (Ctrl+C)

### 3️⃣ Coller dans Supabase
1. Retourner dans Supabase SQL Editor
2. Coller le code (Ctrl+V)
3. Vous devriez voir **environ 330 lignes de code**

### 4️⃣ Exécuter
- Cliquer sur le bouton **"RUN"** (en haut à droite)
- Ou appuyer sur **Ctrl+Enter**

### 5️⃣ Vérifier le succès
Vous devriez voir en bas:
```
Email system tables created successfully!
status: "Email system tables created successfully!"
template_count: 5
```

---

## ✅ Ce que le script va créer

### 3 Tables principales:
1. **email_logs** - Historique de tous les emails envoyés
2. **email_templates** - 5 templates pré-configurés en français
3. **email_queue** - Queue pour envoi asynchrone

### 5 Templates insérés:
1. ✉️ Confirmation de réservation
2. ⏰ Rappel check-in (24h avant)
3. 📄 Facture
4. 🔒 Reset mot de passe
5. 👋 Bienvenue

### Fonctions et vues:
- Vue `email_stats` (statistiques)
- Vue `recent_emails` (derniers emails)
- Fonction `queue_email()` (ajouter dans queue)
- Triggers pour `updated_at` automatique

---

## 🆘 Si vous avez une erreur

### Erreur: "permission denied"
**Solution**: Vous n'êtes pas connecté comme admin
- Vérifiez que vous êtes sur le bon projet Supabase
- Reconnectez-vous

### Erreur: "relation already exists"
**Solution**: Les tables existent déjà!
- Cela veut dire que le script a déjà été exécuté
- Vous pouvez passer à l'**ÉTAPE 4** (npm install)

### Autre erreur
- Faites une capture d'écran
- Envoyez-la moi
- Je vous aide immédiatement

---

## 📸 Envoyez-moi une capture du résultat

Une fois que vous avez cliqué "RUN", faites une capture d'écran de la section **"Results"** en bas et envoyez-la moi pour confirmer que tout s'est bien passé!

---

## ➡️ ÉTAPE 4 (Après)

Une fois le SQL exécuté avec succès, passez à l'installation npm:

```bash
cd c:\Users\aubin\Downloads\kiro1\zen_backend
npm install nodemailer handlebars
npm install --save-dev @types/nodemailer
```

Et dites-moi "**Terminé**" pour que je commence à coder! 🚀

