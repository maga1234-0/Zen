# ✅ Configuration Email - Étapes Restantes

## 📊 Progression

```
✅ ÉTAPE 1: Gmail (2FA + Mot de passe app) ✅ TERMINÉ
✅ ÉTAPE 2: Fichier .env configuré        ✅ TERMINÉ
⏳ ÉTAPE 3: Exécuter script SQL
⏳ ÉTAPE 4: Installer packages npm
```

---

## 🗄️ ÉTAPE 3: Exécuter le Script SQL dans Supabase

### 📍 Fichier à exécuter
```
Chemin: c:\Users\aubin\Downloads\kiro1\database\add-email-system.sql
```

### 🔧 Comment faire:

**1. Ouvrir Supabase**
- Aller sur: https://supabase.com/dashboard
- Se connecter
- Sélectionner votre projet (celui de l'hôtel)

**2. Ouvrir SQL Editor**
- Dans le menu de gauche, cliquer sur **"SQL Editor"** (icône ⚡)
- Ou aller sur: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

**3. Ouvrir le fichier SQL**
- Sur votre ordinateur, ouvrir le fichier:
  ```
  c:\Users\aubin\Downloads\kiro1\database\add-email-system.sql
  ```
- Sélectionner TOUT le contenu (Ctrl+A)
- Copier (Ctrl+C)

**4. Coller et Exécuter**
- Retourner dans Supabase SQL Editor
- Coller le code SQL (Ctrl+V)
- Cliquer sur le bouton **"Run"** (en bas à droite) ou **"RUN"** (en haut)

**5. Vérifier le succès**
Vous devriez voir:
```
Success. No rows returned
```

Ou un message indiquant que 5 lignes ont été insérées dans `email_templates`.

### ✅ Ce que ce script crée:
- Table `email_logs` (pour l'historique des emails envoyés)
- Table `email_templates` (5 templates pré-configurés en français)
- Table `email_queue` (pour les emails en attente)

---

## 📦 ÉTAPE 4: Installer les Packages npm

### 🔧 Comment faire:

**1. Ouvrir le terminal Windows (CMD ou PowerShell)**
- Appuyez sur `Windows + R`
- Tapez `cmd` ou `powershell`
- Appuyez sur Entrée

**2. Naviguer vers le dossier backend**
```bash
cd c:\Users\aubin\Downloads\kiro1\zen_backend
```

**3. Installer les packages**
```bash
npm install nodemailer handlebars
```

Attendez que l'installation se termine (environ 10-20 secondes).

**4. Installer les types TypeScript**
```bash
npm install --save-dev @types/nodemailer
```

**5. Vérifier l'installation**
```bash
npm list nodemailer handlebars
```

Vous devriez voir:
```
zen_backend@1.0.0
├── handlebars@4.7.8
└── nodemailer@6.9.9
```

---

## ✅ Une fois terminé

**Dites-moi simplement**: 
- "SQL exécuté" ou "Terminé" 
- Ou envoyez-moi une capture d'écran du succès

**Et je vais immédiatement commencer à coder!** 🚀

---

## 🎯 Rappel: Ce qui sera créé

### Jour 1 (immédiat après configuration)
```
zen_backend/
├── src/
│   ├── services/
│   │   └── emailService.ts           ← Service d'envoi email
│   │
│   ├── utils/
│   │   └── emailTemplates/           ← 5 templates professionnels
│   │       ├── bookingConfirmation.hbs
│   │       ├── checkinReminder.hbs
│   │       ├── invoiceEmail.hbs
│   │       ├── passwordReset.hbs
│   │       └── welcome.hbs
```

### Fonctionnalités automatiques
- ✅ Email de confirmation automatique à chaque réservation
- ✅ Email de facture automatique après paiement
- ✅ Rappel check-in 24h avant arrivée (cron job)
- ✅ Templates professionnels en français
- ✅ Logs dans la database
- ✅ Gestion d'erreurs complète

---

## 🆘 Besoin d'aide?

### Pour le SQL:
Si vous avez une erreur dans Supabase:
1. Faites une capture d'écran
2. Envoyez-la moi
3. Je vous aide immédiatement

### Pour npm:
Si l'installation échoue:
1. Copiez le message d'erreur
2. Envoyez-le moi
3. Je trouve la solution

---

## 📧 Vos Identifiants Email (sauvegardés)

```
✅ Email: valcker.basefire671@gmail.com
✅ Mot de passe app: kvob ylxt rwlw elbh (configuré dans .env)
✅ Fichier .env: créé et configuré ✅
```

---

**🚀 Vous êtes à 2 étapes du système email complet!**

**Temps estimé: 3-5 minutes au total** ⏱️

