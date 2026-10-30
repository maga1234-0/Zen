import { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const ChartContainer = ({ 
  title, 
  subtitle, 
  children, 
  className = '' 
}: ChartContainerProps) => {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};
