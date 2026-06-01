-- ============================================
-- PERMISSIONS RBAC - PMS HÔTELIER
-- ============================================

-- ============================================
-- PERMISSIONS - MODULE RÉSERVATIONS
-- ============================================

INSERT INTO permissions (name, code, module, action, description, is_system_permission) VALUES
('Créer réservation', 'reservation.create', 'reservation', 'create', 'Créer une nouvelle réservation', true),
('Voir réservations', 'reservation.read', 'reservation', 'read', 'Consulter les réservations', true),
('Modifier réservation', 'reservation.update', 'reservation', 'update', 'Modifier une réservation existante', true),
('Supprimer réservation', 'reservation.delete', 'reservation', 'delete', 'Supprimer une réservation', true),
('Annuler réservation', 'reservation.cancel', 'reservation', 'cancel', 'Annuler une réservation', true),
('Confirmer réservation', 'reservation.confirm', 'reservation', 'confirm', 'Confirmer une réservation', true),
('Check-in', 'reservation.checkin', 'reservation', 'checkin', 'Effectuer un check-in', true),
('Check-out', 'reservation.checkout', 'reservation', 'checkout', 'Effectuer un check-out', true),
('Modifier tarif', 'reservation.change_rate', 'reservation', 'change_rate', 'Modifier le tarif d''une réservation', true),

-- ============================================
-- PERMISSIONS - MODULE CHAMBRES
-- ============================================

('Créer chambre', 'room.create', 'room', 'create', 'Ajouter une nouvelle chambre', true),
('Voir chambres', 'room.read', 'room', 'read', 'Consulter les chambres', true),
('Modifier chambre', 'room.update', 'room', 'update', 'Modifier les informations d''une chambre', true),
('Supprimer chambre', 'room.delete', 'room', 'delete', 'Supprimer une chambre', true),
('Assigner chambre', 'room.assign', 'room', 'assign', 'Assigner une chambre à une réservation', true),
('Changer statut chambre', 'room.change_status', 'room', 'change_status', 'Modifier le statut d''une chambre', true),
('Mettre en maintenance', 'room.maintenance', 'room', 'maintenance', 'Mettre une chambre en maintenance', true),
('Nettoyer chambre', 'room.clean', 'room', 'clean', 'Marquer une chambre comme nettoyée', true),
('Inspecter chambre', 'room.inspect', 'room', 'inspect', 'Inspecter une chambre', true),

-- ============================================
-- PERMISSIONS - MODULE CLIENTS
-- ============================================

('Créer client', 'guest.create', 'guest', 'create', 'Créer un nouveau client', true),
('Voir clients', 'guest.read', 'guest', 'read', 'Consulter les clients', true),
('Modifier client', 'guest.update', 'guest', 'update', 'Modifier les informations client', true),
('Supprimer client', 'guest.delete', 'guest', 'delete', 'Supprimer un client', true),
('Voir historique client', 'guest.history', 'guest', 'history', 'Consulter l''historique client', true),

-- ============================================
-- PERMISSIONS - MODULE PAIEMENTS
-- ============================================

('Créer paiement', 'payment.create', 'payment', 'create', 'Enregistrer un paiement', true),
('Voir paiements', 'payment.read', 'payment', 'read', 'Consulter les paiements', true),
('Modifier paiement', 'payment.update', 'payment', 'update', 'Modifier un paiement', true),
('Supprimer paiement', 'payment.delete', 'payment', 'delete', 'Supprimer un paiement', true),
('Rembourser', 'payment.refund', 'payment', 'refund', 'Effectuer un remboursement', true),
('Valider paiement', 'payment.validate', 'payment', 'validate', 'Valider un paiement', true),
('Annuler paiement', 'payment.cancel', 'payment', 'cancel', 'Annuler un paiement', true);

-- ============================================
-- PERMISSIONS - MODULE RESTAURANT
-- ============================================

