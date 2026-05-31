# 📊 LISTE COMPLÈTE DES TABLES DU SYSTÈME

## 🎯 RÉSUMÉ

**Total de tables**: 41 tables

| Module | Nombre de tables |
|--------|------------------|
| Tables principales | 10 |
| Module Spa | 13 |
| Module Restaurant | 9 |
| Réservation en ligne | 6 |
| Autres | 3 |

---

## 📋 1. TABLES PRINCIPALES (10 tables)

### 1.1 Gestion des utilisateurs
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `users` | Utilisateurs du système (staff) | id, username, email, password_hash, role, first_name, last_name, phone, is_active, profile_picture |

### 1.2 Gestion des chambres
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `room_types` | Types de chambres (Standard, Deluxe, Suite) | id, name, description, base_price, capacity, amenities |
| `rooms` | Chambres de l'hôtel | id, room_number, room_type_id, floor, status, is_active |

### 1.3 Gestion des clients
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `guests` | Clients de l'hôtel | id, first_name, last_name, email, phone, id_number, address, city, country, date_of_birth, nationality |

### 1.4 Gestion des réservations
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `bookings` | Réservations | id, guest_id, room_id, check_in_date, check_out_date, status, total_amount, special_requests, booking_source |

### 1.5 Gestion des paiements
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `payments` | Paiements | id, booking_id, amount, payment_method, payment_status, transaction_id, payment_date |

### 1.6 Gestion du ménage
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `housekeeping_tasks` | Tâches de ménage | id, room_id, assigned_to, task_type, status, priority, scheduled_date, completed_at, notes |

### 1.7 Gestion de la maintenance
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `maintenance_requests` | Demandes de maintenance | id, room_id, reported_by, assigned_to, issue_type, description, priority, status, reported_at, resolved_at |

### 1.8 Notifications
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `notifications` | Notifications système | id, user_id, type, title, message, is_read, related_entity_type, related_entity_id, created_at |

### 1.9 Audit
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `audit_logs` | Logs d'audit | id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at |

---

## 🧘 2. MODULE SPA (13 tables)

### 2.1 Services spa
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `spa_categories` | Catégories de services spa | id, name, description, icon, display_order, is_active |
| `spa_services` | Services spa disponibles | id, category_id, name, description, duration, price, is_active |

### 2.2 Thérapeutes
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `spa_therapists` | Thérapeutes spa | id, first_name, last_name, email, phone, specialties, bio, is_active |

### 2.3 Réservations spa
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `spa_bookings` | Réservations spa | id, guest_id, service_id, therapist_id, booking_date, start_time, end_time, status, total_amount, notes |

### 2.4 Forfaits spa
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `spa_packages` | Forfaits spa | id, name, description, total_duration, regular_price, package_price, is_active |
| `spa_package_services` | Services inclus dans les forfaits | id, package_id, service_id, service_order |

### 2.5 Produits spa
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `spa_products` | Produits spa | id, name, description, category, brand, price, sku, is_active |
| `spa_inventory` | Inventaire des produits | id, product_id, quantity, min_quantity, last_restock_date, supplier |

### 2.6 Traitements et avis
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `spa_treatments` | Historique des traitements | id, booking_id, therapist_id, treatment_notes, products_used, client_feedback |
| `spa_reviews` | Avis clients | id, booking_id, guest_id, service_id, rating, comment, is_verified |

### 2.7 Promotions et abonnements
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `spa_promotions` | Promotions spa | id, name, description, discount_type, discount_value, start_date, end_date, is_active |
| `spa_memberships` | Abonnements spa | id, guest_id, membership_type, start_date, end_date, status, monthly_fee |
| `spa_member_bookings` | Réservations des membres | id, membership_id, booking_id, discount_applied |

---

## 🍽️ 3. MODULE RESTAURANT (9 tables)

### 3.1 Menu
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `restaurant_categories` | Catégories de menu | id, name, description, display_order, is_active |
| `restaurant_menu_items` | Articles du menu | id, category_id, name, description, price, ingredients, allergens, is_available |

### 3.2 Tables et réservations
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `restaurant_tables` | Tables du restaurant | id, table_number, capacity, location, status, is_active |
| `restaurant_reservations` | Réservations restaurant | id, guest_id, table_id, reservation_date, reservation_time, party_size, status, special_requests |

### 3.3 Commandes
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `restaurant_orders` | Commandes | id, table_id, guest_id, order_date, order_time, status, total_amount, payment_status |
| `restaurant_order_items` | Articles commandés | id, order_id, menu_item_id, quantity, unit_price, special_instructions |

### 3.4 Inventaire et fournisseurs
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `restaurant_inventory` | Inventaire restaurant | id, item_name, category, quantity, unit, min_quantity, supplier_id, last_restock_date |
| `restaurant_suppliers` | Fournisseurs | id, name, contact_person, email, phone, address, products_supplied |

