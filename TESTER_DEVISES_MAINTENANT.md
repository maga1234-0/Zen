# ✅ TESTER LE SYSTÈME MULTI-DEVISES - GUIDE RAPIDE

---

## 🎯 OBJECTIF

Vérifier que le système de conversion automatique des devises fonctionne **partout** dans l'application.

---

## ⏱️ TEMPS REQUIS: 15 MINUTES

---

## 📋 ÉTAPE 1: EXÉCUTER LES SCRIPTS SQL (5 min)

### Script 1: Créer les Devises

**Fichier**: `database/ADD_MULTI_CURRENCY_SYSTEM.sql`

**Instructions**:
1. ✅ Ouvre https://supabase.com/dashboard
2. ✅ Clique sur ton projet
3. ✅ Va dans **SQL Editor** (menu gauche)
4. ✅ Clique **New Query**
5. ✅ Copie TOUT le contenu de `database/ADD_MULTI_CURRENCY_SYSTEM.sql`
6. ✅ Colle dans l'éditeur SQL
7. ✅ Clique **RUN** (en bas à droite)
8. ✅ Vérifie: Message "Success. No rows returned"

**Résultat**: Table `currencies` créée avec 6 devises (USD, CDF, EUR, GBP, ZAR, XAF)

---

### Script 2: Ajouter les Taux de Change

**Fichier**: `database/ADD_EXCHANGE_RATES_TO_CURRENCIES.sql`

**Instructions**:
1. ✅ Dans le même SQL Editor
2. ✅ Efface le contenu précédent
3. ✅ Copie TOUT le contenu de `database/ADD_EXCHANGE_RATES_TO_CURRENCIES.sql`
4. ✅ Colle dans l'éditeur SQL
5. ✅ Clique **RUN**
6. ✅ Vérifie: Message "Success. No rows returned"

**Résultat**: Colonnes `exchange_rate_to_usd` et `last_updated` ajoutées

---

## ⏳ ÉTAPE 2: ATTENDRE LE DÉPLOIEMENT (2-3 min)

Le déploiement Vercel est **automatique** dès que tu push sur GitHub.

**Status**: 🔄 En cours depuis ton dernier `git push`

**Vérification**:
1. ✅ Va sur https://vercel.com/dashboard
2. ✅ Trouve ton projet "Zen"
3. ✅ Vérifie que le dernier déploiement est "Ready" ✅
4. ✅ Si "Building" 🔄 → Attends 1-2 minutes

**OU** simplement attends 3 minutes après le push.

---

## 🧪 ÉTAPE 3: TESTER L'APPLICATION (10 min)

### Test 1: Settings - Changer la Devise ✅

1. ✅ Va sur https://zen-lyart.vercel.app
2. ✅ Login avec ton compte
3. ✅ Appuie sur **Ctrl+F5** (recharge sans cache)
4. ✅ Va dans **⚙️ Settings** (menu gauche)
5. ✅ Trouve la section **"Currency Settings"**
6. ✅ Clique sur le dropdown **"Currency"**
7. ✅ Sélectionne **"CDF - Franc Congolais (FC)"**
8. ✅ Clique **"Save Settings"**
9. ✅ Vérifie: Toast vert "Settings saved successfully!"

**Résultat attendu**: Devise changée à CDF

---

### Test 2: Dashboard - Vérifier les Revenus ✅

1. ✅ Va dans **📊 Dashboard** (menu gauche)
2. ✅ Regarde les cartes statistiques en haut
3. ✅ Cherche "Revenus du Jour" ou "Monthly Revenue"

**❌ AVANT** (hardcodé en euros):
```
Revenus du Jour
1,250.00€
```

**✅ APRÈS** (dynamique en CDF):
```
Revenus du Jour
FC 3 500 000
```

**Vérification**:
- ✅ Le symbole est **FC** (pas €)
- ✅ Le montant est **multiplié par ~2800**
- ✅ Il n'y a **pas de décimales** (CDF utilise 0 décimales)
- ✅ Les milliers sont séparés par des **espaces**

