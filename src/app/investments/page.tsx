'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

export default function InvestmentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)

  // Sample portfolio data - in a real app, this would come from a backend
  const [portfolio, setPortfolio] = useState({
    totalValue: 24650.75,
    totalGain: 1250.32,
    totalGainPercentage: 5.35,
    assets: [
      {
        id: 1,
        name: 'S&P 500 ETF',
        ticker: 'SPY',
        allocation: 40,
        value: 9860.30,
        change: 3.2,
        color: 'bg-blue-500'
      },
      {
        id: 2,
        name: 'Technology ETF',
        ticker: 'QQQ',
        allocation: 25,
        value: 6162.69,
        change: 7.5,
        color: 'bg-purple-500'
      },
      {
        id: 3,
        name: 'Bond ETF',
        ticker: 'AGG',
        allocation: 20,
        value: 4930.15,
        change: -0.8,
        color: 'bg-green-500'
      },
      {
        id: 4,
        name: 'International ETF',
        ticker: 'VXUS',
        allocation: 15,
        value: 3697.61,
        change: 1.7,
        color: 'bg-yellow-500'
      }
    ]
  })

  // Sample recommendations
  const recommendations = [
    {
      id: 1,
      title: 'Consider increasing bond allocation',
      description: 'Market volatility suggests a more defensive position might be prudent.',
      type: 'risk'
    },
    {
      id: 2,
      title: 'Technology sector overweight',
      description: 'Your portfolio has higher than recommended exposure to technology stocks.',
      type: 'diversification'
    },
    {
      id: 3,
      title: 'Tax-loss harvesting opportunity',
      description: 'Consider selling underperforming assets to offset capital gains.',
      type: 'tax'
    }
  ]

  // Market trends data
  const marketTrends = [
    { id: 1, name: 'S&P 500', value: '4,782.82', change: '+0.56%', direction: 'up' },
    { id: 2, name: 'Nasdaq', value: '16,741.05', change: '+1.02%', direction: 'up' },
    { id: 3, name: 'Dow Jones', value: '38,503.69', change: '+0.30%', direction: 'up' },
    { id: 4, name: '10-Yr Treasury', value: '3.52%', change: '-0.05%', direction: 'down' },
    { id: 5, name: 'Bitcoin', value: '$51,233.45', change: '-2.31%', direction: 'down' },
  ]

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else {
        // Simulate data loading
        const timer = setTimeout(() => {
          setPageLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [user, loading, router])

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-300">Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold text-indigo-400 mb-6">Investment Portfolio</h1>
      
      {/* Portfolio Overview Card */}
      <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-indigo-400">Portfolio Value</h2>
            <p className="text-3xl font-bold text-gray-300">${portfolio.totalValue.toLocaleString()}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className={`flex items-center ${portfolio.totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span className="text-xl font-semibold">${Math.abs(portfolio.totalGain).toLocaleString()}</span>
              <span className="ml-1">
                {portfolio.totalGain >= 0 ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </span>
              <span className="ml-1 text-lg">({Math.abs(portfolio.totalGainPercentage).toFixed(2)}%)</span>
            </div>
            <p className="text-sm text-gray-400">Total Gain/Loss</p>
          </div>
        </div>
        
        {/* Asset Allocation Chart */}
        <h3 className="text-lg font-medium text-indigo-400 mb-4">Asset Allocation</h3>
        <div className="space-y-4">
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            {portfolio.assets.map((asset) => (
              <div 
                key={asset.id}
                className={`h-full ${asset.color} float-left`} 
                style={{ width: `${asset.allocation}%` }}
                title={`${asset.name}: ${asset.allocation}%`}
              >
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {portfolio.assets.map((asset) => (
              <div key={asset.id} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${asset.color} mr-2`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-300">{asset.name}</p>
                  <p className="text-xs text-gray-400">{asset.allocation}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Holdings Table */}
      <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-indigo-400 mb-4">Holdings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Asset</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Ticker</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Value</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Change</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.assets.map((asset) => (
                <tr key={asset.id} className="border-b border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-300">{asset.name}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-300">{asset.ticker}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-300">${asset.value.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-sm text-right ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change}%
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-300">{asset.allocation}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2 bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-4">AI Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border-l-4 border-indigo-500 bg-gray-700 pl-4 py-2">
                <h3 className="font-medium text-gray-300">{rec.title}</h3>
                <p className="text-sm text-gray-400">{rec.description}</p>
                <span className="inline-block mt-1 text-xs font-medium bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded">
                  {rec.type}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm font-medium text-indigo-400 hover:text-indigo-300">
            See more recommendations →
          </button>
        </div>
        
        {/* Market Trends */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-4">Market Trends</h2>
          <div className="space-y-3">
            {marketTrends.map((item) => (
              <div key={item.id} className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-sm font-medium text-gray-300">{item.name}</span>
                <div className="text-right">
                  <span className="block text-sm text-gray-300">{item.value}</span>
                  <span className={`text-xs flex items-center justify-end ${item.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {item.direction === 'up' ? (
                      <ChevronUpIcon className="h-3 w-3 inline" />
                    ) : (
                      <ChevronDownIcon className="h-3 w-3 inline" />
                    )}
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm font-medium text-indigo-400 hover:text-indigo-300">
            View detailed market analysis →
          </button>
        </div>
      </div>
    </div>
  )
} 