### 3.5 Personnel
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `restaurant_staff_shifts` | Horaires du personnel | id, staff_id, shift_date, start_time, end_time, role, notes |

---

## 🌐 4. MODULE RÉSERVATION EN LIGNE (6 tables)

### 4.1 Réservations en ligne
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `online_bookings` | Réservations publiques | id, booking_reference, check_in_date, check_out_date, status, total_amount, promo_code_id, source_id |

### 4.2 Clients en ligne
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `online_booking_guests` | Clients des réservations en ligne | id, online_booking_id, first_name, last_name, email, phone, is_primary_guest |

### 4.3 Chambres réservées
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `online_booking_rooms` | Chambres réservées en ligne | id, online_booking_id, room_type_id, quantity, price_per_night, total_price |

### 4.4 Paiements en ligne
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `online_booking_payments` | Paiements en ligne | id, online_booking_id, amount, payment_method, payment_status, transaction_id, payment_date |

### 4.5 Codes promo et sources
| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `promo_codes` | Codes promotionnels | id, code, discount_type, discount_value, start_date, end_date, max_uses, current_uses, is_active |
| `booking_sources` | Sources de réservation | id, name, description, commission_rate, is_active |

---

## 🔍 VÉRIFICATION DES TABLES

Pour vérifier que toutes les tables existent dans votre base de données, exécutez le script:

```sql
-- Voir le fichier: database/verify-all-tables.sql
```

Ce script vous donnera:
1. ✅ Nombre de tables par module
2. ✅ Liste détaillée de toutes les tables
3. ✅ Tables manquantes (si applicable)
4. ✅ Résumé complet

---

## 📊 STATISTIQUES

### Par module
- **Tables principales**: 10 tables (24%)
- **Module Spa**: 13 tables (32%)
- **Module Restaurant**: 9 tables (22%)
- **Réservation en ligne**: 6 tables (15%)
- **Autres**: 3 tables (7%)

### Par fonctionnalité
- **Gestion des réservations**: 4 tables
- **Gestion des clients**: 3 tables
- **Gestion des services**: 15 tables
- **Gestion des paiements**: 3 tables
- **Gestion du personnel**: 2 tables
- **Inventaire**: 3 tables
- **Notifications et audit**: 2 tables
- **Autres**: 9 tables

---

## 📝 SCRIPTS SQL DISPONIBLES

| Script | Description | Emplacement |
|--------|-------------|-------------|
| `schema.sql` | Tables principales | `database/schema.sql` |
| `spa-module.sql` | Tables spa | `database/spa-module.sql` |
| `restaurant-module.sql` | Tables restaurant | `database/restaurant-module.sql` |
| `online-booking-module.sql` | Tables réservation en ligne | `database/online-booking-module.sql` |
| `verify-all-tables.sql` | Vérification des tables | `database/verify-all-tables.sql` |

---

## 🎯 ORDRE D'EXÉCUTION DES SCRIPTS

Pour créer toutes les tables dans le bon ordre:

1. **D'abord**: `schema.sql` (tables principales avec dépendances)
2. **Ensuite**: `spa-module.sql` (module spa)
3. **Puis**: `restaurant-module.sql` (module restaurant)
4. **Enfin**: `online-booking-module.sql` (réservation en ligne)
5. **Vérification**: `verify-all-tables.sql` (vérifier que tout est créé)

---

## 🔗 RELATIONS ENTRE LES TABLES

### Relations principales
- `bookings` → `guests` (guest_id)
- `bookings` → `rooms` (room_id)
- `payments` → `bookings` (booking_id)
- `rooms` → `room_types` (room_type_id)
- `housekeeping_tasks` → `rooms` (room_id)
- `maintenance_requests` → `rooms` (room_id)

### Relations spa
- `spa_bookings` → `guests` (guest_id)
- `spa_bookings` → `spa_services` (service_id)
- `spa_bookings` → `spa_therapists` (therapist_id)
- `spa_services` → `spa_categories` (category_id)
- `spa_package_services` → `spa_packages` (package_id)
- `spa_package_services` → `spa_services` (service_id)

### Relations restaurant
- `restaurant_orders` → `restaurant_tables` (table_id)
- `restaurant_orders` → `guests` (guest_id)
- `restaurant_order_items` → `restaurant_orders` (order_id)
- `restaurant_order_items` → `restaurant_menu_items` (menu_item_id)
- `restaurant_menu_items` → `restaurant_categories` (category_id)

### Relations réservation en ligne
- `online_booking_guests` → `online_bookings` (online_booking_id)
- `online_booking_rooms` → `online_bookings` (online_booking_id)
- `online_booking_payments` → `online_bookings` (online_booking_id)
- `online_bookings` → `promo_codes` (promo_code_id)
- `online_bookings` → `booking_sources` (source_id)

---

**Total: 41 tables pour un système de gestion hôtelière complet!** 🏨
