# 📧 Guide Configuration Gmail - Mot de Passe d'Application

## 🎯 Objectif
Obtenir un mot de passe d'application Gmail pour permettre au backend d'envoyer des emails.

---

## ✅ ÉTAPE 1: Activer la Validation en 2 Étapes

### 1.1 Ouvrir les paramètres de sécurité
- Aller sur: **https://myaccount.google.com/security**
- Ou: Google Account → Sécurité

### 1.2 Localiser "Validation en 2 étapes"
- Section: **"Se connecter à Google"**
- Chercher: **"Validation en 2 étapes"**
- Statut actuel:
  - ✅ Si "Activée" → Passer à l'étape 2
  - ❌ Si "Désactivée" → Cliquer pour activer

### 1.3 Activer 2FA (si pas encore activé)
1. Cliquer sur "Validation en 2 étapes"
2. Cliquer "Commencer"
3. Se connecter si demandé
4. Suivre les instructions:
   - Confirmer numéro de téléphone
   - Recevoir code par SMS
   - Entrer le code
   - Cliquer "Activer"

✅ **Résultat**: "Validation en 2 étapes" devrait afficher "Activée"

---

## ✅ ÉTAPE 2: Créer le Mot de Passe d'Application

### 2.1 Accéder aux mots de passe d'application
- Méthode 1: **https://myaccount.google.com/apppasswords**
- Méthode 2: Sécurité → Validation 2 étapes → En bas "Mots de passe des applications"

⚠️ **Note**: Si ce lien n'apparaît pas, c'est que 2FA n'est pas activée (retour étape 1)

### 2.2 Créer un nouveau mot de passe
1. **Sélectionner l'application**: Choisir "Autre (nom personnalisé)"
2. **Nom**: Entrer **"Hotel PMS Backend"** ou **"Zen Backend"**
3. **Cliquer**: "Générer"

### 2.3 Copier le mot de passe généré
- Format: **16 caractères en 4 groupes** (xxxx xxxx xxxx xxxx)
- Exemple: `abcd efgh ijkl mnop`

⚠️ **TRÈS IMPORTANT**:
- **Copier immédiatement** ce mot de passe
- Il ne sera **plus jamais affiché**
- Si perdu, il faudra en générer un nouveau

**Comment copier**:
1. Cliquer sur le mot de passe pour le sélectionner
2. Ou cliquer sur l'icône "Copier"
3. Coller dans un fichier temporaire (Notepad)

✅ **Mot de passe copié!** → Passer à l'étape 3

---

## ✅ ÉTAPE 3: Tester le Mot de Passe (Optionnel mais Recommandé)

Avant de l'utiliser dans le backend, testons qu'il fonctionne.

### Test Simple (dans navigateur)
```
Mot de passe: abcd efgh ijkl mnop (exemple)
Format sans espaces: abcdefghijklmnop

✅ Enlever les espaces pour utilisation
```

---

## 📝 Informations à Noter

**Pour la configuration .env**, vous aurez besoin de:

```
VOTRE_EMAIL: _____________________________ (votre-email@gmail.com)

MOT_PASSE_APP: _____________________________ (sans espaces, 16 caractères)
```

**Exemple**:
```
VOTRE_EMAIL: hotel.seafoam@gmail.com
MOT_PASSE_APP: abcdefghijklmnop
```

---

## 🆘 Problèmes Courants

### ❌ "Mots de passe des applications" n'apparaît pas
**Cause**: 2FA pas activée ou compte Google Workspace  
**Solution**: 
- Vérifier que 2FA est bien activée
- Attendre 5 minutes après activation 2FA
- Réessayer

### ❌ "Cette application ne peut pas générer de mot de passe"
**Cause**: Compte Google Workspace avec restrictions  
**Solution**:
- Si compte professionnel: demander à l'admin
- Sinon: utiliser un compte Gmail personnel

### ❌ Mot de passe perdu
**Solution**:
- Retourner sur https://myaccount.google.com/apppasswords
- Révoquer l'ancien
- Générer un nouveau

---

## ✅ Checklist Étape 1 Terminée

- [ ] 2FA activée sur Gmail
- [ ] Mot de passe d'application généré
- [ ] Mot de passe copié et sauvegardé
- [ ] Votre email Gmail noté

**Une fois cette checklist complète, passez à l'ÉTAPE 2: Configuration .env**

---

**IMPORTANT**: Gardez ce mot de passe en sécurité! Il donne accès complet à votre email.

**Prêt?** Dites-moi "Gmail configuré" avec vos informations et je passe à l'étape 2!
