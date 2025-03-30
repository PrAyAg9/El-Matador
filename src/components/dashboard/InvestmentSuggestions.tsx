'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowTrendingUpIcon, LightBulbIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface InvestmentType {
  id: string;
  name: string;
  description: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  returnRange: string;
  icon: string;
}

interface InvestmentSuggestionsProps {
  className?: string;
}

// Investment options by risk tolerance
const INVESTMENT_OPTIONS: Record<string, InvestmentType[]> = {
  conservative: [
    {
      id: 'treasury',
      name: 'Treasury Bonds',
      description: 'Government-backed securities with guaranteed returns',
      riskLevel: 'Low',
      returnRange: '3-5%',
      icon: '🏛️'
    },
    {
      id: 'muni',
      name: 'Municipal Bonds',
      description: 'Tax-advantaged bonds issued by local governments',
      riskLevel: 'Low',
      returnRange: '2-4%',
      icon: '🏙️'
    },
    {
      id: 'cd',
      name: 'Certificates of Deposit',
      description: 'Bank-backed time deposits with fixed interest rates',
      riskLevel: 'Low',
      returnRange: '1-4%',
      icon: '🏦'
    }
  ],
  moderate: [
    {
      id: 'index',
      name: 'Index Funds',
      description: 'Diversified funds that track market indices',
      riskLevel: 'Moderate',
      returnRange: '7-10%',
      icon: '📊'
    },
    {
      id: 'dividend',
      name: 'Dividend Stocks',
      description: 'Companies that regularly pay dividends to shareholders',
      riskLevel: 'Moderate',
      returnRange: '4-6%',
      icon: '💰'
    },
    {
      id: 'reit',
      name: 'Real Estate Investment Trusts',
      description: 'Companies that own and manage income-producing real estate',
      riskLevel: 'Moderate',
      returnRange: '5-8%',
      icon: '🏢'
    }
  ],
  aggressive: [
    {
      id: 'growth',
      name: 'Growth Stocks',
      description: 'Shares in companies expected to grow faster than the market',
      riskLevel: 'High',
      returnRange: '10-15%+',
      icon: '📈'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      description: 'Digital or virtual currencies using cryptography',
      riskLevel: 'High',
      returnRange: 'Variable',
      icon: '₿'
    },
    {
      id: 'startup',
      name: 'Startup Investments',
      description: 'Early-stage companies with high growth potential',
      riskLevel: 'High',
      returnRange: 'Variable',
      icon: '🚀'
    }
  ],
  'very-aggressive': [
    {
      id: 'options',
      name: 'Options Trading',
      description: 'Contracts giving the right to buy/sell assets at set prices',
      riskLevel: 'High',
      returnRange: 'Variable',
      icon: '⚖️'
    },
    {
      id: 'futures',
      name: 'Futures Contracts',
      description: 'Agreements to buy/sell assets at predetermined prices',
      riskLevel: 'High',
      returnRange: 'Variable',
      icon: '⏳'
    },
    {
      id: 'forex',
      name: 'Forex Trading',
      description: 'Trading currency pairs on the foreign exchange market',
      riskLevel: 'High',
      returnRange: 'Variable',
      icon: '💱'
    }
  ]
};

export default function InvestmentSuggestions({ className = '' }: InvestmentSuggestionsProps) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<InvestmentType[]>([]);
  const [riskProfile, setRiskProfile] = useState<string>('moderate');

  useEffect(() => {
    let recommendedInvestments: InvestmentType[] = [];
    const riskToleranceMap: Record<string, string> = {
      'low': 'conservative',
      'medium': 'moderate',
      'high': 'aggressive'
    };
    
    if (user?.financialProfile?.riskTolerance) {
      // Convert user's risk tolerance to investment option keys
      const userRiskTolerance = user.financialProfile.riskTolerance; // 'low', 'medium', or 'high'
      setRiskProfile(userRiskTolerance);
      const mappedRiskTolerance = riskToleranceMap[userRiskTolerance]; // convert to 'conservative', 'moderate', or 'aggressive'
      
      // Primary recommendations based on risk tolerance
      if (mappedRiskTolerance && INVESTMENT_OPTIONS[mappedRiskTolerance]) {
        recommendedInvestments = [...INVESTMENT_OPTIONS[mappedRiskTolerance]];
      } else {
        // Default to moderate if not found
        recommendedInvestments = [...INVESTMENT_OPTIONS.moderate];
      }
      
      // Add one suggestion from neighboring risk categories for diversity
      if (mappedRiskTolerance === 'conservative' && INVESTMENT_OPTIONS.moderate) {
        // Add one moderate option for conservative investors
        recommendedInvestments.push(INVESTMENT_OPTIONS.moderate[0]);
      } else if (mappedRiskTolerance === 'aggressive' && INVESTMENT_OPTIONS.moderate) {
        // Add one moderate option for aggressive investors
        recommendedInvestments.push(INVESTMENT_OPTIONS.moderate[2]);
      } else if (mappedRiskTolerance === 'moderate') {
        // Add one conservative option for moderate investors
        if (INVESTMENT_OPTIONS.conservative) {
          recommendedInvestments.push(INVESTMENT_OPTIONS.conservative[0]);
        }
      }
      
      // Limit to 4 suggestions
      setSuggestions(recommendedInvestments.slice(0, 4));
    } else {
      // Default suggestions if risk tolerance not set
      setSuggestions(INVESTMENT_OPTIONS.moderate);
    }
  }, [user]);

  // Get color for risk level
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Moderate':
        return 'bg-blue-100 text-blue-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-indigo-400">Investment Suggestions</h2>
            <p className="text-gray-400 text-sm">Based on your {riskProfile} risk profile</p>
          </div>
          <div className="h-8 w-8 bg-indigo-700 rounded-full flex items-center justify-center">
            <LightBulbIcon className="h-5 w-5 text-yellow-300" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((investment) => (
            <div key={investment.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors">
              <div className="flex items-start">
                <div className="bg-gray-600 h-10 w-10 rounded-lg flex items-center justify-center text-xl mr-3">
                  {investment.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-medium">{investment.name}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getRiskColor(investment.riskLevel)}`}>
                      {investment.riskLevel}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{investment.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-300 text-sm">Return: {investment.returnRange}</span>
                    <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center">
                      Learn more
                      <ArrowRightIcon className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-5 pt-4 border-t border-gray-700">
          <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center transition duration-200">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
            Explore More Investment Options
          </button>
        </div>
      </div>
    </div>
  );
} 