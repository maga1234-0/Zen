# ⚙️ Guide Configuration .env - Backend Email

## 🎯 Objectif
Ajouter la configuration SMTP Gmail dans le fichier `.env` du backend.

---

## 📍 ÉTAPE 2: Configuration du fichier .env

### Localisation du fichier
```
Chemin: zen_backend/.env
```

⚠️ **Le fichier .env existe-t-il?**
- ✅ **OUI**: Ouvrir et ajouter les lignes en bas
- ❌ **NON**: Créer le fichier `zen_backend/.env`

---

## 🔧 Configuration à Ajouter

### Copier-Coller ces lignes dans `.env`

```env
# ============================================
# EMAIL CONFIGURATION (SMTP Gmail)
# ============================================
# Configuration SMTP pour Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=VOTRE_EMAIL@gmail.com
SMTP_PASS=votremotdepasseapp

# Informations expéditeur
EMAIL_FROM=noreply@hotel.com
EMAIL_FROM_NAME=Grand Hôtel Seafoam
EMAIL_REPLY_TO=contact@hotel.com

# Mode debug (afficher logs en développement)
EMAIL_DEBUG=true
```

---

## ✏️ Personnalisation Requise

### 1. Remplacer `SMTP_USER`
```env
# ❌ AVANT
SMTP_USER=VOTRE_EMAIL@gmail.com

# ✅ APRÈS (exemple)
SMTP_USER=hotel.seafoam@gmail.com
```

### 2. Remplacer `SMTP_PASS`
```env
# ❌ AVANT
SMTP_PASS=votremotdepasseapp

# ✅ APRÈS (votre mot de passe app Gmail, SANS espaces)
SMTP_PASS=abcdefghijklmnop
```

⚠️ **IMPORTANT**: 
- Enlever TOUS les espaces du mot de passe Gmail
- Gmail donne: `abcd efgh ijkl mnop`
- Utiliser: `abcdefghijklmnop`

### 3. Personnaliser les informations hôtel (optionnel)
```env
# ✏️ Personnaliser selon votre hôtel
EMAIL_FROM=noreply@votrehotel.com
EMAIL_FROM_NAME=Nom de Votre Hôtel
EMAIL_REPLY_TO=contact@votrehotel.com
```

---

## 📄 Exemple Complet

### Configuration Finale (exemple)
```env
# ============================================
# EMAIL CONFIGURATION (SMTP Gmail)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seafoam.hotel@gmail.com
SMTP_PASS=abcdefghijklmnop
EMAIL_FROM=noreply@seafoamhotel.com
EMAIL_FROM_NAME=Grand Hôtel Seafoam
EMAIL_REPLY_TO=contact@seafoamhotel.com
EMAIL_DEBUG=true
```

---

## 🔒 Sécurité

### ⚠️ NE JAMAIS COMMITER .env

Le fichier `.env` contient des informations sensibles (mot de passe).

**Vérification**:
```bash
# Vérifier que .env est dans .gitignore
cd zen_backend
cat .gitignore | grep ".env"
```

**Résultat attendu**: `.env` doit apparaître dans la liste

✅ Si oui: Parfait!  
❌ Si non: Ajouter `.env` dans `.gitignore`

---

## 🧪 Test de Configuration

### Option 1: Test Manuel (après installation npm)
```bash
cd zen_backend
node -e "console.log('SMTP_USER:', process.env.SMTP_USER)"
```

**Résultat attendu**: Affiche votre email

### Option 2: Test avec le code (plus tard)
Le service emailService.ts testera automatiquement la connexion.

---

## 📊 Variables Expliquées

| Variable | Valeur | Description |
|----------|--------|-------------|
| `SMTP_HOST` | `smtp.gmail.com` | Serveur SMTP de Gmail |
| `SMTP_PORT` | `587` | Port SMTP (TLS) |
| `SMTP_SECURE` | `false` | false pour port 587, true pour 465 |
| `SMTP_USER` | Votre email | Email Gmail complet |
| `SMTP_PASS` | Mot de passe app | 16 caractères sans espaces |
| `EMAIL_FROM` | Email fictif | Email "De" dans les emails |
| `EMAIL_FROM_NAME` | Nom hôtel | Nom affiché dans emails |
| `EMAIL_REPLY_TO` | Email réel | Email pour réponses |
| `EMAIL_DEBUG` | `true/false` | Afficher logs en dev |

---

## 🗂️ Fichier Complet .env (avec autres configs)

Si votre `.env` contient déjà d'autres variables:

```env
# ============================================
# DATABASE (Supabase)
# ============================================
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_KEY=...

# ============================================
# JWT
# ============================================
JWT_SECRET=...
JWT_EXPIRES_IN=7d

# ============================================
# SERVER
# ============================================
PORT=3001
NODE_ENV=development

# ============================================
# EMAIL CONFIGURATION (SMTP Gmail)  ← AJOUTER ICI
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votremotdepasseapp
EMAIL_FROM=noreply@hotel.com
EMAIL_FROM_NAME=Grand Hôtel Seafoam
EMAIL_REPLY_TO=contact@hotel.com
EMAIL_DEBUG=true
```

**Position**: Ajouter en bas du fichier (ordre n'a pas d'importance)

---

## ✅ Checklist Étape 2 Terminée

- [ ] Fichier `zen_backend/.env` existe
- [ ] Configuration SMTP ajoutée
- [ ] `SMTP_USER` personnalisé (votre email Gmail)
- [ ] `SMTP_PASS` personnalisé (mot de passe app, sans espaces)
- [ ] `EMAIL_FROM_NAME` personnalisé (optionnel)
- [ ] Fichier `.env` dans `.gitignore`

**Une fois cette checklist complète, passez à l'ÉTAPE 3: Exécution Script SQL**

---

## 🆘 Problèmes Courants

### ❌ Fichier .env non trouvé par le backend
**Solution**: 
```bash
# Vérifier que .env est à la racine de zen_backend/
ls zen_backend/.env
```

### ❌ Variables non chargées
**Solution**: Installer dotenv si pas déjà fait
```bash
cd zen_backend
npm install dotenv
```

### ❌ Mot de passe avec espaces ne fonctionne pas
**Solution**: Enlever TOUS les espaces
```
Gmail donne: abcd efgh ijkl mnop
Utiliser:    abcdefghijklmnop
```

---

**Prêt?** Dites-moi ".env configuré" et je passe à l'étape 3!
