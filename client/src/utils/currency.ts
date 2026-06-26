/**
 * Currency Formatting Utility
 * 
 * Provides centralized currency formatting for the entire application.
 * Respects user's selected currency from Settings.
 * 
 * IMPORTANT: All prices in the database are stored in USD.
 * This utility automatically converts to the selected currency using live exchange rates.
 */

import { useSettingsStore } from '@/store/settingsStore';
import { useState, useEffect } from 'react';
import { convertFromUSD, getExchangeRates } from '@/services/currencyService';

/**
 * Hook to format prices with the selected currency and automatic conversion
 */
export const useCurrencyFormat = () => {
  const { currency, currency_symbol, currency_position } = useSettingsStore();
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number } | null>(null);

  // Fetch exchange rates on mount and when currency changes
  useEffect(() => {
    getExchangeRates().then(setExchangeRates);
  }, [currency]);

  /**
   * Format price with currency conversion
   * @param amountUSD - Amount in USD (database format)
   * @param skipConversion - Skip conversion (for already converted amounts)
   */
  const formatPrice = (amountUSD: number | string | null | undefined, skipConversion: boolean = false): string => {
    if (amountUSD === null || amountUSD === undefined || amountUSD === '') {
      return '-';
    }

    // Convert to number if it's a string
    const numericAmount = typeof amountUSD === 'string' ? parseFloat(amountUSD) : amountUSD;
    
    // Check if conversion resulted in a valid number
    if (isNaN(numericAmount)) {
      return '-';
    }

    let amount = numericAmount;

    // Convert from USD to selected currency
    if (!skipConversion && exchangeRates && currency !== 'USD') {
      const rate = exchangeRates[currency];
      if (rate) {
        amount = numericAmount * rate;
      }
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

  /**
   * Convert and format async (for when you need the promise)
   */
  const formatPriceAsync = async (amountUSD: number | string | null | undefined): Promise<string> => {
    if (amountUSD === null || amountUSD === undefined || amountUSD === '') {
      return '-';
    }

    // Convert to number if it's a string
    const numericAmount = typeof amountUSD === 'string' ? parseFloat(amountUSD) : amountUSD;
    
    // Check if conversion resulted in a valid number
    if (isNaN(numericAmount)) {
      return '-';
    }

    // Convert from USD to selected currency
    const amount = await convertFromUSD(numericAmount, currency);

    // CDF and XAF use 0 decimal places
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

  const getCurrencySymbol = (): string => {
    return currency_symbol;
  };

  const getCurrencyCode = (): string => {
    return currency;
  };

  const getExchangeRate = (): number => {
    if (!exchangeRates || currency === 'USD') return 1;
    return exchangeRates[currency] || 1;
  };

  return {
    formatPrice,
    formatPriceAsync,
    getCurrencySymbol,
    getCurrencyCode,
    getExchangeRate,
  };
};

/**
 * Standalone function to format price (for use outside React components)
 */
export const formatCurrency = (
  amount: number | string | null | undefined, 
  currency: string = 'USD',
  currency_symbol: string = '$',
  currency_position: string = 'before'
): string => {
  if (amount === null || amount === undefined || amount === '') {
    return '-';
  }

  // Convert to number if it's a string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if conversion resulted in a valid number
  if (isNaN(numericAmount)) {
    return '-';
  }

  const decimals = (currency === 'CDF' || currency === 'XAF') ? 0 : 2;
  const formatted = numericAmount.toFixed(decimals);
  
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const finalAmount = parts.join('.');

  if (currency_position === 'before') {
    return `${currency_symbol} ${finalAmount}`;
  }
  return `${finalAmount} ${currency_symbol}`;
};
