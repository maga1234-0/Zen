export type Role = 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'accountant' | 'maintenance';

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
  | 'settings.view' | 'settings.edit';

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
    'settings.view', // Limited settings access
  ],
  receptionist: [
    'dashboard.view',
    'reservations.view', 'reservations.create', 'reservations.edit',
    'front_desk.view', 'front_desk.checkin', 'front_desk.checkout',
    'rooms.view',
    'guests.view', 'guests.edit',
    'billing.view', 'billing.create', 'billing.process',
    'notifications.view',
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
  ];

  return allRoutes.filter(route => canAccessRoute(userRole, route.path));
};
