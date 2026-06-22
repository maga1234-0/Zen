/**
 * Currency Exchange Service
 * 
 * Handles currency conversion using live exchange rates
 */

// Exchange rates cache
let exchangeRatesCache: { [key: string]: number } | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Fetch live exchange rates from API
 * Base currency: USD
 */
async function fetchExchangeRates(): Promise<{ [key: string]: number }> {
  try {
    // Using exchangerate-api.com (free tier: 1500 requests/month)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Fallback to approximate rates if API fails
    return {
      USD: 1,
      CDF: 2800,      // 1 USD ≈ 2800 CDF (Franc Congolais)
      EUR: 0.92,      // 1 USD ≈ 0.92 EUR
      GBP: 0.79,      // 1 USD ≈ 0.79 GBP
      ZAR: 18.50,     // 1 USD ≈ 18.50 ZAR (Rand Sud-Africain)
      XAF: 605,       // 1 USD ≈ 605 XAF (Franc CFA)
    };
  }
}

/**
 * Get exchange rates (with caching)
 */
export async function getExchangeRates(): Promise<{ [key: string]: number }> {
  const now = Date.now();
  
  // Return cached rates if still valid
  if (exchangeRatesCache && (now - lastFetchTime) < CACHE_DURATION) {
    return exchangeRatesCache;
  }

  // Fetch new rates
  exchangeRatesCache = await fetchExchangeRates();
  lastFetchTime = now;
  
  return exchangeRatesCache;
}

/**
 * Convert amount from USD to target currency
 * @param amountUSD - Amount in USD
 * @param targetCurrency - Target currency code (CDF, EUR, etc.)
 * @returns Converted amount
 */
export async function convertFromUSD(
  amountUSD: number,
  targetCurrency: string
): Promise<number> {
  if (targetCurrency === 'USD') {
    return amountUSD;
  }

  const rates = await getExchangeRates();
  const rate = rates[targetCurrency];

  if (!rate) {
    console.warn(`Exchange rate for ${targetCurrency} not found, returning USD amount`);
    return amountUSD;
  }

  return amountUSD * rate;
}

/**
 * Convert amount from any currency to USD
 * @param amount - Amount in source currency
 * @param sourceCurrency - Source currency code
 * @returns Amount in USD
 */
export async function convertToUSD(
  amount: number,
  sourceCurrency: string
): Promise<number> {
  if (sourceCurrency === 'USD') {
    return amount;
  }

  const rates = await getExchangeRates();
  const rate = rates[sourceCurrency];

  if (!rate) {
    console.warn(`Exchange rate for ${sourceCurrency} not found, returning original amount`);
    return amount;
  }

  return amount / rate;
}

/**
 * Convert amount between any two currencies
 * @param amount - Amount in source currency
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @returns Converted amount
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Convert to USD first, then to target currency
  const amountInUSD = await convertToUSD(amount, fromCurrency);
  return await convertFromUSD(amountInUSD, toCurrency);
}

/**
 * Get current exchange rate between two currencies
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @returns Exchange rate
 */
export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const rates = await getExchangeRates();
  
  if (fromCurrency === 'USD') {
    return rates[toCurrency] || 1;
  }

  if (toCurrency === 'USD') {
    return 1 / (rates[fromCurrency] || 1);
  }

  // Convert via USD
  const toUSDRate = 1 / (rates[fromCurrency] || 1);
  const fromUSDRate = rates[toCurrency] || 1;
  
  return toUSDRate * fromUSDRate;
}
