'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';

export default function InvestmentsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock investment data
  const investments = [
    { 
      id: 1, 
      name: 'S&P 500 ETF', 
      symbol: 'SPY', 
      value: 5250.75, 
      allocation: 45, 
      returns: 8.2,
      type: 'ETF'
    },
    { 
      id: 2, 
      name: 'Tech Growth Fund', 
      symbol: 'TECH', 
      value: 3120.50, 
      allocation: 25, 
      returns: 12.5,
      type: 'Mutual Fund'
    },
    { 
      id: 3, 
      name: 'Bond Market ETF', 
      symbol: 'BND', 
      value: 2400.25, 
      allocation: 20, 
      returns: 3.8,
      type: 'ETF'
    },
    { 
      id: 4, 
      name: 'Real Estate Trust', 
      symbol: 'REIT', 
      value: 1225.50, 
      allocation: 10, 
      returns: 5.7,
      type: 'REIT'
    }
  ];

  // Calculate total portfolio value
  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);

  // Function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-indigo-400">Investment Portfolio</h1>
        <p className="text-gray-300">Track and manage your investment portfolio</p>
      </div>

      {/* Portfolio Summary Card */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-gray-400 text-sm mb-1">Total Portfolio Value</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm mb-1">Average Return</h3>
            <p className="text-2xl font-bold text-white">
              {(investments.reduce((sum, inv) => sum + inv.returns, 0) / investments.length).toFixed(2)}%
            </p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm mb-1">Total Assets</h3>
            <p className="text-2xl font-bold text-white">{investments.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Investments Table */}
      {activeTab === 'overview' && (
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Allocation
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Return
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {investments.map((investment) => (
                  <tr key={investment.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{investment.name}</div>
                          <div className="text-sm text-gray-400">{investment.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{investment.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="text-white">{formatCurrency(investment.value)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="text-white">{investment.allocation}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className={`${investment.returns > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {investment.returns > 0 ? '+' : ''}{investment.returns}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions Tab Content */}
      {activeTab === 'transactions' && (
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg flex justify-center items-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No Transactions Yet</h3>
            <p className="text-gray-400 mb-4">Your recent investment transactions will appear here</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Record a Transaction
            </button>
          </div>
        </div>
      )}

      {/* Performance Tab Content */}
      {activeTab === 'performance' && (
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg flex justify-center items-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">Performance Analysis</h3>
            <p className="text-gray-400 mb-4">Advanced performance metrics will be available soon</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Enable Performance Tracking
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 