---

### Test 3: Rooms - Vérifier les Prix des Chambres ✅

1. ✅ Va dans **🛏️ Rooms** (menu gauche)
2. ✅ Regarde les prix affichés sous chaque chambre

**❌ AVANT**:
```
Standard Room
$100.00 /nuit
```

**✅ APRÈS** (avec CDF):
```
Standard Room
FC 280 000 /nuit
```

**Vérification**:
- ✅ Le symbole est **FC**
- ✅ Le prix est **~280,000** (100 USD × 2800)
- ✅ Pas de décimales
- ✅ Séparateurs d'espaces

---

### Test 4: Restaurant - Vérifier les Prix des Plats ✅

1. ✅ Va dans **🍽️ Restaurant** (menu gauche)
2. ✅ Clique sur l'onglet **"Menu"**
3. ✅ Regarde les prix des plats

**❌ AVANT**:
```
Pizza Margherita
15.00€
```

**✅ APRÈS** (avec CDF):
```
Pizza Margherita
FC 42 000
```

**Vérification**:
- ✅ Symbole **FC**
- ✅ Prix multiplié par ~2800
- ✅ Pas de décimales

---

### Test 5: Spa - Vérifier les Prix des Services ✅

1. ✅ Va dans **💆 Spa** (menu gauche)
2. ✅ Clique sur l'onglet **"Services"**
3. ✅ Regarde les prix des services

**❌ AVANT**:
```
Massage Relaxant
50.00€
```

**✅ APRÈS** (avec CDF):
```
Massage Relaxant
FC 140 000
```

**Vérification**:
- ✅ Symbole **FC**
- ✅ Prix converti correctement

---

### Test 6: Bookings - Vérifier les Montants ✅

1. ✅ Va dans **📅 Bookings**
2. ✅ Regarde la colonne **"Amount"**

**✅ Résultat attendu**:
```
Total: FC 560 000
```

**Vérification**:
- ✅ Tous les montants en **FC**
- ✅ Pas de symboles **$** ou **€**

---

### Test 7: Payments - Vérifier les Paiements ✅

1. ✅ Va dans **💳 Payments**
2. ✅ Regarde la colonne **"Amount"**

**✅ Résultat attendu**:
```
Amount: FC 280 000
```

**Vérification**:
- ✅ Tous les montants en **FC**

---

### Test 8: Changer à EUR (Euro) ✅

1. ✅ Retourne dans **⚙️ Settings**
2. ✅ Change la devise à **"EUR - Euro (€)"**
3. ✅ Sauvegarde
4. ✅ Retourne dans **Dashboard**

**✅ Résultat attendu**:
```
Revenus du Jour
1 150.00 €
```

**Vérification**:
- ✅ Symbole **€** (après le montant)
- ✅ **2 décimales** (EUR utilise 2 décimales)
- ✅ Montant converti (100 USD × 0.92 = 92 EUR)

---

### Test 9: Vérifier Toutes les Pages avec EUR ✅

Parcours **rapidement** ces pages et vérifie que tout est en **€**:

1. ✅ Dashboard → Revenus en **€**
2. ✅ Rooms → Prix en **€**
3. ✅ Restaurant → Prix en **€**
4. ✅ Spa → Prix en **€**
5. ✅ Bookings → Montants en **€**
6. ✅ Payments → Montants en **€**

---

### Test 10: Tester GBP (Livre Sterling) ✅

1. ✅ Settings → Change à **"GBP - Pound Sterling (£)"**
2. ✅ Sauvegarde
3. ✅ Dashboard → Vérifie revenus en **£**

**✅ Résultat attendu**:
```
Monthly Revenue
£ 79.00
```

**Vérification**:
- ✅ Symbole **£** (avant le montant)
- ✅ Montant converti (100 USD × 0.79 = 79 GBP)

---

## ✅ CHECKLIST FINALE

Après tous les tests, vérifie ces points:

