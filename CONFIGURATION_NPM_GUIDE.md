# 📦 Guide Installation npm - Dépendances Email

## 🎯 Objectif
Installer les packages npm nécessaires pour l'envoi d'emails (nodemailer, handlebars).

---

## 📍 ÉTAPE 4: Installation des Dépendances

### Packages à installer
- ✅ **nodemailer** - Envoi d'emails via SMTP
- ✅ **handlebars** - Templates HTML dynamiques
- ✅ **@types/nodemailer** - Types TypeScript

---

## 🚀 Installation

### 4.1 Ouvrir le Terminal
**Windows**:
- Ouvrir PowerShell ou CMD
- Ou utiliser le terminal intégré de VS Code

### 4.2 Naviguer vers zen_backend

```bash
cd c:\Users\aubin\Downloads\kiro1\zen_backend
```

**Vérification** (afficher le répertoire actuel):
```bash
pwd
# Devrait afficher: .../kiro1/zen_backend
```

### 4.3 Installer les Packages

```bash
npm install nodemailer handlebars
```

**Durée**: 10-30 secondes

**Output attendu**:
```
added 15 packages, and audited 250 packages in 10s

found 0 vulnerabilities
```

### 4.4 Installer les Types TypeScript

```bash
npm install --save-dev @types/nodemailer
```

**Output attendu**:
```
added 1 package, and audited 251 packages in 2s
```

---

## ✅ Vérification de l'Installation

### Vérifier que les packages sont installés

```bash
npm list nodemailer handlebars
```

**Output attendu**:
```
zen_backend@1.0.0 c:\Users\aubin\Downloads\kiro1\zen_backend
├── handlebars@4.7.8
└── nodemailer@6.9.9
```

### Vérifier les versions

```bash
npm list --depth=0 | grep -E "nodemailer|handlebars"
```

**Versions recommandées**:
- nodemailer: ^6.9.0
- handlebars: ^4.7.0
- @types/nodemailer: ^6.4.0

---

## 📄 Fichiers Modifiés

### package.json
Le fichier `zen_backend/package.json` devrait maintenant contenir:

```json
{
  "dependencies": {
    "nodemailer": "^6.9.9",
    "handlebars": "^4.7.8",
    // ... autres dépendances
  },
  "devDependencies": {
    "@types/nodemailer": "^6.4.14",
    // ... autres dev dépendances
  }
}
```

### node_modules/
Les packages sont installés dans:
```
zen_backend/node_modules/nodemailer/
zen_backend/node_modules/handlebars/
```

### package-lock.json
Fichier mis à jour automatiquement (ne pas modifier).

---

## 🧪 Test d'Installation

### Test 1: Importer nodemailer

Créer un fichier test temporaire:

```bash
cd zen_backend
```

Créer `test-email.js`:
```javascript
const nodemailer = require('nodemailer');
console.log('✅ Nodemailer loaded successfully!');
console.log('Version:', nodemailer.version || 'Unknown');
```

Exécuter:
```bash
node test-email.js
```

**Output attendu**:
```
✅ Nodemailer loaded successfully!
```

### Test 2: Importer handlebars

Créer `test-handlebars.js`:
```javascript
const Handlebars = require('handlebars');
const template = Handlebars.compile('Hello {{name}}!');
console.log(template({ name: 'Hôtel' }));
```

Exécuter:
```bash
node test-handlebars.js
```

**Output attendu**:
```
Hello Hôtel!
```

✅ **Parfait!** Les packages fonctionnent.

### Nettoyer
```bash
rm test-email.js test-handlebars.js
```

---

## 📦 Packages Expliqués

### nodemailer
**Rôle**: Envoi d'emails via SMTP, IMAP, etc.

**Fonctionnalités**:
- Connexion SMTP (Gmail, SendGrid, etc.)
- Envoi emails HTML/Text
- Pièces jointes
- Templates
- Gestion erreurs

**Documentation**: https://nodemailer.com

### handlebars
**Rôle**: Moteur de templates HTML

**Fonctionnalités**:
- Variables: `{{guestName}}`
- Conditions: `{{#if paid}}...{{/if}}`
- Boucles: `{{#each items}}...{{/each}}`
- Helpers personnalisés
- Partials (réutilisation)

**Documentation**: https://handlebarsjs.com

### @types/nodemailer
**Rôle**: Définitions TypeScript pour nodemailer

**Avantages**:
- Autocomplétion dans VS Code
- Vérification des types
- Documentation inline

---

## 🔄 Mise à Jour Future

### Mettre à jour les packages

```bash
cd zen_backend
npm update nodemailer handlebars
```

### Vérifier les vulnérabilités

```bash
npm audit
```

Si des vulnérabilités:
```bash
npm audit fix
```

---

## ✅ Checklist Étape 4 Terminée

- [ ] Terminal ouvert
- [ ] Navigation vers `zen_backend/`
- [ ] `npm install nodemailer handlebars` exécuté
- [ ] `npm install --save-dev @types/nodemailer` exécuté
- [ ] Vérification: `npm list nodemailer` OK
- [ ] Vérification: `npm list handlebars` OK
- [ ] Tests d'import réussis (optionnel)

**Une fois cette checklist complète, la configuration est TERMINÉE!**

---

## 🎉 CONFIGURATION COMPLÈTE!

### Récapitulatif des 4 Étapes

| # | Étape | Statut |
|---|-------|--------|
| 1 | Gmail 2FA + Mot de passe app | ✅ |
| 2 | Configuration .env | ✅ |
| 3 | Exécution script SQL | ✅ |
| 4 | Installation npm | ✅ |

### Ce qui est prêt

✅ Gmail configuré (SMTP)  
✅ Backend configuré (.env)  
✅ Database configurée (tables email)  
✅ Packages installés (nodemailer, handlebars)

---

## 🚀 PRÊT POUR LE CODE!

**Je vais maintenant créer**:

### Jour 1 (Maintenant)
1. ✅ Service `emailService.ts`
2. ✅ 5 Templates Handlebars professionnels
3. ✅ Tests d'envoi basique
4. ✅ Commit + Push

### Résultat
À la fin de Jour 1, vous pourrez envoyer des emails depuis le backend!

---

## 🆘 Problèmes Courants

### ❌ npm ERR! ENOENT: no such file or directory
**Cause**: Mauvais répertoire  
**Solution**: Vérifier que vous êtes dans `zen_backend/`
```bash
pwd
cd zen_backend
```

### ❌ npm WARN deprecated...
**Cause**: Package avec warnings (non bloquant)  
**Solution**: Ignorer les warnings, c'est normal

### ❌ npm ERR! code EACCES (Permission denied)
**Cause**: Droits insuffisants  
**Solution**: 
- Windows: Exécuter PowerShell en admin
- Linux/Mac: Utiliser `sudo npm install`

### ❌ Package installation fails
**Solution**: Nettoyer et réinstaller
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Prêt?** Dites-moi "npm installé avec succès" et **JE COMMENCE LE CODE IMMÉDIATEMENT!** 🚀
