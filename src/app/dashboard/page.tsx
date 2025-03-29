'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ChatBubbleLeftRightIcon, ChartBarIcon, ArrowTrendingUpIcon, CreditCardIcon, BanknotesIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  // Sample data - in a real app, this would come from a backend
  const [financialOverview, setFinancialOverview] = useState({
    netWorth: 67250.43,
    netWorthChange: 3.2,
    cashBalance: 12450.25,
    investments: 24650.75,
    debt: -9850.57,
    monthlyIncome: 5750.00,
    monthlyExpenses: 3850.75,
    savingsRate: 33.2,
    creditScore: 745
  });

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, date: '2023-06-01', description: 'Salary Deposit', amount: 5750.00, category: 'Income', type: 'credit' },
    { id: 2, date: '2023-05-30', description: 'Grocery Store', amount: -125.43, category: 'Food', type: 'debit' },
    { id: 3, date: '2023-05-28', description: 'Electric Bill', amount: -87.65, category: 'Utilities', type: 'debit' },
    { id: 4, date: '2023-05-27', description: 'Restaurant', amount: -63.29, category: 'Dining', type: 'debit' },
    { id: 5, date: '2023-05-25', description: 'Investment Deposit', amount: -500.00, category: 'Investments', type: 'transfer' }
  ]);

  const [insights, setInsights] = useState([
    { 
      id: 1, 
      title: 'Your emergency fund is below target', 
      description: 'Consider adding $2,250 to reach your 3-month expense goal.',
      type: 'warning',
      actionText: 'See savings plan'
    },
    { 
      id: 2, 
      title: 'You could save $210 monthly by refinancing', 
      description: 'Current mortgage rates suggest refinancing could be beneficial.',
      type: 'opportunity',
      actionText: 'Explore options'
    },
    { 
      id: 3, 
      title: 'Dining expenses increased 15% last month', 
      description: 'You spent $325 more on restaurants than your monthly average.',
      type: 'alert',
      actionText: 'Review spending'
    }
  ]);

  const [upcomingBills, setUpcomingBills] = useState([
    { id: 1, date: '2023-06-05', description: 'Rent', amount: 1650.00 },
    { id: 2, date: '2023-06-08', description: 'Car Payment', amount: 375.25 },
    { id: 3, date: '2023-06-12', description: 'Internet', amount: 65.99 },
    { id: 4, date: '2023-06-15', description: 'Phone Bill', amount: 85.00 }
  ]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        // Simulate data loading
        const timer = setTimeout(() => {
          setPageLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [user, loading, router]);

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-indigo-400">Financial Dashboard</h1>
        <p className="text-gray-300 mt-1">
          Welcome back, {user?.displayName || 'there'}! Here's your financial overview.
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { 
              title: 'El Matador', 
              icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>, 
              color: 'bg-indigo-100 text-indigo-600',
              link: '/dashboard/elmatador'
            },
            { 
              title: 'Chat with El Matador', 
              icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />, 
              color: 'bg-purple-100 text-purple-600',
              link: '/assistant'
            },
            { 
              title: 'Investments', 
              icon: <ChartBarIcon className="h-6 w-6" />, 
              color: 'bg-blue-100 text-blue-600',
              link: '/investments'
            },
            { 
              title: 'Markets', 
              icon: <ArrowTrendingUpIcon className="h-6 w-6" />, 
              color: 'bg-green-100 text-green-600',
              link: '/markets'
            },
            { 
              title: 'Accounts', 
              icon: <BanknotesIcon className="h-6 w-6" />, 
              color: 'bg-yellow-100 text-yellow-600',
              link: '/accounts'
            },
            { 
              title: 'Credit', 
              icon: <CreditCardIcon className="h-6 w-6" />, 
              color: 'bg-red-100 text-red-600',
              link: '/credit'
            },
            { 
              title: 'Help', 
              icon: <QuestionMarkCircleIcon className="h-6 w-6" />, 
              color: 'bg-gray-100 text-gray-600',
              link: '/help'
            }
          ].map((action, index) => (
            <Link 
              href={action.link} 
              key={index}
              className="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className={`p-3 rounded-full ${action.color} mb-2`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-gray-800">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-indigo-400 mb-4">Financial Overview</h2>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Net Worth</span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-300">${financialOverview.netWorth.toLocaleString()}</span>
                    <div className={`flex items-center ml-2 ${financialOverview.netWorthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {financialOverview.netWorthChange >= 0 ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                      <span className="text-sm">{Math.abs(financialOverview.netWorthChange)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Cash</span>
                    <span className="font-semibold text-gray-300">${financialOverview.cashBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Investments</span>
                    <span className="font-semibold text-gray-300">${financialOverview.investments.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Debt</span>
                    <span className="font-semibold text-red-400">${Math.abs(financialOverview.debt).toLocaleString()}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Monthly Income</span>
                    <span className="font-semibold text-gray-300">${financialOverview.monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Monthly Expenses</span>
                    <span className="font-semibold text-gray-300">${financialOverview.monthlyExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Savings Rate</span>
                    <span className="font-semibold text-green-400">{financialOverview.savingsRate}%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-300 block">Credit Score</span>
                    <div className="flex items-center mt-1">
                      <span className="text-xl font-semibold text-gray-300">{financialOverview.creditScore}</span>
                      <span className="ml-2 text-xs px-2 py-1 bg-green-900 text-green-300 rounded">Good</span>
                    </div>
                  </div>
                  <Link 
                    href="/credit" 
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center"
                  >
                    View details
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Bills */}
        <div>
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden h-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-indigo-400">Upcoming Bills</h2>
                <Link 
                  href="/bills" 
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center"
                >
                  View all
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingBills.map((bill) => (
                  <div key={bill.id} className="flex justify-between items-center p-3 border border-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-300">{bill.description}</p>
                      <p className="text-xs text-gray-400">Due on {new Date(bill.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span className="font-semibold text-gray-300">${bill.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-md transition-colors">
                Pay Bills
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Insights and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* AI Insights */}
        <div>
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden h-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-indigo-400">AI Insights</h2>
                <Link 
                  href="/assistant" 
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center"
                >
                  Ask AI
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div 
                    key={insight.id} 
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.type === 'warning' 
                        ? 'border-yellow-500 bg-gray-700' 
                        : insight.type === 'opportunity' 
                          ? 'border-green-500 bg-gray-700'
                          : 'border-red-500 bg-gray-700'
                    }`}
                  >
                    <h3 className="font-medium text-gray-300">{insight.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{insight.description}</p>
                    <button className="mt-2 text-sm font-medium text-indigo-400 hover:text-indigo-300">
                      {insight.actionText}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-indigo-400">Recent Transactions</h2>
                <Link 
                  href="/transactions" 
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center"
                >
                  View all
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Description</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-700">
                        <td className="py-3 px-4 text-sm text-gray-300">
                          {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-300">{transaction.description}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
                            {transaction.category}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-sm text-right font-medium ${
                          transaction.type === 'credit' 
                            ? 'text-green-400' 
                            : transaction.type === 'debit' 
                              ? 'text-red-400'
                              : 'text-gray-300'
                        }`}>
                          {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="sm:flex justify-between items-center">
            <div className="mb-6 sm:mb-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Ready for personalized financial advice?</h2>
              <p className="text-blue-100">Let El Matador analyze your finances and provide customized recommendations.</p>
            </div>
            <Link
              href="/assistant"
              className="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow hover:bg-blue-50 transition-colors"
            >
              Chat with El Matador
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 