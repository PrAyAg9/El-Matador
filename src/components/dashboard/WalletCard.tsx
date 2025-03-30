'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon, PlusIcon, WalletIcon, CreditCardIcon, BanknotesIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { firebaseFunctions } from '@/lib/firebase/functions';
import Link from 'next/link';

interface WalletCardProps {
  className?: string;
}

interface FinancialProfile {
  monthlyIncome?: string;
  monthlyExpenses?: Record<string, string>;
  incomeRange?: string;
  investmentGoals?: string[];
  riskTolerance?: 'low' | 'medium' | 'high';
}

export default function WalletCard({ className = '' }: WalletCardProps) {
  const { user } = useAuth();
  const [userFinancialData, setUserFinancialData] = useState<FinancialProfile | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate financial metrics
  const [balance, setBalance] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [savingsRate, setSavingsRate] = useState<number>(0);

  useEffect(() => {
    // Try to get data from userData first (from Firebase)
    let profile: FinancialProfile | undefined = user?.financialProfile;
    
    // If no data from Firebase, try localStorage fallback
    if (!profile && typeof window !== 'undefined') {
      try {
        const localData = localStorage.getItem('userFinancialProfile');
        if (localData) {
          profile = JSON.parse(localData) as FinancialProfile;
          console.log('Using localStorage financial profile data');
        }
      } catch (e) {
        console.error('Error parsing localStorage financial profile:', e);
      }
    }
    
    if (profile) {
      setUserFinancialData(profile);
      
      // Set financial values from profile with proper type handling
      setMonthlyIncome(Number(profile.monthlyIncome) || 0);
      
      // Sum up all monthly expenses
      let totalExpenses = 0;
      if (profile.monthlyExpenses) {
        Object.values(profile.monthlyExpenses).forEach((amount: string) => {
          totalExpenses += Number(amount) || 0;
        });
      }
      
      setMonthlyExpenses(totalExpenses);
      
      // Calculate balance (income - expenses)
      const calculatedBalance = (Number(profile.monthlyIncome) || 0) - totalExpenses;
      setBalance(calculatedBalance);
      
      // Calculate savings rate (balance / income * 100)
      const income = Number(profile.monthlyIncome) || 0;
      if (income > 0) {
        setSavingsRate((calculatedBalance / income) * 100);
      }
    }
  }, [user]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Determine CSS classes based on values
  const getBalanceColor = () => {
    return balance > 0 ? 'text-green-400' : 'text-red-400';
  };
  
  const getSavingsRateColor = () => {
    if (savingsRate >= 20) return 'text-green-400';
    if (savingsRate > 0) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getSavingsRateIcon = () => {
    if (savingsRate >= 20) return <ArrowUpIcon className="h-4 w-4 text-green-400" />;
    if (savingsRate > 0) return <ArrowRightIcon className="h-4 w-4 text-yellow-400" />;
    return <ArrowDownIcon className="h-4 w-4 text-red-400" />;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // If no financial data yet, show placeholder message
  if (!userFinancialData) {
    return (
      <div className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-6">
          <h2 className="text-lg font-medium text-indigo-400 mb-4">Your Wallet</h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-gray-400 mb-4">
              Complete your financial profile to see your wallet summary.
            </p>
            <a 
              href="/dashboard/elmatador"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              Set Up Profile
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Wallet card in expanded state
  if (isExpanded) {
    return (
      <div className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className} transition-all duration-300 transform`} style={{ height: 'auto', minHeight: '480px' }}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-indigo-400">Your Wallet</h2>
            <button 
              onClick={toggleExpand}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              aria-label="Collapse wallet"
            >
              <PlusIcon className="h-5 w-5 text-gray-300 transform rotate-45" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-1">Monthly Balance</p>
            <p className={`text-3xl font-semibold ${getBalanceColor()}`}>
              {formatCurrency(balance)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {balance > 0 ? 'Positive balance ✓' : 'Negative balance ✗'}
            </p>
          </div>
          
          {/* Expanded wallet options */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-indigo-300 mb-3">AI Wallet Management</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Link href="/assistant" className="flex flex-col p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center mb-2">
                  <ChartBarIcon className="h-5 w-5 text-indigo-400 mr-2" />
                  <span className="text-sm font-medium text-white">Budget Analysis</span>
                </div>
                <p className="text-xs text-gray-400">Get AI insights on your spending habits</p>
              </Link>
              
              <Link href="/assistant" className="flex flex-col p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center mb-2">
                  <WalletIcon className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-sm font-medium text-white">Saving Goals</span>
                </div>
                <p className="text-xs text-gray-400">Create and track savings targets</p>
              </Link>
              
              <Link href="/assistant" className="flex flex-col p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center mb-2">
                  <CreditCardIcon className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-sm font-medium text-white">Expense Manager</span>
                </div>
                <p className="text-xs text-gray-400">Optimize your spending</p>
              </Link>
              
              <Link href="/assistant" className="flex flex-col p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center mb-2">
                  <BanknotesIcon className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-white">Income Tracker</span>
                </div>
                <p className="text-xs text-gray-400">Monitor your earnings</p>
              </Link>
            </div>
            
            <div className="bg-indigo-900 bg-opacity-30 rounded-lg p-4 mt-4 border border-indigo-800">
              <div className="flex items-start">
                <CurrencyDollarIcon className="h-6 w-6 text-indigo-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-indigo-300 mb-1">El Matador Financial Insight</h4>
                  <p className="text-xs text-gray-300 mb-2">
                    {savingsRate > 20
                      ? "Great job! Your savings rate is excellent. Consider investing some of this surplus."
                      : savingsRate > 10
                      ? "Good work on saving. Try to increase your rate to 20% for optimal financial health."
                      : savingsRate > 0
                      ? "Your savings rate is positive but low. Look for ways to reduce expenses."
                      : "You're spending more than you earn. Let's work on a budget plan."}
                  </p>
                  <Link 
                    href="/assistant" 
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
                  >
                    Ask El Matador for advice
                    <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular wallet card (collapsed state)
  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-indigo-400">Your Wallet</h2>
          <button 
            onClick={toggleExpand}
            className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            aria-label="Expand wallet"
          >
            <PlusIcon className="h-5 w-5 text-gray-300" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Balance */}
          <div>
            <p className="text-sm text-gray-400 mb-1">Monthly Balance</p>
            <p className={`text-2xl font-semibold ${getBalanceColor()}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Income</p>
              <p className="text-lg font-medium text-gray-200">{formatCurrency(monthlyIncome)}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 mb-1">Expenses</p>
              <p className="text-lg font-medium text-gray-200">{formatCurrency(monthlyExpenses)}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 mb-1">Savings Rate</p>
              <div className="flex items-center">
                <p className={`text-lg font-medium ${getSavingsRateColor()}`}>
                  {savingsRate.toFixed(0)}%
                </p>
                <span className="ml-1">{getSavingsRateIcon()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 