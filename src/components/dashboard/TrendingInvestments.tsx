'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon, 
  BuildingLibraryIcon,
  GlobeAmericasIcon
} from '@heroicons/react/24/outline';

type MarketType = 'crypto' | 'stocks' | 'realestate';

interface InvestmentTrend {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  market: MarketType;
  description: string;
}

interface TrendingInvestmentsProps {
  className?: string;
}

export default function TrendingInvestments({ className = '' }: TrendingInvestmentsProps) {
  const { user } = useAuth();
  const [activeMarket, setActiveMarket] = useState<MarketType>('stocks');
  const [trendingItems, setTrendingItems] = useState<InvestmentTrend[]>([]);
  
  // Simulated trending data
  const allTrendingData: Record<MarketType, InvestmentTrend[]> = {
    crypto: [
      {
        id: 'btc',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 38452.67,
        change: 1245.32,
        changePercent: 3.35,
        market: 'crypto',
        description: 'The original cryptocurrency, showing strength after recent market corrections.'
      },
      {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        price: 2098.45,
        change: 87.33,
        changePercent: 4.34,
        market: 'crypto',
        description: 'Second-largest crypto by market cap, benefiting from DeFi growth.'
      },
      {
        id: 'sol',
        name: 'Solana',
        symbol: 'SOL',
        price: 157.82,
        change: 12.54,
        changePercent: 8.64,
        market: 'crypto',
        description: 'High-performance blockchain with increasing developer adoption.'
      },
      {
        id: 'ada',
        name: 'Cardano',
        symbol: 'ADA',
        price: 0.58,
        change: -0.02,
        changePercent: -3.33,
        market: 'crypto',
        description: 'Peer-reviewed blockchain project facing headwinds despite strong community.'
      }
    ],
    stocks: [
      {
        id: 'aapl',
        name: 'Apple Inc.',
        symbol: 'AAPL',
        price: 189.84,
        change: 2.34,
        changePercent: 1.25,
        market: 'stocks',
        description: 'Tech giant showing resilience amid broader market volatility.'
      },
      {
        id: 'msft',
        name: 'Microsoft',
        symbol: 'MSFT',
        price: 415.45,
        change: 5.67,
        changePercent: 1.38,
        market: 'stocks',
        description: 'Cloud computing and AI initiatives driving continued growth.'
      },
      {
        id: 'nvda',
        name: 'NVIDIA',
        symbol: 'NVDA',
        price: 885.34,
        change: 25.45,
        changePercent: 2.96,
        market: 'stocks',
        description: 'AI chip leader benefiting from growing compute demand.'
      },
      {
        id: 'tsla',
        name: 'Tesla',
        symbol: 'TSLA',
        price: 175.28,
        change: -8.34,
        changePercent: -4.54,
        market: 'stocks',
        description: 'EV manufacturer facing increased competition and margin pressure.'
      }
    ],
    realestate: [
      {
        id: 'vgslx',
        name: 'Vanguard REIT ETF',
        symbol: 'VNQ',
        price: 84.56,
        change: 0.78,
        changePercent: 0.93,
        market: 'realestate',
        description: 'Broad real estate investment trust with focus on commercial properties.'
      },
      {
        id: 'schh',
        name: 'Schwab US REIT ETF',
        symbol: 'SCHH',
        price: 19.74,
        change: 0.15,
        changePercent: 0.77,
        market: 'realestate',
        description: 'Low-cost REIT ETF tracking the Dow Jones U.S. Select REIT Index.'
      },
      {
        id: 'o',
        name: 'Realty Income',
        symbol: 'O',
        price: 52.35,
        change: 0.45,
        changePercent: 0.87,
        market: 'realestate',
        description: 'Monthly dividend company focusing on retail properties.'
      },
      {
        id: 'dhi',
        name: 'D.R. Horton',
        symbol: 'DHI',
        price: 143.56,
        change: -2.34,
        changePercent: -1.60,
        market: 'realestate',
        description: 'Largest homebuilder by volume in the United States.'
      }
    ]
  };

  useEffect(() => {
    // Set trending items based on active market
    setTrendingItems(allTrendingData[activeMarket]);
    
    // In a real app, we would fetch actual trending data here
    // For example:
    // const fetchTrendingInvestments = async () => {
    //   const response = await fetch(`/api/trending/${activeMarket}`);
    //   const data = await response.json();
    //   setTrendingItems(data);
    // };
    // fetchTrendingInvestments();
    
  }, [activeMarket]);

  // Handle market tab selection
  const handleMarketChange = (market: MarketType) => {
    setActiveMarket(market);
  };

  // Get market icon based on market type
  const getMarketIcon = (market: MarketType) => {
    switch (market) {
      case 'crypto':
        return <CurrencyDollarIcon className="h-5 w-5" />;
      case 'stocks':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'realestate':
        return <BuildingLibraryIcon className="h-5 w-5" />;
      default:
        return <GlobeAmericasIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-indigo-400">Trending Investments</h2>
            <p className="text-gray-400 text-sm">Based on market activity and your profile</p>
          </div>
          <div className="h-8 w-8 bg-indigo-700 rounded-full flex items-center justify-center">
            <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-200" />
          </div>
        </div>
        
        {/* Market tabs */}
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => handleMarketChange('stocks')}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeMarket === 'stocks' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <ChartBarIcon className="h-4 w-4 mr-1" />
            Stocks
          </button>
          <button 
            onClick={() => handleMarketChange('crypto')}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeMarket === 'crypto' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
            Crypto
          </button>
          <button 
            onClick={() => handleMarketChange('realestate')}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeMarket === 'realestate' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <BuildingLibraryIcon className="h-4 w-4 mr-1" />
            Real Estate
          </button>
        </div>
        
        {/* Trending items */}
        <div className="space-y-4">
          {trendingItems.map((item) => (
            <div key={item.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="mr-3 h-8 w-8 bg-indigo-700 rounded-full flex items-center justify-center">
                    {getMarketIcon(item.market)}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{item.name}</h3>
                    <span className="text-gray-400 text-xs">{item.symbol}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className={`flex items-center text-xs ${item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.changePercent >= 0 ? (
                      <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">{item.description}</p>
              <div className="mt-3 flex justify-end">
                <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                  More Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-5 pt-4 border-t border-gray-700">
          <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center transition duration-200">
            View All Investment Opportunities
          </button>
        </div>
      </div>
    </div>
  );
} 