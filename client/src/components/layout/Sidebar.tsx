import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Bed,
  Calendar,
  Users,
  CreditCard,
  UserCog,
  Settings,
  ChevronLeft,
  Hotel,
  Bell,
  DoorOpen,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { canAccessRoute } from '@/utils/permissions';
import { useTranslation } from 'react-i18next';

export const Sidebar = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  const menuSections = [
    {
      items: [
        { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/dashboard' },
        { icon: Calendar, label: t('nav.bookings'), path: '/bookings' },
        { icon: DoorOpen, label: t('nav.frontDesk'), path: '/front-desk' },
        { icon: Bed, label: t('nav.rooms'), path: '/rooms' },
        { icon: Users, label: t('nav.guests'), path: '/guests' },
        { icon: CreditCard, label: t('nav.payments'), path: '/payments' },
        { icon: FileText, label: t('nav.reports'), path: '/reports' },
        { icon: Sparkles, label: t('nav.housekeeping'), path: '/housekeeping' },
        { icon: UserCog, label: t('nav.staff'), path: '/staff' },
      ],
    },
    {
      divider: true,
      items: [
        { icon: Bell, label: t('nav.notifications'), path: '/notifications' },
        { icon: Settings, label: t('nav.settings'), path: '/settings' },
      ],
    },
  ];

  // Filter menu items based on user permissions
  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      user?.role ? canAccessRoute(user.role, item.path) : false
    ),
  })).filter(section => section.items.length > 0);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      className="bg-gradient-to-b from-slate-700 to-slate-800 text-white h-screen sticky top-0 shadow-xl"
    >
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Hotel className="w-8 h-8" />
            <span className="font-bold text-xl">Hotel PMS</span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="mt-8 px-3 space-y-1">
        {filteredSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.divider && !collapsed && (
              <div className="my-4 border-t border-slate-600"></div>
            )}
            {section.divider && collapsed && (
              <div className="my-4 border-t border-slate-600 mx-2"></div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all ${
                      isActive
                        ? 'bg-seafoam-500 text-white shadow-lg'
                        : 'hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-medium text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </motion.aside>
  );
};
