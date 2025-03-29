'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { User } from 'firebase/auth';

// Extended User type with our custom properties
interface ExtendedUser extends User {
  financialProfile?: {
    riskTolerance?: 'low' | 'medium' | 'high';
    investmentGoals?: string[];
    [key: string]: any;
  };
}

// Model for investments
interface Investment {
  id: string;
  name: string;
  symbol: string;
  value: number;
  allocation: number;
  returns: number;
  type: 'stock' | 'bond' | 'etf' | 'crypto' | 'realestate';
  isTopPick?: boolean;
}

// Sample top investor data
interface TopInvestor {
  id: string;
  name: string;
  photoURL: string;
  returns: number;
  favoriteStock: string;
  investmentStrategy: string;
}

export default function InvestmentsPage() {
  const { user } = useAuth();
  const extendedUser = user as ExtendedUser;
  const [activeTab, setActiveTab] = useState('overview');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [topInvestors, setTopInvestors] = useState<TopInvestor[]>([]);
  const [recommendedInvestments, setRecommendedInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load mock investments data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInvestments([
        { id: '1', name: 'Apple Inc.', symbol: 'AAPL', value: 10450.75, allocation: 25.3, returns: 12.4, type: 'stock' },
        { id: '2', name: 'Microsoft Corporation', symbol: 'MSFT', value: 8320.50, allocation: 20.1, returns: 15.7, type: 'stock' },
        { id: '3', name: 'Vanguard Total Stock Market ETF', symbol: 'VTI', value: 6240.25, allocation: 15.1, returns: 9.8, type: 'etf' },
        { id: '4', name: 'Amazon.com, Inc.', symbol: 'AMZN', value: 4930.80, allocation: 11.9, returns: 8.5, type: 'stock' },
        { id: '5', name: 'U.S. Treasury Bond', symbol: 'GOVT', value: 4120.30, allocation: 10.0, returns: 3.2, type: 'bond' },
        { id: '6', name: 'Real Estate Investment Trust', symbol: 'VNQ', value: 3560.90, allocation: 8.6, returns: 5.1, type: 'realestate' },
        { id: '7', name: 'Bitcoin', symbol: 'BTC', value: 3720.50, allocation: 9.0, returns: 22.3, type: 'crypto' },
      ]);
      
      setTopInvestors([
        { 
          id: '1', 
          name: 'Javier Rodriguez', 
          photoURL: 'https://randomuser.me/api/portraits/men/32.jpg', 
          returns: 18.7, 
          favoriteStock: 'NVDA', 
          investmentStrategy: 'Growth-focused tech investments'
        },
        { 
          id: '2', 
          name: 'Sarah Johnson', 
          photoURL: 'https://randomuser.me/api/portraits/women/44.jpg', 
          returns: 15.2, 
          favoriteStock: 'TSLA', 
          investmentStrategy: 'Clean energy and sustainability'
        },
        { 
          id: '3', 
          name: 'Michael Chen', 
          photoURL: 'https://randomuser.me/api/portraits/men/22.jpg', 
          returns: 14.8, 
          favoriteStock: 'COST', 
          investmentStrategy: 'Value investing with dividend focus'
        },
      ]);
      
      setRecommendedInvestments([
        { id: '101', name: 'NVIDIA Corporation', symbol: 'NVDA', value: 0, allocation: 0, returns: 45.7, type: 'stock', isTopPick: true },
        { id: '102', name: 'Vanguard ESG U.S. Stock ETF', symbol: 'ESGV', value: 0, allocation: 0, returns: 12.3, type: 'etf', isTopPick: true },
        { id: '103', name: 'Tesla, Inc.', symbol: 'TSLA', value: 0, allocation: 0, returns: 32.1, type: 'stock', isTopPick: true },
        { id: '104', name: 'iShares Core U.S. Aggregate Bond ETF', symbol: 'AGG', value: 0, allocation: 0, returns: 4.2, type: 'bond', isTopPick: true },
        { id: '105', name: 'Ethereum', symbol: 'ETH', value: 0, allocation: 0, returns: 27.8, type: 'crypto', isTopPick: true }
      ]);
      
      setLoading(false);
    }, 1500);
  }, []);

  // Calculate total portfolio value
  const totalPortfolioValue = investments.reduce((total, investment) => total + investment.value, 0);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Handle investing in a recommended stock
  const handleInvest = (investment: Investment) => {
    alert(`This would open a purchase flow for ${investment.symbol}. For this demo, we're just showing the interface.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-300">Loading your investments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Your Investments</h1>
          <p className="text-gray-300">
            Portfolio Value: {formatCurrency(totalPortfolioValue)} • 
            <span className={`ml-2 ${investments.reduce((acc, inv) => acc + inv.returns, 0) / investments.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {(investments.reduce((acc, inv) => acc + inv.returns, 0) / investments.length).toFixed(2)}% overall return
            </span>
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Add Investment
        </button>
      </div>

      {/* Portfolio Summary Card */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4">Portfolio Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Total Value</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalPortfolioValue)}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Asset Allocation</h3>
            <div className="flex mt-2 h-4 rounded-full overflow-hidden">
              <div className="bg-indigo-500" style={{ width: `${investments.filter(inv => inv.type === 'stock').reduce((acc, inv) => acc + inv.allocation, 0)}%` }}></div>
              <div className="bg-blue-500" style={{ width: `${investments.filter(inv => inv.type === 'etf').reduce((acc, inv) => acc + inv.allocation, 0)}%` }}></div>
              <div className="bg-green-500" style={{ width: `${investments.filter(inv => inv.type === 'bond').reduce((acc, inv) => acc + inv.allocation, 0)}%` }}></div>
              <div className="bg-yellow-500" style={{ width: `${investments.filter(inv => inv.type === 'crypto').reduce((acc, inv) => acc + inv.allocation, 0)}%` }}></div>
              <div className="bg-red-500" style={{ width: `${investments.filter(inv => inv.type === 'realestate').reduce((acc, inv) => acc + inv.allocation, 0)}%` }}></div>
            </div>
            <div className="flex flex-wrap mt-2 text-xs">
              <span className="flex items-center mr-3"><span className="w-3 h-3 bg-indigo-500 rounded mr-1"></span> Stocks</span>
              <span className="flex items-center mr-3"><span className="w-3 h-3 bg-blue-500 rounded mr-1"></span> ETFs</span>
              <span className="flex items-center mr-3"><span className="w-3 h-3 bg-green-500 rounded mr-1"></span> Bonds</span>
              <span className="flex items-center mr-3"><span className="w-3 h-3 bg-yellow-500 rounded mr-1"></span> Crypto</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded mr-1"></span> Real Estate</span>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Performance</h3>
            <p className="text-2xl font-bold text-white">+12.5% YTD</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-8">
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'transactions'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'performance'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
        </nav>
      </div>

      {/* Tab Content - Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Current Investments */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Current Investments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Allocation</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Returns</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {investments.map((investment) => (
                    <tr key={investment.id} className="hover:bg-gray-750">
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-white">{investment.name}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-white">{investment.symbol}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-white">{formatCurrency(investment.value)}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-white">{investment.allocation.toFixed(1)}%</td>
                      <td className={`py-4 px-4 whitespace-nowrap text-sm ${investment.returns > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {investment.returns > 0 ? '+' : ''}{investment.returns}%
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${investment.type === 'stock' ? 'bg-indigo-900 text-indigo-200' : ''}
                          ${investment.type === 'etf' ? 'bg-blue-900 text-blue-200' : ''}
                          ${investment.type === 'bond' ? 'bg-green-900 text-green-200' : ''}
                          ${investment.type === 'crypto' ? 'bg-yellow-900 text-yellow-200' : ''}
                          ${investment.type === 'realestate' ? 'bg-red-900 text-red-200' : ''}
                        `}>
                          {investment.type.charAt(0).toUpperCase() + investment.type.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Top Investor Insights */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Top Investor Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topInvestors.map((investor) => (
                <div key={investor.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-indigo-500 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img src={investor.photoURL} alt={investor.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{investor.name}</h3>
                      <p className="text-green-400 text-sm">+{investor.returns}% returns</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">
                    <p className="mb-1"><span className="text-gray-400">Favorite Stock:</span> {investor.favoriteStock}</p>
                    <p><span className="text-gray-400">Strategy:</span> {investor.investmentStrategy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommended Investments */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Recommended For You</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Potential Returns</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recommendedInvestments.map((investment) => (
                    <tr key={investment.id} className="hover:bg-gray-750">
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-white">
                        {investment.name}
                        {investment.isTopPick && (
                          <span className="ml-2 bg-indigo-900 text-indigo-200 text-xs px-2 py-0.5 rounded-full">Top Pick</span>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-white">{investment.symbol}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-green-400">+{investment.returns}%</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${investment.type === 'stock' ? 'bg-indigo-900 text-indigo-200' : ''}
                          ${investment.type === 'etf' ? 'bg-blue-900 text-blue-200' : ''}
                          ${investment.type === 'bond' ? 'bg-green-900 text-green-200' : ''}
                          ${investment.type === 'crypto' ? 'bg-yellow-900 text-yellow-200' : ''}
                          ${investment.type === 'realestate' ? 'bg-red-900 text-red-200' : ''}
                        `}>
                          {investment.type.charAt(0).toUpperCase() + investment.type.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => handleInvest(investment)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                        >
                          Invest
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content - Transactions */}
      {activeTab === 'transactions' && (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="text-center py-8">
            <h3 className="text-xl font-medium text-white mb-2">Transaction History</h3>
            <p className="text-gray-400 mb-4">View your complete investment transaction history</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              View All Transactions
            </button>
          </div>
        </div>
      )}

      {/* Tab Content - Performance */}
      {activeTab === 'performance' && (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="text-center py-8">
            <h3 className="text-xl font-medium text-white mb-2">Performance Analytics</h3>
            <p className="text-gray-400 mb-4">Track your investment performance over time</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Generate Performance Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 