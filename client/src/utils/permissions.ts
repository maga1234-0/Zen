export type Role = 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'accountant' | 'maintenance' 
  | 'restaurant_server' | 'restaurant_cashier' | 'restaurant_manager' | 'restaurant_chef';

export type Permission = 
  | 'dashboard.view'
  | 'reservations.view' | 'reservations.create' | 'reservations.edit' | 'reservations.delete'
  | 'front_desk.view' | 'front_desk.checkin' | 'front_desk.checkout'
  | 'rooms.view' | 'rooms.create' | 'rooms.edit' | 'rooms.delete' | 'rooms.update_status'
  | 'guests.view' | 'guests.create' | 'guests.edit' | 'guests.delete'
  | 'billing.view' | 'billing.create' | 'billing.process' | 'billing.refund'
  | 'reports.view' | 'reports.financial' | 'reports.export'
  | 'housekeeping.view' | 'housekeeping.manage'
  | 'maintenance.view' | 'maintenance.update'
  | 'staff.view' | 'staff.manage'
  | 'notifications.view'
  | 'settings.view' | 'settings.edit'
  // Restaurant permissions
  | 'restaurant.view'
  | 'restaurant.orders.view' | 'restaurant.orders.create' | 'restaurant.orders.update' | 'restaurant.orders.update_status' | 'restaurant.orders.update_payment'
  | 'restaurant.menu.view' | 'restaurant.menu.create' | 'restaurant.menu.update' | 'restaurant.menu.delete'
  | 'restaurant.tables.view' | 'restaurant.tables.update'
  | 'restaurant.payments.create' | 'restaurant.payments.refund'
  | 'restaurant.stats.view' | 'restaurant.stats.view_production'
  | 'restaurant.print.tickets' | 'restaurant.print.invoices';

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'dashboard.view',
    'reservations.view', 'reservations.create', 'reservations.edit', 'reservations.delete',
    'front_desk.view', 'front_desk.checkin', 'front_desk.checkout',
    'rooms.view', 'rooms.create', 'rooms.edit', 'rooms.delete', 'rooms.update_status',
    'guests.view', 'guests.create', 'guests.edit', 'guests.delete',
    'billing.view', 'billing.create', 'billing.process', 'billing.refund',
    'reports.view', 'reports.financial', 'reports.export',
    'housekeeping.view', 'housekeeping.manage',
    'maintenance.view', 'maintenance.update',
    'staff.view', 'staff.manage',
    'notifications.view',
    'settings.view', 'settings.edit',
    // Restaurant - Full access
    'restaurant.view',
    'restaurant.orders.view', 'restaurant.orders.create', 'restaurant.orders.update', 'restaurant.orders.update_status', 'restaurant.orders.update_payment',
    'restaurant.menu.view', 'restaurant.menu.create', 'restaurant.menu.update', 'restaurant.menu.delete',
    'restaurant.tables.view', 'restaurant.tables.update',
    'restaurant.payments.create', 'restaurant.payments.refund',
    'restaurant.stats.view', 'restaurant.stats.view_production',
    'restaurant.print.tickets', 'restaurant.print.invoices',
  ],
  manager: [
    'dashboard.view',
    'reservations.view', 'reservations.create', 'reservations.edit', 'reservations.delete',
    'front_desk.view', 'front_desk.checkin', 'front_desk.checkout',
    'rooms.view', 'rooms.create', 'rooms.edit', 'rooms.delete', 'rooms.update_status',
    'guests.view', 'guests.create', 'guests.edit', 'guests.delete',
    'billing.view', 'billing.create', 'billing.process', 'billing.refund',
    'reports.view', 'reports.financial', 'reports.export',
    'housekeeping.view', 'housekeeping.manage',
    'maintenance.view', 'maintenance.update',
    'staff.view', 'staff.manage',
    'notifications.view',
    'settings.view',
    // Restaurant - Full access
    'restaurant.view',
    'restaurant.orders.view', 'restaurant.orders.create', 'restaurant.orders.update', 'restaurant.orders.update_status', 'restaurant.orders.update_payment',
    'restaurant.menu.view', 'restaurant.menu.create', 'restaurant.menu.update', 'restaurant.menu.delete',
    'restaurant.tables.view', 'restaurant.tables.update',
    'restaurant.payments.create', 'restaurant.payments.refund',
    'restaurant.stats.view', 'restaurant.stats.view_production',
    'restaurant.print.tickets', 'restaurant.print.invoices',
  ],
  receptionist: [
    'dashboard.view',
    'reservations.view', 'reservations.create', 'reservations.edit',
    'front_desk.view', 'front_desk.checkin', 'front_desk.checkout',
    'rooms.view',
    'guests.view', 'guests.edit',
    'billing.view', 'billing.create', 'billing.process',
    'notifications.view',
    // Restaurant - Limited access (can view orders and add to room folio)
    'restaurant.view',
    'restaurant.orders.view',
    'restaurant.payments.create', // Can add to room folio
  ],
  housekeeping: [
    'dashboard.view',
    'rooms.view', 'rooms.update_status',
    'housekeeping.view', 'housekeeping.manage',
    'notifications.view',
  ],
  maintenance: [
    'dashboard.view',
    'rooms.view', 'rooms.update_status',
    'housekeeping.view',
    'notifications.view',
  ],
  accountant: [
    'dashboard.view',
    'reservations.view',
    'billing.view', 'billing.create', 'billing.process', 'billing.refund',
    'reports.view', 'reports.financial', 'reports.export',
    'notifications.view',
  ],
  // ============================================
  // RESTAURANT ROLES
  // ============================================
  restaurant_server: [
    'dashboard.view',
    'restaurant.view',
    'restaurant.orders.view', 'restaurant.orders.create', // Can create orders
    'restaurant.menu.view', // Can view menu
    'restaurant.tables.view', // Can view tables
    'restaurant.print.tickets', // Can print tickets
    'notifications.view',
    'rooms.view', // To assign to rooms
  ],
  restaurant_cashier: [
    'dashboard.view',
    'restaurant.view',
    'restaurant.orders.view', // Can view all orders
    'restaurant.orders.update_payment', // Can process payments
    'restaurant.menu.view', // Can view menu
    'restaurant.payments.create', // Can create payments
    'restaurant.payments.refund', // Can refund
    'restaurant.print.invoices', // Can print invoices
    'notifications.view',
  ],
  restaurant_manager: [
    'dashboard.view',
    'restaurant.view',
    'restaurant.orders.view', 'restaurant.orders.create', 'restaurant.orders.update', 'restaurant.orders.update_status', 'restaurant.orders.update_payment',
    'restaurant.menu.view', 'restaurant.menu.create', 'restaurant.menu.update', 'restaurant.menu.delete',
    'restaurant.tables.view', 'restaurant.tables.update',
    'restaurant.payments.create', 'restaurant.payments.refund',
    'restaurant.stats.view', // Can view all stats
    'restaurant.print.tickets', 'restaurant.print.invoices',
    'notifications.view',
    'rooms.view', // To assign to rooms
  ],
  restaurant_chef: [
    'dashboard.view',
    'restaurant.view',
    'restaurant.orders.view', // Can view orders
    'restaurant.orders.update_status', // Can update status (preparing, ready)
    'restaurant.menu.view', // Can view menu
    'restaurant.stats.view_production', // Can view production stats
    'restaurant.print.tickets', // Can print kitchen tickets
    'notifications.view',
  ],
};

