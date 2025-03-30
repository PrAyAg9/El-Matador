"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.financialService = void 0;
const axios_1 = __importDefault(require("axios"));
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
/**
 * Initialize the IDX API client with API key
 * Note: This is just a mock service for development on the free Firebase Spark plan
 * In production, you would replace this with actual API calls to financial data providers
 */
const idxClient = () => {
    var _a;
    const apiKey = process.env.IDX_API_KEY || ((_a = functions.config().idx) === null || _a === void 0 ? void 0 : _a.key);
    return axios_1.default.create({
        baseURL: 'https://api.idx.com', // Replace with actual IDX API URL in production
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
};
/**
 * Financial service to handle interactions with financial data providers
 * During development on the free Firebase Spark plan, we'll use mock data
 */
exports.financialService = {
    /**
     * Get market data
     */
    async getMarketData() {
        try {
            // In production, uncomment this to use the actual API call
            // const response = await idxClient().get('/market/data');
            // return response.data;
            // For development on free Spark plan, return mock data
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
                },
                {
                    symbol: 'DIA',
                    price: 376.21,
                    change: 1.23,
                    changePercent: 0.33,
                    volume: 21345678,
                    marketCap: 321456000000,
                    timestamp: new Date().toISOString()
                },
                {
                    symbol: 'IWM',
                    price: 201.34,
                    change: -0.87,
                    changePercent: -0.43,
                    volume: 18765432,
                    marketCap: 98765000000,
                    timestamp: new Date().toISOString()
                },
                {
                    symbol: 'GLD',
                    price: 187.65,
                    change: 1.45,
                    changePercent: 0.78,
                    volume: 12345678,
                    marketCap: 76543000000,
                    timestamp: new Date().toISOString()
                }
            ];
        }
        catch (error) {
            console.error('Error fetching market data:', error);
            throw error;
        }
    },
    /**
     * Get stock data for a specific symbol
     */
    async getStockData(symbol) {
        try {
            // In production, uncomment this to use the actual API call
            // const response = await idxClient().get(`/stocks/${symbol}`);
            // return response.data;
            // For development on free Spark plan, return mock data
            let mockData;
            switch (symbol.toUpperCase()) {
                case 'AAPL':
                    mockData = {
                        symbol: 'AAPL',
                        name: 'Apple Inc.',
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
                    break;
                case 'MSFT':
                    mockData = {
                        symbol: 'MSFT',
                        name: 'Microsoft Corporation',
                        price: 308.65,
                        change: 2.34,
                        changePercent: 0.76,
                        open: 306.31,
                        high: 309.12,
                        low: 305.87,
                        volume: 54321678,
                        marketCap: 2300000000000,
                        peRatio: 32.1,
                        dividend: 2.72,
                        yield: 0.88,
                        eps: 9.61,
                        timestamp: new Date().toISOString()
                    };
                    break;
                default:
                    mockData = {
                        symbol,
                        name: 'Unknown Company',
                        price: 100.00,
                        change: 0.00,
                        changePercent: 0.00,
                        open: 100.00,
                        high: 100.00,
                        low: 100.00,
                        volume: 0,
                        marketCap: 0,
                        peRatio: 0,
                        dividend: 0,
                        yield: 0,
                        eps: 0,
                        timestamp: new Date().toISOString()
                    };
            }
            return mockData;
        }
        catch (error) {
            console.error(`Error fetching stock data for ${symbol}:`, error);
            throw error;
        }
    },
    /**
     * Get user portfolio data
     */
    async getPortfolioData(userId) {
        try {
            // In production, uncomment this to use the actual API call
            // const response = await idxClient().get(`/users/${userId}/portfolio`);
            // return response.data;
            // For development on free Spark plan, first look for user data in Firestore
            const db = admin.firestore();
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                // If user has portfolio data in Firestore, return it
                if (userData === null || userData === void 0 ? void 0 : userData.portfolio) {
                    return userData.portfolio;
                }
            }
            // Otherwise, return mock data
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
                    },
                    {
                        symbol: 'SPY',
                        quantity: 10,
                        purchasePrice: 440.0,
                        currentPrice: 458.32,
                        value: 4583.2,
                        gain: 183.2,
                        gainPercent: 4.16
                    }
                ],
                totalValue: 7860.95,
                totalGain: 560.95,
                totalGainPercent: 7.69,
                cash: 5000.0
            };
        }
        catch (error) {
            console.error(`Error fetching portfolio data for user ${userId}:`, error);
            throw error;
        }
    },
    /**
     * Get financial news
     */
    async getFinancialNews() {
        try {
            // In production, uncomment this to use the actual API call
            // const response = await idxClient().get('/news');
            // return response.data;
            // For development on free Spark plan, return mock data
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
                },
                {
                    id: '3',
                    title: 'Housing Market Shows Signs of Cooling',
                    summary: 'After months of rising prices, the housing market is showing initial signs of slowing down as mortgage rates increase.',
                    source: 'CNBC',
                    url: 'https://cnbc.com/articles/housing-market-cooling',
                    publishedAt: new Date().toISOString(),
                    relevance: 0.78
                },
                {
                    id: '4',
                    title: 'Oil Prices Surge Amid Middle East Tensions',
                    summary: 'Crude oil prices jumped as geopolitical tensions in the Middle East raised concerns about supply disruptions.',
                    source: 'Bloomberg',
                    url: 'https://bloomberg.com/articles/oil-prices-surge',
                    publishedAt: new Date().toISOString(),
                    relevance: 0.81
                },
                {
                    id: '5',
                    title: 'Retail Sales Beat Expectations in Latest Report',
                    summary: 'Consumer spending remains resilient as retail sales figures came in higher than analysts had projected.',
                    source: 'Reuters',
                    url: 'https://reuters.com/articles/retail-sales-beat-expectations',
                    publishedAt: new Date().toISOString(),
                    relevance: 0.75
                }
            ];
        }
        catch (error) {
            console.error('Error fetching financial news:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=financial-service.js.map