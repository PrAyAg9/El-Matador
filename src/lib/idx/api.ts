import axios from 'axios';

// IDX API configuration
const IDX_API_KEY = process.env.NEXT_PUBLIC_IDX_API_KEY || '';
const IDX_BASE_URL = 'https://api.idx.com'; // Replace with the actual IDX API URL

// Create an axios instance for IDX API
const idxClient = axios.create({
  baseURL: IDX_BASE_URL,
  headers: {
    'Authorization': `Bearer ${IDX_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Error handling for IDX API responses
idxClient.interceptors.response.use(
  response => response,
  error => {
    console.error('IDX API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Interface for market data
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  timestamp: string;
}

// Interface for stock data
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividend: number;
  yield: number;
  eps: number;
  timestamp: string;
}

// Interface for portfolio data
export interface PortfolioData {
  userId: string;
  assets: Array<{
    symbol: string;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
    value: number;
    gain: number;
    gainPercent: number;
  }>;
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  cash: number;
}

// Get market data
export const getMarketData = async (): Promise<MarketData[]> => {
  try {
    const response = await idxClient.get('/market/data');
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Return mock data for now (to be replaced with actual API integration)
    return [
      {
        symbol: 'SPY',
        price: 458.32,
        change: 2.15,
        changePercent: 0.47,
        volume: 67234521,
        marketCap: 415983000000,
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'QQQ',
        price: 387.45,
        change: 3.67,
        changePercent: 0.96,
        volume: 42531987,
        marketCap: 198754000000,
        timestamp: new Date().toISOString()
      }
    ];
  }
};

// Get stock data for a specific symbol
export const getStockData = async (symbol: string): Promise<StockData> => {
  try {
    const response = await idxClient.get(`/stocks/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    // Return mock data for now (to be replaced with actual API integration)
    return {
      symbol,
      name: symbol === 'AAPL' ? 'Apple Inc.' : 'Unknown Company',
      price: 173.45,
      change: 1.23,
      changePercent: 0.72,
      open: 172.22,
      high: 174.15,
      low: 171.98,
      volume: 67865432,
      marketCap: 2750000000000,
      peRatio: 28.5,
      dividend: 0.92,
      yield: 0.53,
      eps: 6.09,
      timestamp: new Date().toISOString()
    };
  }
};

// Get user portfolio data
export const getPortfolioData = async (userId: string): Promise<PortfolioData> => {
  try {
    const response = await idxClient.get(`/users/${userId}/portfolio`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching portfolio data for user ${userId}:`, error);
    // Return mock data for now (to be replaced with actual API integration)
    return {
      userId,
      assets: [
        {
          symbol: 'AAPL',
          quantity: 10,
          purchasePrice: 150.0,
          currentPrice: 173.45,
          value: 1734.5,
          gain: 234.5,
          gainPercent: 15.63
        },
        {
          symbol: 'MSFT',
          quantity: 5,
          purchasePrice: 280.0,
          currentPrice: 308.65,
          value: 1543.25,
          gain: 143.25,
          gainPercent: 10.23
        }
      ],
      totalValue: 3277.75,
      totalGain: 377.75,
      totalGainPercent: 13.02,
      cash: 5000.0
    };
  }
};

// Get financial news
export const getFinancialNews = async (): Promise<any[]> => {
  try {
    const response = await idxClient.get('/news');
    return response.data;
  } catch (error) {
    console.error('Error fetching financial news:', error);
    // Return mock data for now (to be replaced with actual API integration)
    return [
      {
        id: '1',
        title: 'Fed Signals Interest Rate Cut Later This Year',
        summary: 'Federal Reserve hints at potential interest rate cuts in the coming months as inflation shows signs of cooling.',
        source: 'Financial Times',
        url: 'https://ft.com/articles/fed-signals-rate-cut',
        publishedAt: new Date().toISOString(),
        relevance: 0.92
      },
      {
        id: '2',
        title: 'Tech Stocks Rally Amid AI Optimism',
        summary: 'Technology shares continue their upward trend as investors remain optimistic about AI advancements.',
        source: 'Wall Street Journal',
        url: 'https://wsj.com/articles/tech-stocks-rally',
        publishedAt: new Date().toISOString(),
        relevance: 0.85
      }
    ];
  }
}; 