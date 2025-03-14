import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

// Initialize dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Changed to 5000 to avoid conflict with React

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Get exchange rates (you'll need a free API key from a service like ExchangeRate-API)
const EXTERNAL_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const EXTERNAL_API_URL = 'https://api.exchangerate-api.com/v4/latest/';

// Cache exchange rates to reduce external API calls
let ratesCache = {};
let lastCacheUpdate = null;

// Function to fetch fresh rates
async function fetchExchangeRates(baseCurrency) {
  try {
    const response = await axios.get(`${EXTERNAL_API_URL}${baseCurrency}`);
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw new Error('Failed to fetch exchange rates');
  }
}

// Get all available exchange rates for a base currency
app.get('/api/rates/:baseCurrency', async (req, res) => {
  try {
    const { baseCurrency } = req.params;
    const rates = await fetchExchangeRates(baseCurrency.toUpperCase());

    res.json({
      base: baseCurrency.toUpperCase(),
      date: new Date().toISOString(),
      rates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Convert currency endpoint
app.get('/api/convert', async (req, res) => {
  try {
    const { amount, from, to } = req.query;

    if (!amount || !from || !to) {
      return res.status(400).json({
        error: 'Missing parameters. Required: amount, from, to'
      });
    }

    // Check if we have recent rates for the base currency
    const cacheExpiry = 60 * 60 * 1000; // 1 hour
    const now = new Date().getTime();

    if (!ratesCache[from] || !lastCacheUpdate || (now - lastCacheUpdate > cacheExpiry)) {
      ratesCache[from] = await fetchExchangeRates(from);
      lastCacheUpdate = now;
    }

    // Calculate conversion
    const rate = ratesCache[from][to];
    const convertedAmount = parseFloat(amount) * rate;

    res.json({
      from,
      to,
      amount: parseFloat(amount),
      rate,
      convertedAmount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Currency information
const currencyInfo = {
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "British Pound", symbol: "£" },
  JPY: { name: "Japanese Yen", symbol: "¥" },
  // Add more currencies as needed
};

// Get available currencies with additional info
app.get('/api/currencies', async (req, res) => {
  try {
    const rates = await fetchExchangeRates('USD');
    
    // Create an array of currency objects with additional info
    const currencies = Object.keys(rates).sort().map(code => ({
      code,
      name: currencyInfo[code]?.name || code,
      symbol: currencyInfo[code]?.symbol || ''
    }));
    
    res.json({
      currencies,
      count: currencies.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Currency conversion API running on port ${PORT}`);
}); 