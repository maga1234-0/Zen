# 🛏️ GUIDE COMPLET - 24 TYPES DE CHAMBRES

## 📋 LISTE COMPLÈTE DES CATÉGORIES

Votre système contient maintenant **24 types de chambres** différents :

### 🏠 Chambres par nombre de personnes
1. **Chambre simple** - 1 personne
2. **Chambre double** - 2 personnes (1 lit double)
3. **Chambre twin** - 2 personnes (2 lits simples)
4. **Chambre triple** - 3 personnes
5. **Chambre quadruple** - 4 personnes
6. **Chambre familiale** - 5 personnes
7. **Chambre communicante** - 4 personnes (2 chambres reliées)

### ♿ Chambres spéciales
8. **Chambre accessible PMR** - Adaptée aux personnes à mobilité réduite

### ⭐ Chambres par standing
9. **Chambre standard** - Confort de base
10. **Chambre supérieure** - Confort amélioré
11. **Chambre de luxe** - Haut de gamme
12. **Chambre exécutive** - Pour professionnels

### 👑 Suites
13. **Junior Suite** - Suite compacte
14. **Suite** - Suite luxueuse
15. **Suite présidentielle** - Ultra-luxe

### 🏡 Hébergements indépendants
16. **Studio** - Avec kitchenette
17. **Appartement hôtelier** - Cuisine complète
18. **Bungalow** - Avec jardin privé
19. **Villa** - Avec piscine privée

### 🌅 Chambres avec vue
20. **Chambre avec vue mer** - Vue panoramique sur la mer
21. **Chambre avec vue jardin** - Vue sur les jardins

### 🌳 Chambres avec extérieur
22. **Chambre avec balcon** - Balcon privé
23. **Chambre avec terrasse** - Grande terrasse privée

---

## 💰 PRIX PAR DÉFAUT (USD)

| Type de chambre | Prix par défaut | Capacité |
|-----------------|-----------------|----------|
| Chambre simple | $80 | 1 pers. |
| Chambre standard | $90 | 2 pers. |
| Chambre double | $100 | 2 pers. |
| Chambre twin | $100 | 2 pers. |
| Chambre accessible PMR | $100 | 2 pers. |
| Chambre avec vue jardin | $110 | 2 pers. |
| Studio | $120 | 2 pers. |
| Chambre avec balcon | $120 | 2 pers. |
| Chambre triple | $130 | 3 pers. |
| Chambre supérieure | $130 | 2 pers. |
| Chambre avec terrasse | $150 | 2 pers. |
| Chambre exécutive | $150 | 2 pers. |
| Chambre quadruple | $160 | 4 pers. |
| Chambre avec vue mer | $160 | 2 pers. |
| Chambre familiale | $180 | 5 pers. |
| Chambre de luxe | $180 | 2 pers. |
| Chambre communicante | $200 | 4 pers. |
| Junior Suite | $200 | 2 pers. |
| Appartement hôtelier | $220 | 4 pers. |
| Bungalow | $250 | 3 pers. |
| Suite | $280 | 3 pers. |
| Villa | $450 | 6 pers. |
| Suite présidentielle | $500 | 4 pers. |

**⚠️ Ces prix sont des exemples. Vous pouvez les modifier facilement!**

---

## 🔧 COMMENT MODIFIER LES PRIX

### Méthode 1: Avant la création (RECOMMANDÉ)

1. **Ouvrir le fichier**: `database/SETUP_INITIAL_DATA.sql`
2. **Chercher** les lignes avec `base_price`
3. **Modifier** les prix selon vos besoins
4. **Exécuter** le script dans Supabase

**Exemple**:
```sql
-- Avant
base_price = 100.00,  -- ⚠️ MODIFIEZ CE PRIX

-- Après (exemple: 150 euros)
base_price = 150.00,  -- Prix modifié
```

### Méthode 2: Après la création

1. **Ouvrir le fichier**: `database/MODIFIER_PRIX_CHAMBRES.sql`
2. **Modifier** tous les prix dans ce fichier
3. **Copier** tout le contenu
4. **Coller** dans Supabase SQL Editor
5. **Cliquer** RUN

**Exemple**:
```sql
-- Modifier le prix de la chambre double
UPDATE room_types 
SET base_price = 150.00  -- Nouveau prix
WHERE name = 'Chambre double';
```

### Méthode 3: Via l'interface web (À VENIR)

Une interface de gestion des types de chambres sera disponible dans les paramètres.

---

## 📊 ÉQUIPEMENTS PAR TYPE

### Équipements de base (toutes les chambres)
- ✅ WiFi gratuit
- ✅ Télévision

### Équipements premium
- 🍷 Minibar (chambres supérieures et plus)
- ☕ Machine à café (chambres de luxe et plus)
- 🛁 Peignoir (chambres de luxe et suites)
- 🌊 Jacuzzi (suites)
- 🏊 Piscine privée (villa)

### Équipements spéciaux
- ♿ Salle de bain adaptée (PMR)
- 💼 Bureau de travail (exécutive)
- 🖨️ Imprimante (exécutive)
- 🍳 Kitchenette (studio)
- 🍽️ Cuisine complète (appartement)
- 🌳 Jardin privé (bungalow, villa)

---

## 🎯 UTILISATION PRATIQUE

### Créer des chambres

Après avoir exécuté le script, vous pouvez créer des chambres:

1. **Se connecter** sur https://zen-lyart.vercel.app
2. **Aller** dans "Chambres"
3. **Cliquer** "Ajouter une chambre"
4. **Sélectionner** le type dans la liste déroulante
5. **Remplir** les informations:
   - Numéro de chambre (ex: 101, 102, 201)
   - Type (sélectionner dans la liste)
   - Étage
   - Prix personnalisé (optionnel)

### Prix personnalisé par chambre

Vous pouvez définir un prix différent pour chaque chambre:
- Le **prix de base** vient du type de chambre
- Le **prix personnalisé** remplace le prix de base pour cette chambre spécifique

**Exemple**:
- Type: Chambre double (prix de base: $100)
- Chambre 101: Prix personnalisé $120 (vue mer)
- Chambre 102: Prix personnalisé $90 (pas de vue)
- Chambre 103: Pas de prix personnalisé → utilise $100

---

## 🚀 ÉTAPES D'INSTALLATION

### 1. Exécuter le script principal

**Fichier**: `database/SETUP_INITIAL_DATA.sql`

**Ce qu'il fait**:
- ✅ Crée l'hôtel par défaut
- ✅ Crée les 24 types de chambres
- ✅ Crée l'utilisateur admin
- ✅ Configure les paramètres

**Comment**:
1. Ouvrir Supabase SQL Editor
2. Copier tout le contenu du fichier
3. Modifier les prix si nécessaire
4. Coller et cliquer RUN

### 2. Vérifier les types créés

```sql
SELECT name, base_price, max_occupancy 
FROM room_types 
ORDER BY base_price;
```

**Résultat attendu**: 24 lignes

### 3. Créer vos premières chambres

Via l'interface web:
- Chambre 101 - Chambre simple
- Chambre 102 - Chambre double
- Chambre 201 - Suite
- etc.

---

## 💡 CONSEILS

### Organisation des numéros de chambres

**Par étage**:
- Étage 1: 101, 102, 103, 104...
- Étage 2: 201, 202, 203, 204...
- Étage 3: 301, 302, 303, 304...

**Par type**:
- Chambres standard: 101-120
- Chambres supérieures: 201-220
- Suites: 301-310
- Villas: V1, V2, V3

### Stratégie de prix

**Basse saison**: Prix de base
**Haute saison**: Prix de base + 30-50%
**Événements spéciaux**: Prix de base + 50-100%

Utilisez les **prix personnalisés** pour ajuster selon:
- La vue (mer, jardin, ville)
- L'étage (plus haut = plus cher)
- La position (coin, centre)
- Les rénovations récentes

---

## 🔍 REQUÊTES UTILES

### Voir tous les types avec leurs prix
```sql
SELECT 
    name AS "Type",
    base_price AS "Prix",
    max_occupancy AS "Capacité",
    amenities AS "Équipements"
FROM room_types
ORDER BY base_price;
```

### Compter les chambres par type
```sql
SELECT 
    rt.name AS "Type",
    COUNT(r.id) AS "Nombre de chambres"
FROM room_types rt
LEFT JOIN rooms r ON r.room_type_id = rt.id
GROUP BY rt.name
ORDER BY COUNT(r.id) DESC;
```

### Voir les chambres avec prix personnalisé
```sql
SELECT 
    r.room_number AS "Numéro",
    rt.name AS "Type",
    rt.base_price AS "Prix de base",
    r.custom_price AS "Prix personnalisé"
FROM rooms r
JOIN room_types rt ON r.room_type_id = rt.id
WHERE r.custom_price IS NOT NULL
ORDER BY r.room_number;
```

### Calculer le prix moyen par type
```sql
SELECT 
    rt.name AS "Type",
    rt.base_price AS "Prix de base",
    AVG(COALESCE(r.custom_price, rt.base_price)) AS "Prix moyen réel"
FROM room_types rt
LEFT JOIN rooms r ON r.room_type_id = rt.id
GROUP BY rt.name, rt.base_price
ORDER BY rt.base_price;
```

---

## 📞 FICHIERS IMPORTANTS

| Fichier | Description |
|---------|-------------|
| `database/SETUP_INITIAL_DATA.sql` | Script principal (création) |
| `database/MODIFIER_PRIX_CHAMBRES.sql` | Modifier les prix après création |
| `ACTION_REQUISE_MAINTENANT.md` | Guide d'installation rapide |
| `ACTIONS_IMMEDIATES.md` | Actions urgentes |

---

## ✅ CHECKLIST

- [ ] Ouvrir `SETUP_INITIAL_DATA.sql`
- [ ] Modifier les prix selon vos besoins
- [ ] Exécuter le script dans Supabase
- [ ] Vérifier que 24 types sont créés
- [ ] Se connecter sur le frontend
- [ ] Créer quelques chambres de test
- [ ] Vérifier que les types apparaissent dans la liste
- [ ] Tester la création d'une réservation

---

## 🎉 RÉSULTAT FINAL

Après avoir exécuté le script, vous aurez:

✅ **1 hôtel** (Grand Seafoam Hotel)
✅ **24 types de chambres** (toutes les catégories)
✅ **1 utilisateur admin** (admin@hotel.com / admin123)
✅ **Système prêt** à créer des chambres et réservations

**Vous pouvez maintenant gérer votre hôtel avec toutes les catégories de chambres!** 🚀

---

**👉 PROCHAINE ÉTAPE: Exécuter `database/SETUP_INITIAL_DATA.sql` dans Supabase!**