export const hasPermission = (userRole: string, permission: Permission): boolean => {
  const role = userRole as Role;
  return rolePermissions[role]?.includes(permission) || false;
};

export const hasAnyPermission = (userRole: string, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const canAccessRoute = (userRole: string, path: string): boolean => {
  const routePermissions: Record<string, Permission[]> = {
    '/dashboard': ['dashboard.view'],
    '/bookings': ['reservations.view'],
    '/front-desk': ['front_desk.view'],
    '/rooms': ['rooms.view'],
    '/guests': ['guests.view'],
    '/payments': ['billing.view'],
    '/reports': ['reports.view'],
    '/housekeeping': ['housekeeping.view'],
    '/staff': ['staff.view'],
    '/notifications': ['notifications.view'],
    '/settings': ['settings.view'],
    '/restaurant': ['restaurant.view'],
    '/spa': ['dashboard.view'], // Everyone can access spa for now
  };

  const requiredPermissions = routePermissions[path];
  if (!requiredPermissions) return true;

  return hasAnyPermission(userRole, requiredPermissions);
};

export const getAccessibleRoutes = (userRole: string) => {
  const allRoutes = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/bookings', label: 'Reservations' },
    { path: '/front-desk', label: 'Front Desk' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/guests', label: 'Guests' },
    { path: '/payments', label: 'Billing' },
    { path: '/reports', label: 'Reports' },
    { path: '/housekeeping', label: 'Housekeeping' },
    { path: '/staff', label: 'Staff' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/settings', label: 'Settings' },
    { path: '/restaurant', label: 'Restaurant' },
    { path: '/spa', label: 'Spa' },
  ];

  return allRoutes.filter(route => canAccessRoute(userRole, route.path));
};
