'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { User } from 'firebase/auth';
import { 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import WalletCard from '@/components/dashboard/WalletCard';
import GoalsCard from '@/components/dashboard/GoalsCard';
import TrendingInvestments from '@/components/dashboard/TrendingInvestments';
import ExpensesBreakdown from '@/components/dashboard/ExpensesBreakdown';
import FinancialHealthScore from '@/components/dashboard/FinancialHealthScore';
import ElMatadorModal from '@/components/dashboard/ElMatadorModal';

// Define the interface for the expanded financial profile
interface ElMatadorProfile {
  age?: string;
  salary?: string; 
  monthlyIncome?: string;
  cashFlow?: string;
  goals?: string[];
  monthlyExpenses?: {
    housing: string;
    food: string;
    transportation: string;
    entertainment: string;
    other: string;
  };
  riskTolerance?: string;
  hasSavings?: string;
  savingsAmount?: string;
  monthlyDebt?: string;
  name?: string;
  lastUpdated?: string;
  incomeRange?: string;
  investmentGoals?: string[];
}

// Define interface for action items
interface ActionItem {
  title: string;
  description: string;
  actionText: string;
  link?: string;
  action?: () => void;
}

// Extend the Firebase User type to include our custom properties
interface ExtendedUser extends User {
  financialProfile?: ElMatadorProfile;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const extendedUser = user as ExtendedUser | null;
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [greeting, setGreeting] = useState('Good day');
  const [currentDate, setCurrentDate] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [financialProfile, setFinancialProfile] = useState<ElMatadorProfile | null>(null);
  
  // Load financial profile from localStorage if available
  useEffect(() => {
    if (extendedUser?.uid && typeof window !== 'undefined') {
      try {
        // Try to get profile from localStorage first (most up-to-date)
        const storedProfile = localStorage.getItem('userFinancialProfile');
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setFinancialProfile(parsedProfile);
          setIsProfileComplete(true);
        } else if (extendedUser.financialProfile) {
          // Use profile from user object if available
          setFinancialProfile(extendedUser.financialProfile as ElMatadorProfile);
          setIsProfileComplete(true);
        }
      } catch (e) {
        console.error('Error loading financial profile:', e);
      }
    }
  }, [extendedUser]);

  // Set greeting based on time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good morning');
    } else if (hours < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    // Format current date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options as any));
  }, []);

  // Random motivational quotes about finance
  const getRandomMotivationalQuote = () => {
    const quotes = [
      "The best investment you can make is in yourself",
      "Financial freedom is a mental, emotional and educational process",
      "A budget is telling your money where to go, not wondering where it went",
      "Don't save what is left after spending; spend what is left after saving",
      "Every time you borrow money, you're robbing your future self"
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  // Generate action items based on user's financial profile
  const getActionItems = (): ActionItem[] => {
    // Get the financial profile
    const elMatadorProfile = financialProfile;
    
    // Generate dynamic action items based on user data
    if (!elMatadorProfile) {
      return [{
        title: 'Complete Your Financial Profile',
        description: 'Set up your financial profile to get personalized recommendations and insights.',
        actionText: 'Set Up Profile',
        action: () => setShowProfileModal(true)
      }];
    }
    
    const actionItems: ActionItem[] = [];
    
    // Check emergency fund status - handle both property formats
    if (elMatadorProfile.hasSavings === 'no' || (elMatadorProfile.investmentGoals && !elMatadorProfile.investmentGoals.includes('emergency'))) {
      actionItems.push({
        title: 'Start an Emergency Fund',
        description: 'You don\'t have an emergency fund yet. We recommend saving 3-6 months of expenses.',
        actionText: 'Learn How',
        link: '/assistant?query=emergency+fund'
      });
    } else if (
      (elMatadorProfile.savingsAmount && elMatadorProfile.monthlyIncome && 
      parseInt(elMatadorProfile.savingsAmount) < parseInt(elMatadorProfile.monthlyIncome) * 3)
    ) {
      actionItems.push({
        title: 'Build Your Emergency Fund',
        description: 'Your emergency fund is below the recommended 3-month minimum. Consider allocating more to reach your goal.',
        actionText: 'Adjust Savings Plan',
        link: '/savings'
      });
    }
    
    // Check debt status
    if (elMatadorProfile.monthlyDebt && parseInt(elMatadorProfile.monthlyDebt) > 0) {
      const income = elMatadorProfile.monthlyIncome ? parseInt(elMatadorProfile.monthlyIncome) : 1;
      const debt = parseInt(elMatadorProfile.monthlyDebt) || 0;
      const debtRatio = debt / income;
      
      if (debtRatio > 0.3) {
        actionItems.push({
          title: 'Reduce Debt Burden',
          description: 'Your debt-to-income ratio is higher than recommended. Consider a debt reduction strategy.',
          actionText: 'Debt Strategies',
          link: '/assistant?query=debt+reduction'
        });
      }
    }
    
    // Check investment diversity
    const investmentGoals = elMatadorProfile.goals || elMatadorProfile.investmentGoals || [];
    if (investmentGoals.length < 2) {
      actionItems.push({
        title: 'Diversify Your Investments',
        description: 'Expand your investment portfolio to reduce risk and increase potential returns.',
        actionText: 'View Options',
        link: '/investments'
      });
    }
    
    // Default action if none of the above apply
    if (actionItems.length === 0) {
      actionItems.push({
        title: 'Optimize Tax Strategy',
        description: 'You may be able to reduce your tax liability with a few simple adjustments to your investment strategy.',
        actionText: 'View Tax Insights',
        link: '/tax-planning'
      });
    }
    
    // Limit to 3 action items
    return actionItems.slice(0, 3);
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        // Check if financial profile exists - handle both formats
        const storedProfile = typeof window !== 'undefined' ? localStorage.getItem('userFinancialProfile') : null;
        setIsProfileComplete(!!extendedUser?.financialProfile || !!storedProfile);
        
        // Simulate data loading
        const timer = setTimeout(() => {
          setPageLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [user, extendedUser, loading, router]);

  // Force localStorage to be marked as false when opening the profile modal
  const openProfileModal = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenElMatadorModal', 'false');
    }
    setShowProfileModal(true);
  };

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-300">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  // If user hasn't completed financial profile, show onboarding component
  if (!isProfileComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Welcome to Your Financial Dashboard</h1>
          <p className="text-gray-300 mb-8">
            To get started, let's set up your financial profile so we can provide personalized insights and recommendations.
          </p>
          <button 
            onClick={openProfileModal}
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Set Up Your Profile
          </button>
          {showProfileModal && <ElMatadorModal />}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {/* Display the modal for completing financial profile if needed */}
        {showProfileModal && <ElMatadorModal />}
        
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {greeting}, {extendedUser?.displayName || financialProfile?.name || 'Investor'}
              </h1>
              <p className="text-gray-400 mt-1">
                {currentDate} · {getRandomMotivationalQuote()}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={openProfileModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white flex items-center"
              >
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                <span>Edit Profile</span>
              </button>
              
              <Link
                href="/assistant"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white flex items-center"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                <span>Ask AI</span>
              </Link>
            </div>
          </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { 
              title: 'El Matador', 
              icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>, 
              color: 'bg-indigo-100 text-indigo-600',
              action: () => openProfileModal()
            },
            { 
              title: 'Chat with AI', 
              icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />, 
              color: 'bg-purple-100 text-purple-600',
              link: '/assistant'
            },
            { 
              title: 'Investments', 
              icon: <ChartBarIcon className="h-6 w-6" />, 
              color: 'bg-blue-100 text-blue-600',
              link: '/dashboard/investments'
            },
            { 
              title: 'Markets', 
              icon: <ArrowTrendingUpIcon className="h-6 w-6" />, 
              color: 'bg-green-100 text-green-600',
              link: '/assistant?topic=markets'
            },
            { 
              title: 'Accounts', 
              icon: <BanknotesIcon className="h-6 w-6" />, 
              color: 'bg-yellow-100 text-yellow-600',
              link: '/assistant?topic=accounts'
            },
            { 
              title: 'Credit', 
              icon: <CreditCardIcon className="h-6 w-6" />, 
              color: 'bg-red-100 text-red-600',
              link: '/assistant?topic=credit'
            },
            { 
              title: 'Help', 
              icon: <QuestionMarkCircleIcon className="h-6 w-6" />, 
              color: 'bg-gray-100 text-gray-600',
              link: '/assistant?topic=help'
            }
          ].map((action, index) => {
            // Use either Link or button based on whether it has a link or action
            if ('link' in action && action.link) {
              return (
                <Link 
                  key={index}
                  href={action.link}
                  className="flex flex-col items-center p-4 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 hover:shadow-md transition-all"
                >
                  <div className={`p-3 rounded-full ${action.color} mb-2`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-300">{action.title}</span>
                </Link>
              );
            } else {
              return (
                <button 
                  key={index}
                  onClick={'action' in action ? action.action : undefined}
                  className="flex flex-col items-center p-4 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 hover:shadow-md transition-all"
                >
                  <div className={`p-3 rounded-full ${action.color} mb-2`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-300">{action.title}</span>
                </button>
              );
            }
          })}
        </div>
      </div>
      
        {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* First column - wallet and expenses */}
          <div className="space-y-6 lg:col-span-1">
            <WalletCard />
            <ExpensesBreakdown />
        </div>
        
          {/* Second column - goals and health score */}
          <div className="space-y-6 lg:col-span-1">
            <GoalsCard />
            <FinancialHealthScore />
      </div>
      
          {/* Third column - trending investments */}
          <div className="lg:col-span-1">
            <TrendingInvestments className="h-full" />
          </div>
        </div>
        
        {/* Financial Action Items */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-400 mb-4">Recommended Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getActionItems().map((item, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-5 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                <h3 className="font-medium text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                {'link' in item && item.link ? (
                  <Link href={item.link} className="text-indigo-400 font-medium text-sm hover:text-indigo-300 transition-colors inline-block">
                    {item.actionText} <ChevronRightIcon className="h-4 w-4 inline ml-1" />
                  </Link>
                ) : 'action' in item && item.action ? (
                  <button 
                    onClick={item.action} 
                    className="text-indigo-400 font-medium text-sm hover:text-indigo-300 transition-colors inline-block"
                  >
                    {item.actionText} <ChevronRightIcon className="h-4 w-4 inline ml-1" />
                  </button>
                ) : (
                  <span className="text-indigo-400 font-medium text-sm inline-block">
                    {item.actionText} <ChevronRightIcon className="h-4 w-4 inline ml-1" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 