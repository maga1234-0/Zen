import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
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

export const StatCard = ({ title, value, icon: Icon, trend, color }: StatCardProps) => {
  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"
          >
            {value}
          </motion.h3>
          {trend && (
            <p className={`text-xs sm:text-sm mt-1 sm:mt-2 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${color}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${color}`}></div>
    </Card>
  );
};
