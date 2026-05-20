import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

const colorVariants: Record<string, { gradient: string; iconBg: string; glow: string; shadow: string }> = {
  'bg-seafoam-400': {
    gradient: 'from-seafoam-400 via-seafoam-500 to-seafoam-600',
    iconBg: 'from-seafoam-500 to-seafoam-700',
    glow: 'shadow-seafoam-500/50',
    shadow: 'shadow-seafoam-200 dark:shadow-seafoam-900/30'
  },
  'bg-gold-400': {
    gradient: 'from-gold-400 via-gold-500 to-amber-600',
    iconBg: 'from-gold-500 to-amber-700',
    glow: 'shadow-gold-500/50',
    shadow: 'shadow-gold-200 dark:shadow-gold-900/30'
  },
  'bg-greybrown-400': {
    gradient: 'from-greybrown-400 via-greybrown-500 to-greybrown-600',
    iconBg: 'from-greybrown-500 to-greybrown-700',
    glow: 'shadow-greybrown-500/50',
    shadow: 'shadow-greybrown-200 dark:shadow-greybrown-900/30'
  },
  'bg-seafoam-500': {
    gradient: 'from-seafoam-500 via-teal-500 to-cyan-600',
    iconBg: 'from-teal-600 to-cyan-700',
    glow: 'shadow-teal-500/50',
    shadow: 'shadow-teal-200 dark:shadow-teal-900/30'
  },
  'bg-blue-400': {
    gradient: 'from-blue-400 via-blue-500 to-indigo-600',
    iconBg: 'from-blue-500 to-indigo-700',
    glow: 'shadow-blue-500/50',
    shadow: 'shadow-blue-200 dark:shadow-blue-900/30'
  },
  'bg-green-400': {
    gradient: 'from-green-400 via-emerald-500 to-teal-600',
    iconBg: 'from-emerald-500 to-teal-700',
    glow: 'shadow-green-500/50',
    shadow: 'shadow-green-200 dark:shadow-green-900/30'
  },
  'bg-purple-400': {
    gradient: 'from-purple-400 via-violet-500 to-purple-600',
    iconBg: 'from-violet-500 to-purple-700',
    glow: 'shadow-purple-500/50',
    shadow: 'shadow-purple-200 dark:shadow-purple-900/30'
  },
  'bg-yellow-400': {
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    iconBg: 'from-amber-500 to-orange-600',
    glow: 'shadow-yellow-500/50',
    shadow: 'shadow-yellow-200 dark:shadow-yellow-900/30'
  },
  'bg-red-400': {
    gradient: 'from-red-400 via-rose-500 to-pink-600',
    iconBg: 'from-rose-500 to-pink-700',
    glow: 'shadow-red-500/50',
    shadow: 'shadow-red-200 dark:shadow-red-900/30'
  }
};

export const StatCard = ({ title, value, icon: Icon, trend, color }: StatCardProps) => {
  const colors = colorVariants[color] || colorVariants['bg-seafoam-400'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl ${colors.shadow} hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700`}
    >
      {/* Animated Background Gradient */}
      <motion.div
        animate={{
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-5`}
      />

      {/* Decorative Circles */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
      <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2 tracking-wide uppercase">
            {title}
          </p>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-3"
          >
            {value}
          </motion.h3>
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`flex items-center gap-1.5 text-sm font-semibold ${
                trend.isPositive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-xs text-gray-500 dark:text-slate-400 font-normal">vs last month</span>
            </motion.div>
          )}
        </div>

        {/* Icon with Gradient Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          whileHover={{ rotate: 360, scale: 1.1 }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl blur-xl ${colors.glow} opacity-60`} />
          
          {/* Icon Container */}
          <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${colors.iconBg} shadow-lg`}>
            <Icon className="w-7 h-7 text-white drop-shadow-lg" strokeWidth={2.5} />
          </div>
        </motion.div>
      </div>

      {/* Bottom Accent Bar with Gradient */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.gradient} origin-left`}
      />

      {/* Shimmer Effect on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};
