'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChartPieIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface CategoryColor {
  bg: string;
  text: string;
  border: string;
}

interface ExpenseCategory {
  name: string;
  key: string;
  amount: number;
  percentage: number;
  color: CategoryColor;
}

interface ExpensesBreakdownProps {
  className?: string;
}

// Category colors
const CATEGORY_COLORS: Record<string, CategoryColor> = {
  housing: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    border: 'border-blue-500'
  },
  food: {
    bg: 'bg-green-500',
    text: 'text-green-500',
    border: 'border-green-500'
  },
  transportation: {
    bg: 'bg-purple-500',
    text: 'text-purple-500',
    border: 'border-purple-500'
  },
  entertainment: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-500',
    border: 'border-yellow-500'
  },
  other: {
    bg: 'bg-gray-500',
    text: 'text-gray-500',
    border: 'border-gray-500'
  }
};

// Category display names
const CATEGORY_NAMES: Record<string, string> = {
  housing: 'Housing & Utilities',
  food: 'Food & Groceries',
  transportation: 'Transportation',
  entertainment: 'Entertainment',
  other: 'Other Expenses'
};

export default function ExpensesBreakdown({ className = '' }: ExpensesBreakdownProps) {
  const { userData } = useAuth();
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [largestCategory, setLargestCategory] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Make sure we're on the client before rendering SVG
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (userData?.financialProfile?.monthlyExpenses) {
      const expenses = userData.financialProfile.monthlyExpenses as Record<string, string>;
      let total = 0;
      const tempCategories: ExpenseCategory[] = [];
      let maxAmount = 0;
      let maxCategory = '';
      
      // Calculate total expenses
      Object.entries(expenses).forEach(([key, value]) => {
        const amount = parseFloat(value) || 0;
        total += amount;
        
        if (amount > maxAmount) {
          maxAmount = amount;
          maxCategory = key;
        }
      });
      
      setTotalExpenses(total);
      setLargestCategory(maxCategory);
      
      // Calculate percentages and build category objects
      Object.entries(expenses).forEach(([key, value]) => {
        const amount = parseFloat(value) || 0;
        if (amount > 0) {
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          
          tempCategories.push({
            key,
            name: CATEGORY_NAMES[key] || key,
            amount,
            percentage,
            color: CATEGORY_COLORS[key] || CATEGORY_COLORS.other
          });
        }
      });
      
      // Sort categories by amount (largest first)
      tempCategories.sort((a, b) => b.amount - a.amount);
      setCategories(tempCategories);
    } else {
      // Default data if no expenses set
      setCategories([
        {
          key: 'housing',
          name: 'Housing & Utilities',
          amount: 1500,
          percentage: 45,
          color: CATEGORY_COLORS.housing
        },
        {
          key: 'food',
          name: 'Food & Groceries',
          amount: 600,
          percentage: 18,
          color: CATEGORY_COLORS.food
        },
        {
          key: 'transportation',
          name: 'Transportation',
          amount: 400,
          percentage: 12,
          color: CATEGORY_COLORS.transportation
        },
        {
          key: 'entertainment',
          name: 'Entertainment',
          amount: 300,
          percentage: 9,
          color: CATEGORY_COLORS.entertainment
        },
        {
          key: 'other',
          name: 'Other Expenses',
          amount: 500,
          percentage: 16,
          color: CATEGORY_COLORS.other
        }
      ]);
      
      setTotalExpenses(3300);
      setLargestCategory('housing');
    }
  }, [userData]);

  // Calculate insights based on expense data
  const getInsight = () => {
    if (!largestCategory) return '';
    
    const insights: Record<string, string> = {
      housing: 'Housing is your largest expense. The rule of thumb is to spend no more than 30% of income on housing.',
      food: 'Food is a significant expense. Consider meal planning to reduce costs without sacrificing quality.',
      transportation: 'Transportation costs are notable. Consider carpooling or public transit to reduce expenses.',
      entertainment: 'Entertainment spending is substantial. Consider free alternatives for some activities.',
      other: 'Your "Other" category is large. Consider breaking this down further to identify savings opportunities.'
    };
    
    return insights[largestCategory] || '';
  };

  // If we're not on the client yet, show a simplified version
  if (!isClient) {
    return (
      <div className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-indigo-400">Monthly Expenses</h2>
              <p className="text-gray-400 text-sm">Breakdown by category</p>
            </div>
            <div className="h-8 w-8 bg-indigo-700 rounded-full flex items-center justify-center">
              <ChartPieIcon className="h-5 w-5 text-indigo-200" />
            </div>
          </div>
          
          <div className="flex justify-center items-center h-44">
            <p className="text-gray-400">Loading expense data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-indigo-400">Monthly Expenses</h2>
            <p className="text-gray-400 text-sm">Breakdown by category</p>
          </div>
          <div className="h-8 w-8 bg-indigo-700 rounded-full flex items-center justify-center">
            <ChartPieIcon className="h-5 w-5 text-indigo-200" />
          </div>
        </div>
        
        {/* Donut chart visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative w-44 h-44">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              {/* Colored segments */}
              {categories.map((category, index) => {
                // Calculate SVG arc parameters
                const startPercent = categories
                  .slice(0, index)
                  .reduce((sum, cat) => sum + cat.percentage, 0);
                const endPercent = startPercent + category.percentage;
                
                // Convert percentages to coordinates on the circle
                const startX = 18 + 15.5 * Math.cos(2 * Math.PI * (startPercent / 100 - 0.25));
                const startY = 18 + 15.5 * Math.sin(2 * Math.PI * (startPercent / 100 - 0.25));
                const endX = 18 + 15.5 * Math.cos(2 * Math.PI * (endPercent / 100 - 0.25));
                const endY = 18 + 15.5 * Math.sin(2 * Math.PI * (endPercent / 100 - 0.25));
                
                // Determine if the arc should be drawn the long way (large-arc-flag)
                const largeArcFlag = category.percentage > 50 ? 1 : 0;
                
                // Get the color for this category
                const colorMap = {
                  housing: "#3B82F6", // blue
                  food: "#10B981",    // green
                  transportation: "#8B5CF6", // purple
                  entertainment: "#FBBF24", // yellow
                  other: "#6B7280"    // gray
                };
                
                const fillColor = colorMap[category.key as keyof typeof colorMap] || "#6B7280";
                
                return (
                  <path
                    key={category.key}
                    fill={fillColor}
                    d={`M 18 18 L ${startX} ${startY} A 15.5 15.5 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                  />
                );
              })}
              
              {/* Inner circle for donut effect */}
              <circle cx="18" cy="18" r="12" fill="#1f2937" />
              
              {/* Total expenses in the center */}
              <text
                x="18"
                y="17"
                textAnchor="middle"
                fill="#D1D5DB"
                fontSize="2.5"
                fontWeight="500"
              >
                ${totalExpenses.toLocaleString()}
              </text>
              <text
                x="18"
                y="21"
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="1.5"
              >
                Total
              </text>
            </svg>
          </div>
        </div>
        
        {/* Categories list */}
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.key} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${category.color.bg} mr-2`}></div>
                <span className="text-gray-300 text-sm">{category.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-300 text-sm font-medium mr-2">
                  ${category.amount.toLocaleString()}
                </span>
                <span className="text-gray-400 text-xs w-10 text-right">
                  {Math.round(category.percentage)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Insight based on expense data */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-start">
            <div className="bg-indigo-700 rounded-full p-1 mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">{getInsight()}</p>
          </div>
        </div>
        
        {/* Download expenses button */}
        <button className="w-full mt-6 flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 text-sm font-medium">
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Download Expenses Report
        </button>
      </div>
    </div>
  );
} 