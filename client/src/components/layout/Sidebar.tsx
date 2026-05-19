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
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { canAccessRoute } from '@/utils/permissions';
import { useTranslation } from 'react-i18next';

export const Sidebar = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Mobile sidebar toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Desktop sidebar width
  const desktopWidth = collapsed ? 80 : 256;
  
  // Mobile sidebar styles
  const mobileStyles = isMobile ? {
    position: 'fixed' as const,
    top: 0,
    left: mobileMenuOpen ? 0 : '-100%',
    width: '280px',
    height: '100vh',
    zIndex: 50,
    transition: 'left 0.3s ease-in-out',
  } : {};

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-40 p-2 bg-slate-700 text-white rounded-lg shadow-lg hover:bg-slate-600 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Mobile Backdrop */}
      {isMobile && mobileMenuOpen && (
        <div
          onClick={toggleMobileMenu}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        animate={!isMobile ? { width: desktopWidth } : {}}
        style={mobileStyles}
        className="bg-gradient-to-b from-slate-700 to-slate-800 text-white h-screen sticky top-0 shadow-xl border-r border-slate-600 flex flex-col z-30"
      >
        <div className="p-6 flex items-center justify-between flex-shrink-0">
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Hotel className="w-8 h-8" />
              <span className="font-bold text-xl">Hotel PMS</span>
            </motion.div>
          )}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-slate-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-seafoam-400"
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          )}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="mt-8 px-3 space-y-1 flex-1 overflow-y-auto sidebar-scroll">
          {filteredSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.divider && (
                <div className="my-4 border-t border-slate-700"></div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link key={item.path} to={item.path} onClick={handleLinkClick} className="focus:outline-none">
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all ${
                        isActive
                          ? 'bg-seafoam-500 text-white shadow-lg'
                          : 'hover:bg-slate-600 text-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {(!collapsed || isMobile) && (
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
    </>
  );
};