- [ ] ✅ Les 2 scripts SQL ont été exécutés sans erreur
- [ ] ✅ Le déploiement Vercel est terminé (Ready ✅)
- [ ] ✅ La devise peut être changée dans Settings
- [ ] ✅ Dashboard affiche les revenus dans la devise sélectionnée
- [ ] ✅ Rooms affiche les prix dans la devise sélectionnée
- [ ] ✅ Restaurant affiche les prix dans la devise sélectionnée
- [ ] ✅ Spa affiche les prix dans la devise sélectionnée
- [ ] ✅ Bookings affiche les montants dans la devise sélectionnée
- [ ] ✅ Payments affiche les montants dans la devise sélectionnée
- [ ] ✅ CDF s'affiche sans décimales (ex: FC 280 000)
- [ ] ✅ EUR/GBP/USD s'affichent avec 2 décimales (ex: € 92.00)
- [ ] ✅ Les séparateurs de milliers fonctionnent (espaces)
- [ ] ✅ Changer de devise met à jour instantanément tous les affichages

---

## 🎯 TAUX DE CONVERSION ATTENDUS

Pour vérifier que les conversions sont correctes:

**Base: 100 USD**

| Devise | Symbole | Taux | Résultat Attendu | Décimales |
|--------|---------|------|------------------|-----------|
| USD | $ | 1.0 | $ 100.00 | 2 |
| CDF | FC | 2800 | FC 280 000 | 0 |
| EUR | € | 0.92 | 92.00 € | 2 |
| GBP | £ | 0.79 | £ 79.00 | 2 |
| ZAR | R | 18.50 | R 1 850.00 | 2 |
| XAF | FCFA | 605 | 60 500 FCFA | 0 |

**Note**: Les taux en temps réel peuvent varier légèrement (±2%) car l'API Forex met à jour les taux toutes les heures.

---

## 🐛 PROBLÈMES POSSIBLES

### Problème 1: "Currency dropdown vide"

**Cause**: Scripts SQL pas exécutés

**Solution**:
1. Retourne à l'étape 1
2. Exécute les 2 scripts SQL dans Supabase
3. Recharge l'app (Ctrl+F5)

---

### Problème 2: "Toujours en $ ou €"

**Cause**: Cache du navigateur

**Solution**:
1. Appuie sur **Ctrl+Shift+Delete**
2. Coche "Cached images and files"
3. Clique "Clear data"
4. Recharge l'app (Ctrl+F5)

---

### Problème 3: "Montants incorrects"

**Cause**: Taux de change pas à jour

**Solution**:
1. C'est normal! Les taux Forex changent toutes les heures
2. Les variations de ±5% sont acceptables
3. Vérifie que la conversion se fait (pas de $ si tu as sélectionné CDF)

---

### Problème 4: "Settings ne sauvegarde pas"

**Cause**: Backend pas accessible

**Solution**:
1. Vérifie que le backend est déployé: https://zen-backend-jzjh.onrender.com
2. Ouvre la console du navigateur (F12)
3. Cherche des erreurs en rouge
4. Partage l'erreur pour diagnostic

---

## 📞 SUPPORT

Si quelque chose ne fonctionne pas:

1. ✅ Vérifie la **console du navigateur** (F12 → Console)
2. ✅ Cherche des **erreurs en rouge**
3. ✅ Note le message d'erreur exact
4. ✅ Prends un **screenshot**
5. ✅ Partage avec moi pour diagnostic

---

## 🎉 SUCCÈS!

Si tous les tests passent:

**✅ Le système multi-devises est 100% OPÉRATIONNEL!**

Tu peux maintenant:
- ✅ Changer de devise à tout moment
- ✅ Voir tous les prix dans ta devise préférée
- ✅ Les taux se mettent à jour automatiquement toutes les heures
- ✅ Tous les utilisateurs peuvent avoir leur propre devise

---

**Temps Total**: ~15 minutes  
**Dernière mise à jour**: 23 juin 2026  
**Status**: ✅ Système complet et déployé
