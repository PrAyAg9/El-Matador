'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthProvider';
import { firebaseFunctions } from '@/lib/firebase/functions';

// Define types for our form
interface FinancialProfile {
  name: string;
  age: string;
  salary: string;
  monthlyIncome: string;
  cashFlow: string;
  goals: string[];
  monthlyExpenses: {
    housing: string;
    food: string;
    transportation: string;
    entertainment: string;
    other: string;
  };
  riskTolerance: string;
  hasSavings?: string;
  savingsAmount?: string;
  monthlyDebt?: string;
}

// Available financial goals
const FINANCIAL_GOALS = [
  { id: 'retirement', label: 'Retirement' },
  { id: 'emergency', label: 'Emergency Fund' },
  { id: 'house', label: 'Buy a House' },
  { id: 'car', label: 'Buy a Car' },
  { id: 'education', label: 'Education' },
  { id: 'debt', label: 'Pay Off Debt' },
  { id: 'travel', label: 'Travel' },
  { id: 'investment', label: 'Grow Investments' }
];

export default function ElMatadorModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Start closed until confirmed client-side
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  // Initial client-side setup
  useEffect(() => {
    setIsMounted(true);
    setIsOpen(true); // Now we're on the client, we can show the modal
    
    // Check if we've seen the modal before
    if (typeof window !== 'undefined') {
      const hasSeenModal = localStorage.getItem('hasSeenElMatadorModal');
      
      if (hasSeenModal === 'true') {
        setIsOpen(false);
      }
    }
  }, []);
  
  // Form state
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>({
    name: '',
    age: '',
    salary: '',
    monthlyIncome: '',
    cashFlow: '',
    goals: [],
    monthlyExpenses: {
      housing: '',
      food: '',
      transportation: '',
      entertainment: '',
      other: ''
    },
    riskTolerance: 'moderate',
    hasSavings: 'no',
    savingsAmount: '',
    monthlyDebt: ''
  });
  
  // Update form data if userData changes
  useEffect(() => {
    if (user?.displayName && isMounted) {
      setFinancialProfile(prev => ({
        ...prev,
        name: user.displayName || ''
      }));
    }
  }, [user, isMounted]);
  
  // Calculate progress based on current step
  useEffect(() => {
    if (isMounted) {
      const totalSteps = 4;
      setProgress((currentStep / totalSteps) * 100);
    }
  }, [currentStep, isMounted]);

  // Handle closing the modal
  const handleClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenElMatadorModal', 'true');
    }
    setIsOpen(false);
  };

  // Move to the next step in the form
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Move to the previous step in the form
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested property (for expenses)
      const [parent, child] = name.split('.');
      setFinancialProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FinancialProfile] as object,
          [child]: value
        }
      }));
    } else {
      // Handle top-level property
      setFinancialProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle checkbox changes for goals
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFinancialProfile(prev => ({
        ...prev,
        goals: [...prev.goals, value]
      }));
    } else {
      setFinancialProfile(prev => ({
        ...prev,
        goals: prev.goals.filter(goal => goal !== value)
      }));
    }
  };

  // Save form data to Firebase
  const handleSave = async () => {
    setFormError('');
    setSaving(true);
    
    try {
      // Check if the user is authenticated
      if (!user) {
        setFormError('You must be logged in to save your profile.');
        setSaving(false);
        return;
      }
      
      // Transform data into expected format for storing in Firebase
      const profileData = {
        age: financialProfile.age,
        salary: financialProfile.salary,
        monthlyIncome: financialProfile.monthlyIncome,
        cashFlow: financialProfile.cashFlow,
        goals: financialProfile.goals,
        monthlyExpenses: financialProfile.monthlyExpenses,
        riskTolerance: financialProfile.riskTolerance,
        name: financialProfile.name || user?.displayName || '',
        hasSavings: financialProfile.hasSavings || 'no',
        savingsAmount: financialProfile.savingsAmount || '0',
        monthlyDebt: financialProfile.monthlyDebt || '0',
        lastUpdated: new Date().toISOString()
      };
      
      // Save the data using our function
      try {
        // Store directly to localStorage for immediate use
        if (typeof window !== 'undefined') {
          // Save profile to localStorage
          localStorage.setItem('userFinancialProfile', JSON.stringify(profileData));
          
          // Also update the current user object with the financial profile
          const currentUserString = localStorage.getItem('currentUser');
          if (currentUserString) {
            try {
              const currentUser = JSON.parse(currentUserString);
              currentUser.financialProfile = profileData;
              localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } catch (err) {
              console.error('Error updating currentUser in localStorage:', err);
            }
          }
        }
        
        // Now save to Firebase
        const success = await firebaseFunctions.updateElMatadorProfile(user.uid, profileData);
        
        if (success) {
          setSuccessMessage('Your financial profile has been saved!');
          
          // Close the modal after a short delay
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('hasSeenElMatadorModal', 'true');
            }
            setIsOpen(false);
            
            // Reload the page to refresh the dashboard with new data
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          setFormError('There was an error saving your profile. Please try again later.');
        }
      } catch (saveError: any) {
        console.error('Error saving profile:', saveError);
        
        // If we have localStorage data, inform user but don't treat as error
        if (typeof window !== 'undefined' && localStorage.getItem('userFinancialProfile')) {
          setSuccessMessage('Profile saved locally. Some features may be limited until you reconnect to our servers.');
          
          // Close the modal after a short delay
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('hasSeenElMatadorModal', 'true');
            }
            setIsOpen(false);
            
            // Reload the page to refresh the dashboard with new data
            window.location.href = '/dashboard';
          }, 3000);
          return;
        }
        
        // Display more specific error message
        const errorMessage = saveError.message || 'Unknown error';
        
        if (errorMessage.includes('Firebase') || errorMessage.includes('Database')) {
          setFormError(`Error saving your profile: ${errorMessage}`);
        } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
          setFormError('Network error. Please check your internet connection and try again.');
        } else {
          setFormError('There was an error saving your profile. Please try again later.');
        }
      }
    } catch (error: any) {
      console.error('Error in handleSave:', error);
      setFormError('Something went wrong. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  // Render the reminder for later button
  const RemindMeLaterButton = () => (
    <button
      onClick={handleClose}
      className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 focus:outline-none"
    >
      Remind Me Later
    </button>
  );

  // If not mounted yet or not open, don't render anything
  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" aria-hidden="true"></div>
        
        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
        
        {/* Modal panel */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900 shadow-xl rounded-lg border border-gray-700">
          {/* Header with logo */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center">
              <div className="h-10 w-10 relative mr-3">
                <Image 
                  src="/matador.png" 
                  alt="El Matador Logo" 
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold leading-6 text-indigo-400">
                El Matador Financial Profile
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
            <div
              className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
                    
          {/* Form content based on current step */}
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-medium text-white mb-4">Basic Information</h3>
              <p className="text-gray-400 mb-6">
                Let's start with some basic information about you.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={financialProfile.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={financialProfile.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your age"
                  />
                </div>
                
                <div>
                  <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-300 mb-1">
                    Risk Tolerance
                  </label>
                  <select
                    id="riskTolerance"
                    name="riskTolerance"
                    value={financialProfile.riskTolerance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                    <option value="very-aggressive">Very Aggressive</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Income */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-medium text-white mb-4">Income Details</h3>
              <p className="text-gray-400 mb-6">
                Help us understand your income situation to provide better financial guidance.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">
                    Annual Salary ($)
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={financialProfile.salary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 75000"
                  />
                </div>
                
                <div>
                  <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-300 mb-1">
                    Monthly Income ($)
                  </label>
                  <input
                    type="number"
                    id="monthlyIncome"
                    name="monthlyIncome"
                    value={financialProfile.monthlyIncome}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 6250"
                  />
                </div>
                
                <div>
                  <label htmlFor="monthlyDebt" className="block text-sm font-medium text-gray-300 mb-1">
                    Monthly Debt Payments ($)
                  </label>
                  <input
                    type="number"
                    id="monthlyDebt"
                    name="monthlyDebt"
                    value={financialProfile.monthlyDebt}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 1000"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    (Total of all loan payments, credit cards, etc.)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="cashFlow" className="block text-sm font-medium text-gray-300 mb-1">
                    Monthly Cash Flow ($)
                  </label>
                  <input
                    type="number"
                    id="cashFlow"
                    name="cashFlow"
                    value={financialProfile.cashFlow}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 1500"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    (How much money you have left after expenses each month)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Do you have an emergency fund or savings?
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="hasSavingsYes"
                        name="hasSavings"
                        value="yes"
                        checked={financialProfile.hasSavings === 'yes'}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                      />
                      <label htmlFor="hasSavingsYes" className="ml-2 text-sm text-gray-300">
                        Yes
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="hasSavingsNo"
                        name="hasSavings"
                        value="no"
                        checked={financialProfile.hasSavings === 'no'}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                      />
                      <label htmlFor="hasSavingsNo" className="ml-2 text-sm text-gray-300">
                        No
                      </label>
                    </div>
                  </div>
                </div>
                
                {financialProfile.hasSavings === 'yes' && (
                  <div>
                    <label htmlFor="savingsAmount" className="block text-sm font-medium text-gray-300 mb-1">
                      Total Savings Amount ($)
                    </label>
                    <input
                      type="number"
                      id="savingsAmount"
                      name="savingsAmount"
                      value={financialProfile.savingsAmount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. 10000"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Step 3: Expenses */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-xl font-medium text-white mb-4">Monthly Expenses</h3>
              <p className="text-gray-400 mb-6">
                Let us know your typical monthly expenses to help build a budget.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="housing" className="block text-sm font-medium text-gray-300 mb-1">
                    Housing ($)
                  </label>
                  <input
                    type="number"
                    id="housing"
                    name="monthlyExpenses.housing"
                    value={financialProfile.monthlyExpenses.housing}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Rent/Mortgage"
                  />
                </div>
                
                <div>
                  <label htmlFor="food" className="block text-sm font-medium text-gray-300 mb-1">
                    Food ($)
                  </label>
                  <input
                    type="number"
                    id="food"
                    name="monthlyExpenses.food"
                    value={financialProfile.monthlyExpenses.food}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Groceries and dining out"
                  />
                </div>
                
                <div>
                  <label htmlFor="transportation" className="block text-sm font-medium text-gray-300 mb-1">
                    Transportation ($)
                  </label>
                  <input
                    type="number"
                    id="transportation"
                    name="monthlyExpenses.transportation"
                    value={financialProfile.monthlyExpenses.transportation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Car, gas, public transit"
                  />
                </div>
                
                <div>
                  <label htmlFor="entertainment" className="block text-sm font-medium text-gray-300 mb-1">
                    Entertainment ($)
                  </label>
                  <input
                    type="number"
                    id="entertainment"
                    name="monthlyExpenses.entertainment"
                    value={financialProfile.monthlyExpenses.entertainment}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Subscriptions, activities"
                  />
                </div>
                
                <div>
                  <label htmlFor="other" className="block text-sm font-medium text-gray-300 mb-1">
                    Other Expenses ($)
                  </label>
                  <input
                    type="number"
                    id="other"
                    name="monthlyExpenses.other"
                    value={financialProfile.monthlyExpenses.other}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="All other expenses"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4: Financial Goals */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-xl font-medium text-white mb-4">Financial Goals</h3>
              <p className="text-gray-400 mb-6">
                Select the financial goals that matter most to you. El Matador will help you achieve them.
              </p>
              
              <div className="space-y-4">
                {FINANCIAL_GOALS.map((goal) => (
                  <div key={goal.id} className="flex items-start">
                    <input
                      type="checkbox"
                      id={goal.id}
                      name="goals"
                      value={goal.id}
                      checked={financialProfile.goals.includes(goal.id)}
                      onChange={handleGoalChange}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor={goal.id} className="ml-3 text-sm text-gray-300">
                      {goal.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Success message */}
          {successMessage && (
            <div className="mt-6 py-3 px-4 bg-green-900 bg-opacity-50 border border-green-700 rounded-md">
              <p className="text-green-300">{successMessage}</p>
            </div>
          )}
          
          {/* Error message */}
          {formError && (
            <div className="mt-6 py-3 px-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-md">
              <p className="text-red-300">{formError}</p>
            </div>
          )}
          
          {/* Footer with buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
            {currentStep > 1 ? (
              <button
                onClick={handlePrevStep}
                disabled={saving}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Back
              </button>
            ) : (
              <RemindMeLaterButton />
            )}
            
            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save & Continue'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 