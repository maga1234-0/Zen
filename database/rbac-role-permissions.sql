-- ============================================
-- ATTRIBUTION DES PERMISSIONS AUX RÔLES
-- ============================================

-- ============================================
-- 1. SUPER ADMINISTRATEUR - TOUTES LES PERMISSIONS
-- ============================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE code = 'super_admin'),
    id
FROM permissions;

-- ============================================
-- 2. DIRECTEUR HÔTEL
-- ============================================

INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE code = 'hotel_manager'),
    id
FROM permissions
WHERE code IN (
    -- Réservations (toutes)
    'reservation.create', 'reservation.read', 'reservation.update', 'reservation.delete',
    'reservation.cancel', 'reservation.confirm', 'reservation.checkin', 'reservation.checkout',
    'reservation.change_rate',
    -- Chambres (toutes)
    'room.create', 'room.read', 'room.update', 'room.delete',
    'room.assign', 'room.change_status', 'room.maintenance',
    -- Clients (toutes)
    'guest.create', 'guest.read', 'guest.update', 'guest.delete', 'guest.history',
    -- Paiements (toutes)
    'payment.create', 'payment.read', 'payment.update', 'payment.delete',
    'payment.refund', 'payment.validate', 'payment.cancel',
    -- Restaurant (toutes)
    'restaurant.order.create', 'restaurant.order.read', 'restaurant.order.update',
    'restaurant.order.cancel', 'restaurant.payment.create', 'restaurant.report.read',
    'restaurant.menu.manage', 'restaurant.table.manage',
    -- Spa (toutes)
    'spa.booking.create', 'spa.booking.read', 'spa.booking.update', 'spa.booking.cancel',
    'spa.service.manage', 'spa.therapist.manage', 'spa.report.read', 'spa.payment.create',
    -- Boutique (toutes)
    'shop.sale.create', 'shop.sale.read', 'shop.stock.manage',
    'shop.product.manage', 'shop.report.read',
    -- Housekeeping (toutes)
    'housekeeping.task.read', 'housekeeping.task.create', 'housekeeping.task.assign',
    'housekeeping.task.complete', 'housekeeping.report.read',
    -- Rapports (tous)
    'report.read', 'report.export', 'report.financial',
    'report.occupancy', 'report.revenue',
    -- Folio (tous)
    'folio.read', 'folio.update', 'folio.charge.add',
    'folio.charge.remove', 'folio.close',
    -- Utilisateurs (tous)
    'user.create', 'user.read', 'user.update', 'user.delete',
    'user.role.manage', 'user.password.reset'
);
