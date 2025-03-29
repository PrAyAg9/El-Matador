'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircleIcon, TrophyIcon } from '@heroicons/react/24/outline';

interface GoalType {
  id: string;
  name: string;
  progress: number;
  description: string;
  timeframe: string;
}

interface GoalsCardProps {
  className?: string;
}

// Goal descriptions and details based on goal IDs
const GOAL_DETAILS: Record<string, Partial<GoalType>> = {
  retirement: {
    name: 'Retirement',
    description: 'Build a nest egg for comfortable retirement',
    timeframe: 'Long term'
  },
  emergency: {
    name: 'Emergency Fund',
    description: '3-6 months of expenses saved',
    timeframe: 'Short term'
  },
  house: {
    name: 'Buy a House',
    description: 'Save for down payment and closing costs',
    timeframe: 'Medium term'
  },
  car: {
    name: 'Buy a Car',
    description: 'Save for vehicle purchase or down payment',
    timeframe: 'Medium term'
  },
  education: {
    name: 'Education',
    description: 'Save for education expenses',
    timeframe: 'Medium term'
  },
  debt: {
    name: 'Pay Off Debt',
    description: 'Eliminate high-interest debt',
    timeframe: 'Short term'
  },
  travel: {
    name: 'Travel',
    description: 'Save for vacations and travel experiences',
    timeframe: 'Short term'
  },
  investment: {
    name: 'Grow Investments',
    description: 'Increase investment portfolio value',
    timeframe: 'Ongoing'
  }
};

export default function GoalsCard({ className = '' }: GoalsCardProps) {
  const { userData } = useAuth();
  const [goals, setGoals] = useState<GoalType[]>([]);

  useEffect(() => {
    if (userData?.financialProfile?.goals?.length) {
      // Map user's goals to our detailed goal objects with random progress
      const userGoals = userData.financialProfile.goals.map(goalId => {
        const details = GOAL_DETAILS[goalId] || {};
        // Generate random progress for demo purposes
        const progress = Math.floor(Math.random() * 100);
        
        return {
          id: goalId,
          name: details.name || goalId,
          description: details.description || 'Custom financial goal',
          timeframe: details.timeframe || 'Ongoing',
          progress,
        };
      });
      
      setGoals(userGoals);
    } else {
      // Default goals if user hasn't set any
      setGoals([
        {
          id: 'retirement',
          name: 'Retirement',
          description: 'Build a nest egg for comfortable retirement',
          timeframe: 'Long term',
          progress: 15
        },
        {
          id: 'emergency',
          name: 'Emergency Fund',
          description: '3-6 months of expenses saved',
          timeframe: 'Short term',
          progress: 65
        }
      ]);
    }
  }, [userData]);

  // Returns appropriate color based on progress
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-400">Financial Goals</h2>
          <div className="h-8 w-8 bg-indigo-700 rounded-full flex items-center justify-center">
            <TrophyIcon className="h-5 w-5 text-indigo-200" />
          </div>
        </div>
        
        <div className="space-y-5">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-white font-medium">{goal.name}</h3>
                  <p className="text-gray-400 text-sm">{goal.description}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-gray-600 text-gray-300 rounded">
                  {goal.timeframe}
                </span>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="flex-1 h-2 bg-gray-600 rounded-full mr-2 overflow-hidden">
                  <div 
                    className={`h-2 ${getProgressColor(goal.progress)}`} 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <span className="text-gray-300 text-sm font-medium">{goal.progress}%</span>
              </div>
              
              {goal.progress === 100 && (
                <div className="flex items-center text-green-400 text-sm mt-2">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  <span>Goal achieved!</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button className="w-full mt-5 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition duration-200">
          Add New Goal
        </button>
      </div>
    </div>
  );
} 