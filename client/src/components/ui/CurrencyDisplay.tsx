/**
 * CurrencyDisplay Component
 * 
 * Reusable component to display prices with the selected currency format.
 * Automatically respects the user's currency preference from Settings.
 */

import { useCurrencyFormat } from '@/utils/currency';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
}

export const CurrencyDisplay = ({ amount, className = '' }: CurrencyDisplayProps) => {
  const { formatPrice } = useCurrencyFormat();
  
  return (
    <span className={className}>
      {formatPrice(amount)}
    </span>
  );
};
