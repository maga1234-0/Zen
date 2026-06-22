/**
 * Currency Formatting Utility
 * 
 * Provides centralized currency formatting for the entire application.
 * Respects user's selected currency from Settings.
 */

import { useSettingsStore } from '@/store/settingsStore';

/**
 * Hook to format prices with the selected currency
 */
export const useCurrencyFormat = () => {
  const { currency, currency_symbol, currency_position } = useSettingsStore();

  const formatPrice = (amount: number): string => {
    if (amount === null || amount === undefined) {
      return '-';
    }

    // CDF and XAF use 0 decimal places
    const decimals = (currency === 'CDF' || currency === 'XAF') ? 0 : 2;
    
    // Format the number
    const formatted = amount.toFixed(decimals);
    
    // Add thousands separator
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const finalAmount = parts.join('.');

    // Position the symbol
    if (currency_position === 'before') {
      return `${currency_symbol} ${finalAmount}`;
    }
    return `${finalAmount} ${currency_symbol}`;
  };

  const getCurrencySymbol = (): string => {
    return currency_symbol;
  };

  const getCurrencyCode = (): string => {
    return currency;
  };

  return {
    formatPrice,
    getCurrencySymbol,
    getCurrencyCode,
  };
};

/**
 * Standalone function to format price (for use outside React components)
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD',
  currency_symbol: string = '$',
  currency_position: string = 'before'
): string => {
  if (amount === null || amount === undefined) {
    return '-';
  }

  const decimals = (currency === 'CDF' || currency === 'XAF') ? 0 : 2;
  const formatted = amount.toFixed(decimals);
  
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const finalAmount = parts.join('.');

  if (currency_position === 'before') {
    return `${currency_symbol} ${finalAmount}`;
  }
  return `${finalAmount} ${currency_symbol}`;
};
