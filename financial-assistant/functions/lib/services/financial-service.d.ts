interface MarketData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    timestamp: string;
}
interface StockData {
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
interface PortfolioData {
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
/**
 * Financial service to handle interactions with financial data providers
 * During development on the free Firebase Spark plan, we'll use mock data
 */
export declare const financialService: {
    /**
     * Get market data
     */
    getMarketData(): Promise<MarketData[]>;
    /**
     * Get stock data for a specific symbol
     */
    getStockData(symbol: string): Promise<StockData>;
    /**
     * Get user portfolio data
     */
    getPortfolioData(userId: string): Promise<PortfolioData>;
    /**
     * Get financial news
     */
    getFinancialNews(): Promise<any[]>;
};
export {};