INSERT INTO permissions (name, code, module, action, description, is_system_permission) VALUES
('Créer commande restaurant', 'restaurant.order.create', 'restaurant', 'create', 'Créer une commande restaurant', true),
('Voir commandes restaurant', 'restaurant.order.read', 'restaurant', 'read', 'Consulter les commandes', true),
('Modifier commande restaurant', 'restaurant.order.update', 'restaurant', 'update', 'Modifier une commande', true),
('Annuler commande restaurant', 'restaurant.order.cancel', 'restaurant', 'cancel', 'Annuler une commande', true),
('Paiement restaurant', 'restaurant.payment.create', 'restaurant', 'payment', 'Encaisser un paiement restaurant', true),
('Rapports restaurant', 'restaurant.report.read', 'restaurant', 'report', 'Consulter les rapports restaurant', true),
('Gérer menu', 'restaurant.menu.manage', 'restaurant', 'manage', 'Gérer le menu restaurant', true),
('Gérer tables', 'restaurant.table.manage', 'restaurant', 'manage', 'Gérer les tables restaurant', true),

-- ============================================
-- PERMISSIONS - MODULE SPA
-- ============================================

('Créer réservation spa', 'spa.booking.create', 'spa', 'create', 'Créer une réservation spa', true),
('Voir réservations spa', 'spa.booking.read', 'spa', 'read', 'Consulter les réservations spa', true),
('Modifier réservation spa', 'spa.booking.update', 'spa', 'update', 'Modifier une réservation spa', true),
('Annuler réservation spa', 'spa.booking.cancel', 'spa', 'cancel', 'Annuler une réservation spa', true),
('Gérer services spa', 'spa.service.manage', 'spa', 'manage', 'Gérer les services spa', true),
('Gérer thérapeutes', 'spa.therapist.manage', 'spa', 'manage', 'Gérer les thérapeutes', true),
('Rapports spa', 'spa.report.read', 'spa', 'report', 'Consulter les rapports spa', true),
('Paiement spa', 'spa.payment.create', 'spa', 'payment', 'Encaisser un paiement spa', true),

-- ============================================
-- PERMISSIONS - MODULE BOUTIQUE
-- ============================================

('Créer vente boutique', 'shop.sale.create', 'shop', 'create', 'Créer une vente boutique', true),
('Voir ventes boutique', 'shop.sale.read', 'shop', 'read', 'Consulter les ventes', true),
('Gérer stock', 'shop.stock.manage', 'shop', 'manage', 'Gérer le stock boutique', true),
('Gérer produits', 'shop.product.manage', 'shop', 'manage', 'Gérer les produits', true),
('Rapports boutique', 'shop.report.read', 'shop', 'report', 'Consulter les rapports boutique', true);

-- ============================================
-- PERMISSIONS - MODULE HOUSEKEEPING
-- ============================================

INSERT INTO permissions (name, code, module, action, description, is_system_permission) VALUES
('Voir tâches housekeeping', 'housekeeping.task.read', 'housekeeping', 'read', 'Consulter les tâches de nettoyage', true),
('Créer tâche housekeeping', 'housekeeping.task.create', 'housekeeping', 'create', 'Créer une tâche de nettoyage', true),
('Assigner tâche', 'housekeeping.task.assign', 'housekeeping', 'assign', 'Assigner une tâche à un agent', true),
('Compléter tâche', 'housekeeping.task.complete', 'housekeeping', 'complete', 'Marquer une tâche comme complétée', true),
('Rapports housekeeping', 'housekeeping.report.read', 'housekeeping', 'report', 'Consulter les rapports housekeeping', true),

-- ============================================
-- PERMISSIONS - MODULE RAPPORTS
-- ============================================

('Voir rapports généraux', 'report.read', 'report', 'read', 'Consulter les rapports généraux', true),
('Exporter rapports', 'report.export', 'report', 'export', 'Exporter les rapports', true),
('Rapports financiers', 'report.financial', 'report', 'financial', 'Consulter les rapports financiers', true),
('Rapports occupancy', 'report.occupancy', 'report', 'occupancy', 'Consulter les rapports d''occupation', true),
('Rapports revenus', 'report.revenue', 'report', 'revenue', 'Consulter les rapports de revenus', true),

