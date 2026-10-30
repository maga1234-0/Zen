import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardMinimalProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  description?: string;
}

export const StatCardMinimal = ({ 
  label, 
  value, 
  change, 
  icon: Icon,
  description 
}: StatCardMinimalProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
          {label}
        </p>
        {Icon && (
          <Icon className="w-5 h-5 text-gray-400 dark:text-slate-500" />
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-green-600 dark:text-green-400' : 
            isNegative ? 'text-red-600 dark:text-red-400' : 
            'text-gray-500 dark:text-slate-400'
          }`}>
            {isPositive && <TrendingUp className="w-4 h-4" />}
            {isNegative && <TrendingDown className="w-4 h-4" />}
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
