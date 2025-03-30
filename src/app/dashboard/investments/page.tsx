'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';
import { ChartBarIcon, CurrencyDollarIcon, ArrowUpIcon, StarIcon } from '@heroicons/react/24/outline';

export default function InvestmentsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeView, setActiveView] = useState('portfolio');

  // Mock investment data - personal portfolio
  const personalInvestments = [
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

  // Mock company investment data - El Matador investments
  const companyInvestments = [
    {
      id: 1,
      name: 'El Matador Growth Fund',
      description: 'Flagship fund focused on high-growth financial technology',
      value: 10000,
      initialInvestment: 7500,
      returns: 33.3,
      date: '2023-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'El Matador AI Ventures',
      description: 'Specialized fund investing in AI financial solutions',
      value: 5000,
      initialInvestment: 5000,
      returns: 0,
      date: '2023-06-22',
      status: 'pending'
    }
  ];

  // Calculate total portfolio value
  const totalPersonalValue = personalInvestments.reduce((sum, inv) => sum + inv.value, 0);
  
  // Calculate total company investment value
  const totalCompanyValue = companyInvestments.reduce((sum, inv) => sum + inv.value, 0);

  // Calculate overall investment value
  const totalValue = totalPersonalValue + totalCompanyValue;

  // Function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-indigo-400">Investment Portfolio</h1>
        <p className="text-gray-300">Track and manage your investment portfolio</p>
      </div>

      {/* Portfolio Summary Card */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-gray-400 text-sm mb-1">Total Investments</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm mb-1">Personal Portfolio</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalPersonalValue)}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm mb-1">El Matador Investments</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalCompanyValue)}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm mb-1">Total Assets</h3>
            <p className="text-2xl font-bold text-white">{personalInvestments.length + companyInvestments.length}</p>
          </div>
        </div>
      </div>

      {/* Investment View Toggle */}
      <div className="flex mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-l-md ${
            activeView === 'portfolio'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setActiveView('portfolio')}
        >
          Personal Portfolio
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-r-md ${
            activeView === 'company'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setActiveView('company')}
        >
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 mr-1" />
            El Matador Investments
          </div>
        </button>
      </div>

      {/* Personal Portfolio View */}
      {activeView === 'portfolio' && (
        <>
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
                    {personalInvestments.map((investment) => (
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
        </>
      )}

      {/* El Matador Investments View */}
      {activeView === 'company' && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-yellow-700">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 mr-3 flex items-center justify-center rounded-full bg-yellow-500">
                <span className="text-xl font-bold text-black">EM</span>
              </div>
              <h2 className="text-xl font-bold text-white">El Matador Investment Program</h2>
            </div>
            <p className="text-gray-300 mb-4">
              As an investor in El Matador Financial, you're part of our exclusive investment program. 
              Your investments directly fuel innovation in AI-powered financial technology and provide
              you with exclusive growth opportunities.
            </p>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 border border-yellow-600">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-yellow-400 font-medium">Next Investment Round</h3>
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium rounded">Coming Soon</div>
              </div>
              <p className="text-gray-400 text-sm">Early access to Series B funding will be available to existing investors</p>
            </div>
          </div>

          {/* Investments Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyInvestments.map((investment) => (
              <div key={investment.id} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white">{investment.name}</h3>
                  <div className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(investment.status)}`}>
                    {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-6">{investment.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-gray-400 text-xs mb-1">Current Value</h4>
                    <p className="text-white font-bold">{formatCurrency(investment.value)}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-xs mb-1">Initial Investment</h4>
                    <p className="text-white">{formatCurrency(investment.initialInvestment)}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-xs mb-1">Return</h4>
                    <p className={`font-bold ${investment.returns > 0 ? 'text-green-400' : investment.returns < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {investment.returns > 0 ? '+' : ''}{investment.returns}%
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-xs mb-1">Investment Date</h4>
                    <p className="text-white">{new Date(investment.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-sm">
                    View Details
                  </button>
                  {investment.status === 'active' && (
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-500 transition-colors text-sm flex items-center">
                      <StarIcon className="h-4 w-4 mr-1" />
                      Increase Investment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">El Matador Investor Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                  <h4 className="font-medium text-white">Priority Access</h4>
                </div>
                <p className="text-sm text-gray-300">First access to new AI features and investment opportunities</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                  <h4 className="font-medium text-white">Reduced Fees</h4>
                </div>
                <p className="text-sm text-gray-300">No commission on trades and reduced management fees</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <ChartBarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                  <h4 className="font-medium text-white">Wealth Insights</h4>
                </div>
                <p className="text-sm text-gray-300">Exclusive reports and AI-powered investment recommendations</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 