-- ============================================
-- PERMISSIONS - MODULE FOLIO
-- ============================================

('Voir folio', 'folio.read', 'folio', 'read', 'Consulter le folio client', true),
('Modifier folio', 'folio.update', 'folio', 'update', 'Modifier le folio client', true),
('Ajouter charge', 'folio.charge.add', 'folio', 'add', 'Ajouter une charge au folio', true),
('Supprimer charge', 'folio.charge.remove', 'folio', 'remove', 'Supprimer une charge du folio', true),
('Clôturer folio', 'folio.close', 'folio', 'close', 'Clôturer un folio', true),

-- ============================================
-- PERMISSIONS - MODULE UTILISATEURS
-- ============================================

('Créer utilisateur', 'user.create', 'user', 'create', 'Créer un nouvel utilisateur', true),
('Voir utilisateurs', 'user.read', 'user', 'read', 'Consulter les utilisateurs', true),
('Modifier utilisateur', 'user.update', 'user', 'update', 'Modifier un utilisateur', true),
('Supprimer utilisateur', 'user.delete', 'user', 'delete', 'Supprimer un utilisateur', true),
('Gérer rôles', 'user.role.manage', 'user', 'manage', 'Gérer les rôles utilisateurs', true),
('Réinitialiser mot de passe', 'user.password.reset', 'user', 'reset', 'Réinitialiser le mot de passe', true);

-- ============================================
-- PERMISSIONS - MODULE PARAMÈTRES
-- ============================================

INSERT INTO permissions (name, code, module, action, description, is_system_permission) VALUES
('Gérer paramètres', 'settings.manage', 'settings', 'manage', 'Gérer les paramètres système', true),
('Gérer hôtel', 'settings.hotel.manage', 'settings', 'manage', 'Gérer les informations de l''hôtel', true),
('Gérer types chambres', 'settings.room_type.manage', 'settings', 'manage', 'Gérer les types de chambres', true),
('Gérer tarifs', 'settings.rate.manage', 'settings', 'manage', 'Gérer les tarifs', true),
('Gérer taxes', 'settings.tax.manage', 'settings', 'manage', 'Gérer les taxes', true),

-- ============================================
-- PERMISSIONS - MODULE NOTIFICATIONS
-- ============================================

('Voir notifications', 'notification.read', 'notification', 'read', 'Consulter les notifications', true),
('Créer notification', 'notification.create', 'notification', 'create', 'Créer une notification', true),
('Marquer comme lu', 'notification.mark_read', 'notification', 'mark_read', 'Marquer une notification comme lue', true),

-- ============================================
-- PERMISSIONS - MODULE DASHBOARD
-- ============================================

('Voir dashboard', 'dashboard.read', 'dashboard', 'read', 'Accéder au tableau de bord', true),
('Voir statistiques', 'dashboard.stats', 'dashboard', 'stats', 'Consulter les statistiques', true),

-- ============================================
-- PERMISSIONS - PORTAIL CLIENT
-- ============================================

('Voir mes réservations', 'guest_portal.reservation.read', 'guest_portal', 'read', 'Consulter mes réservations', true),
('Modifier ma réservation', 'guest_portal.reservation.update', 'guest_portal', 'update', 'Modifier ma réservation', true),
('Annuler ma réservation', 'guest_portal.reservation.cancel', 'guest_portal', 'cancel', 'Annuler ma réservation', true),
('Voir mon folio', 'guest_portal.folio.read', 'guest_portal', 'read', 'Consulter mon folio', true),
('Réserver spa', 'guest_portal.spa.book', 'guest_portal', 'book', 'Réserver un service spa', true),
('Commander restaurant', 'guest_portal.restaurant.order', 'guest_portal', 'order', 'Commander au restaurant', true);
