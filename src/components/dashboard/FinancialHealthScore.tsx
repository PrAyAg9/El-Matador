'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface HealthScoreProps {
  className?: string;
}

export default function FinancialHealthScore({ className = '' }: HealthScoreProps) {
  const { userData } = useAuth();
  const [score, setScore] = useState<number>(0);
  const [scoreCategory, setScoreCategory] = useState<string>('');
  const [scoreColor, setScoreColor] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [metrics, setMetrics] = useState<{ name: string; score: number; max: number }[]>([]);
  const [scoreBreakdown, setScoreBreakdown] = useState<{ emergencyFund: number; debtRatio: number; savingsRate: number; investmentDiversity: number }>({
    emergencyFund: 0,
    debtRatio: 0,
    savingsRate: 0,
    investmentDiversity: 0
  });
  const [scoreLevel, setScoreLevel] = useState<string>('Good');
  const [improvementTip, setImprovementTip] = useState<string>('Great work! Keep maintaining your solid financial foundation.');

  // Make sure we're on the client before rendering SVG
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Try to get data from userData first (from Firebase)
    let profile = userData?.financialProfile;
    
    // If no data from Firebase, try localStorage fallback
    if (!profile && typeof window !== 'undefined') {
      try {
        const localData = localStorage.getItem('userFinancialProfile');
        if (localData) {
          profile = JSON.parse(localData);
          console.log('Using localStorage for financial health calculation');
        }
      } catch (e) {
        console.error('Error parsing localStorage financial profile:', e);
      }
    }

    if (profile) {
      calculateHealthScore(profile);
    }
  }, [userData]);

  const calculateHealthScore = (profile: any) => {
    try {
      // Get values from profile
      const monthlyIncome = parseInt(profile.monthlyIncome) || 0;
      const monthlyExpenses = calculateTotalExpenses(profile.monthlyExpenses);
      const monthlyDebt = parseInt(profile.monthlyDebt) || 0;
      const savingsAmount = parseInt(profile.savingsAmount) || 0;
      const hasSavings = profile.hasSavings === 'yes';
      const goals = profile.goals || [];
      
      // Calculate metrics
      let emergencyFundScore = 0;
      let debtRatioScore = 0;
      let savingsRateScore = 0;
      let investmentDiversityScore = 0;
      
      // Emergency fund (0-25 points)
      // Target: 3-6 months of expenses in savings
      if (hasSavings && monthlyExpenses > 0) {
        const monthsCovered = savingsAmount / monthlyExpenses;
        if (monthsCovered >= 6) {
          emergencyFundScore = 25;
        } else if (monthsCovered >= 3) {
          emergencyFundScore = 20;
        } else if (monthsCovered >= 1) {
          emergencyFundScore = 15;
        } else {
          emergencyFundScore = 5;
        }
      }
      
      // Debt ratio (0-25 points)
      // Target: Debt payments < 30% of income
      if (monthlyIncome > 0) {
        const debtRatio = monthlyDebt / monthlyIncome;
        if (debtRatio === 0) {
          debtRatioScore = 25; // No debt
        } else if (debtRatio < 0.15) {
          debtRatioScore = 20; // Very good
        } else if (debtRatio < 0.30) {
          debtRatioScore = 15; // Good
        } else if (debtRatio < 0.40) {
          debtRatioScore = 10; // Fair
        } else {
          debtRatioScore = 5; // Poor
        }
      }
      
      // Savings rate (0-25 points)
      // Target: Saving >20% of income
      if (monthlyIncome > 0) {
        const savingsRate = (monthlyIncome - monthlyExpenses - monthlyDebt) / monthlyIncome;
        if (savingsRate >= 0.20) {
          savingsRateScore = 25; // Excellent
        } else if (savingsRate >= 0.15) {
          savingsRateScore = 20; // Very good
        } else if (savingsRate >= 0.10) {
          savingsRateScore = 15; // Good
        } else if (savingsRate >= 0.05) {
          savingsRateScore = 10; // Fair
        } else if (savingsRate > 0) {
          savingsRateScore = 5; // Poor
        }
      }
      
      // Investment diversity (0-25 points)
      // Based on number of different investment goals
      const investmentGoals = goals.filter(goal => 
        ['retirement', 'investment', 'house', 'education'].includes(goal)
      );
      
      if (investmentGoals.length >= 3) {
        investmentDiversityScore = 25; // Excellent diversity
      } else if (investmentGoals.length === 2) {
        investmentDiversityScore = 20; // Good diversity
      } else if (investmentGoals.length === 1) {
        investmentDiversityScore = 15; // Fair diversity
      }
      
      // Calculate total score (0-100)
      const totalScore = emergencyFundScore + debtRatioScore + savingsRateScore + investmentDiversityScore;
      
      // Update state
      setScore(totalScore);
      setScoreBreakdown({
        emergencyFund: emergencyFundScore,
        debtRatio: debtRatioScore,
        savingsRate: savingsRateScore,
        investmentDiversity: investmentDiversityScore
      });

      // Set metrics for visualization
      setMetrics([
        { name: 'Emergency Fund', score: emergencyFundScore, max: 25 },
        { name: 'Debt Management', score: debtRatioScore, max: 25 },
        { name: 'Savings Rate', score: savingsRateScore, max: 25 },
        { name: 'Investment Diversity', score: investmentDiversityScore, max: 25 }
      ]);
      
      // Determine score level and color
      if (totalScore >= 90) {
        setScoreLevel('Excellent');
        setScoreColor('text-green-400 fill-green-400');
      } else if (totalScore >= 75) {
        setScoreLevel('Good');
        setScoreColor('text-blue-400 fill-blue-400');
      } else if (totalScore >= 60) {
        setScoreLevel('Fair');
        setScoreColor('text-yellow-400 fill-yellow-400');
      } else if (totalScore >= 40) {
        setScoreLevel('Needs Work');
        setScoreColor('text-orange-400 fill-orange-400');
      } else {
        setScoreLevel('Danger Zone');
        setScoreColor('text-red-400 fill-red-400');
      }
      
      // Determine improvement tip
      if (emergencyFundScore < 15) {
        setImprovementTip('Build your emergency fund to cover at least 3 months of expenses.');
      } else if (debtRatioScore < 15) {
        setImprovementTip('Work on reducing your debt-to-income ratio for better financial health.');
      } else if (savingsRateScore < 15) {
        setImprovementTip('Aim to save at least 10-15% of your income for future goals.');
      } else if (investmentDiversityScore < 15) {
        setImprovementTip('Consider diversifying your investments across multiple goals.');
      } else {
        setImprovementTip('Great work! Keep maintaining your solid financial foundation.');
      }
    } catch (error) {
      console.error('Error calculating health score:', error);
    }
  };

  const calculateTotalExpenses = (expenses: any) => {
    if (!expenses) return 0;
    let total = 0;
    Object.values(expenses).forEach((amount: any) => {
      total += parseInt(amount) || 0;
    });
    return total;
  };

  // If not on client yet, show a loading state
  if (!isClient) {
    return (
      <div id="financial-health-score" className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-indigo-400">Financial Health Score</h2>
              <p className="text-gray-400 text-sm">Based on your profile data</p>
            </div>
            <div className="h-8 w-8 bg-indigo-700 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="h-5 w-5 text-indigo-200" />
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center h-52">
            <p className="text-gray-400">Loading your financial health score...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="financial-health-score" className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-indigo-400">Financial Health Score</h2>
            <p className="text-gray-400 text-sm">Based on your profile data</p>
          </div>
          <div className="h-8 w-8 bg-indigo-700 rounded-full flex items-center justify-center">
            <ShieldCheckIcon className="h-5 w-5 text-indigo-200" />
          </div>
        </div>
        
        {/* Score display */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-xs mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-gray-300 text-sm font-medium">Your Score:</span>
              <span className={`text-sm font-medium`} style={{
                color: score >= 90 ? "#34D399" : 
                       score >= 75 ? "#60A5FA" : 
                       score >= 60 ? "#FBBF24" : 
                       score >= 40 ? "#F97316" : "#F87171"
              }}>
                {score}/100 - {scoreLevel}
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
              <div 
                className="h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-1000 ease-out"
                style={{
                  width: `${score}%`,
                  background: score >= 90 ? "linear-gradient(90deg, #34D399 0%, #10B981 100%)" : 
                              score >= 75 ? "linear-gradient(90deg, #60A5FA 0%, #3B82F6 100%)" : 
                              score >= 60 ? "linear-gradient(90deg, #FBBF24 0%, #F59E0B 100%)" : 
                              score >= 40 ? "linear-gradient(90deg, #F97316 0%, #EA580C 100%)" : 
                                           "linear-gradient(90deg, #F87171 0%, #EF4444 100%)"
                }}
              >
                <span className="text-white text-xs font-semibold">{score}</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">20</span>
              <span className="text-xs text-gray-500">40</span>
              <span className="text-xs text-gray-500">60</span>
              <span className="text-xs text-gray-500">80</span>
              <span className="text-xs text-gray-500">100</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`font-semibold text-lg`} style={{
              color: score >= 90 ? "#34D399" : 
                     score >= 75 ? "#60A5FA" : 
                     score >= 60 ? "#FBBF24" : 
                     score >= 40 ? "#F97316" : "#F87171"
            }}>
              {scoreLevel}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Based on your financial profile
            </p>
          </div>
        </div>
        
        {/* Radar Chart Visualization  -- badme dalna*/}

        
        {/* Score breakdown */}
        <div className="space-y-4">
          <h3 className="text-gray-300 font-medium mb-2">Score Breakdown</h3>
          
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300 text-sm">{metric.name}</span>
                <span className="text-gray-300 text-sm font-medium">{metric.score}/{metric.max}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-2 ${
                    metric.score >= metric.max * 0.8 ? 'bg-green-500' :
                    metric.score >= metric.max * 0.6 ? 'bg-blue-500' :
                    metric.score >= metric.max * 0.4 ? 'bg-yellow-500' :
                    metric.score >= metric.max * 0.2 ? 'bg-orange-500' : 'bg-red-500'
                  } rounded-full`} 
                  style={{ width: `${(metric.score / metric.max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Improvement tip */}
        <div className="mt-6 p-4 bg-indigo-900 bg-opacity-30 rounded-lg border border-indigo-800">
          <div className="flex items-start">
            {scoreLevel === 'Danger Zone' || scoreLevel === 'Needs Work' ? (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mr-2" />
            ) : (
              <ShieldCheckIcon className="h-5 w-5 text-indigo-400 flex-shrink-0 mr-2" />
            )}
            <div>
              <p className="text-sm text-gray-300">{improvementTip}</p>
              <a 
                href="/assistant" 
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 inline-block mt-2"
              >
                Get personalized advice from El Matador →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 