'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';

interface TaxQuestion {
  id: string;
  text: string;
  options: { value: string; label: string }[];
  helpText?: string;
}

interface TaxStrategy {
  id: string;
  title: string;
  description: string;
  estimatedSavings: string | number;
  eligibility: string;
  tips: string[];
  resources?: { title: string; url: string }[];
}

export default function TaxesPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [strategies, setStrategies] = useState<TaxStrategy[]>([]);
  const [annualIncome, setAnnualIncome] = useState<string>('');
  const [potentialSavings, setPotentialSavings] = useState<number>(0);
  const [calculationComplete, setCalculationComplete] = useState(false);
  
  // Tax questions
  const questions: TaxQuestion[] = [
    {
      id: 'income',
      text: 'What is your annual income?',
      options: [],
      helpText: 'Enter your gross income before taxes and deductions'
    },
    {
      id: 'filing_status',
      text: 'What is your filing status?',
      options: [
        { value: 'single', label: 'Single' },
        { value: 'married_joint', label: 'Married filing jointly' },
        { value: 'married_separate', label: 'Married filing separately' },
        { value: 'head_household', label: 'Head of household' }
      ],
    },
    {
      id: 'retirement_accounts',
      text: 'Do you contribute to retirement accounts?',
      options: [
        { value: 'none', label: 'No, I don\'t currently contribute' },
        { value: '401k', label: 'Yes, I contribute to a 401(k) plan' },
        { value: 'ira', label: 'Yes, I contribute to an IRA' },
        { value: 'both', label: 'Yes, I contribute to both 401(k) and IRA' }
      ],
      helpText: 'Retirement accounts can provide tax advantages'
    },
    {
      id: 'investments',
      text: 'Do you have investments outside of retirement accounts?',
      options: [
        { value: 'none', label: 'No investments outside retirement accounts' },
        { value: 'stocks', label: 'Yes, I have stocks or mutual funds' },
        { value: 'real_estate', label: 'Yes, I invest in real estate' },
        { value: 'multiple', label: 'Yes, I have multiple investment types' }
      ],
    },
    {
      id: 'home_ownership',
      text: 'Do you own your home?',
      options: [
        { value: 'no', label: 'No, I rent' },
        { value: 'yes_primary', label: 'Yes, I own my primary residence' },
        { value: 'yes_multiple', label: 'Yes, I own multiple properties' }
      ],
    },
    {
      id: 'education',
      text: 'Do you pay for education expenses?',
      options: [
        { value: 'no', label: 'No educational expenses' },
        { value: 'self', label: 'Yes, for myself' },
        { value: 'dependent', label: 'Yes, for a dependent' },
        { value: 'both', label: 'Yes, for myself and dependents' }
      ],
    },
    {
      id: 'dependents',
      text: 'Do you have dependents?',
      options: [
        { value: 'no', label: 'No dependents' },
        { value: 'children', label: 'Yes, children under 17' },
        { value: 'other', label: 'Yes, other dependents' },
        { value: 'both', label: 'Yes, both children and other dependents' }
      ],
    },
  ];
  
  // Process answers and generate tax strategies
  const calculateTaxStrategies = () => {
    const income = parseInt(annualIncome.replace(/,/g, '')) || 0;
    const eligibleStrategies: TaxStrategy[] = [];
    let totalPotentialSavings = 0;
    
    // Retirement contribution strategies
    if (answers.retirement_accounts === 'none' || !answers.retirement_accounts) {
      const maxContribution = income > 100000 ? 20500 : Math.min(income * 0.15, 20500);
      const estimatedSavings = maxContribution * 0.24; // Assume 24% tax bracket
      eligibleStrategies.push({
        id: 'retirement_contrib',
        title: '401(k) or IRA Contributions',
        description: 'Contributing to retirement accounts can reduce your taxable income and build wealth for the future.',
        estimatedSavings: estimatedSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        eligibility: 'Available to most taxpayers with earned income',
        tips: [
          'Contribute enough to get your full employer match if available',
          'Consider maxing out your annual contribution ($20,500 for 401(k) in 2022)',
          'If over 50, take advantage of catch-up contributions'
        ],
        resources: [
          { title: 'IRS: Retirement Topics', url: 'https://www.irs.gov/retirement-plans' }
        ]
      });
      totalPotentialSavings += estimatedSavings;
    }
    
    // Mortgage interest deduction
    if (answers.home_ownership === 'yes_primary' || answers.home_ownership === 'yes_multiple') {
      const estimatedSavings = income * 0.03; // Simplified estimation
      eligibleStrategies.push({
        id: 'mortgage_interest',
        title: 'Mortgage Interest Deduction',
        description: 'Deduct the interest paid on your mortgage to reduce your taxable income.',
        estimatedSavings: estimatedSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        eligibility: 'Available to homeowners who itemize deductions',
        tips: [
          'Keep records of all mortgage interest payments',
          'Compare standard deduction vs. itemized to see which is more beneficial',
          'Interest on home equity loans may be deductible if used for home improvements'
        ]
      });
      totalPotentialSavings += estimatedSavings;
    }
    
    // Education credits
    if (answers.education !== 'no') {
      const estimatedSavings = 2500; // American Opportunity or Lifetime Learning Credit
      eligibleStrategies.push({
        id: 'education_credits',
        title: 'Education Tax Credits',
        description: 'Claim education-related tax credits like the American Opportunity Credit or Lifetime Learning Credit.',
        estimatedSavings: estimatedSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        eligibility: 'Available to taxpayers paying qualifying education expenses',
        tips: [
          'American Opportunity Credit provides up to $2,500 per eligible student',
          'Lifetime Learning Credit provides up to $2,000 per tax return',
          'Keep records of tuition, fees, and required course materials'
        ]
      });
      totalPotentialSavings += estimatedSavings;
    }
    
    // Child tax credit
    if (answers.dependents === 'children' || answers.dependents === 'both') {
      const estimatedSavings = 2000; // $2,000 per qualifying child
      eligibleStrategies.push({
        id: 'child_tax_credit',
        title: 'Child Tax Credit',
        description: 'Claim the Child Tax Credit for qualifying dependents under 17.',
        estimatedSavings: estimatedSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        eligibility: 'Available for qualifying children under 17',
        tips: [
          'Worth up to $2,000 per qualifying child',
          'Partially refundable up to $1,400 per child',
          'Phase-out begins at $200,000 income ($400,000 for married filing jointly)'
        ]
      });
      totalPotentialSavings += estimatedSavings;
    }
    
    // Tax-loss harvesting for investors
    if (answers.investments !== 'none') {
      const estimatedSavings = income * 0.01; // Simplified estimation
      eligibleStrategies.push({
        id: 'tax_loss_harvesting',
        title: 'Tax-Loss Harvesting',
        description: 'Offset capital gains by selling investments at a loss to reduce your tax liability.',
        estimatedSavings: estimatedSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        eligibility: 'Available to investors with taxable investment accounts',
        tips: [
          'Can offset up to $3,000 of ordinary income after offsetting capital gains',
          'Avoid wash sale rules by waiting 30 days before repurchasing substantially identical securities',
          'Consider tax-efficient fund placement across accounts'
        ]
      });
      totalPotentialSavings += estimatedSavings;
    }
    
    // HSA contributions
    eligibleStrategies.push({
      id: 'hsa_contributions',
      title: 'Health Savings Account (HSA) Contributions',
      description: 'Contribute to an HSA to save for medical expenses tax-free if you have a high-deductible health plan.',
      estimatedSavings: '$1,800+',
      eligibility: 'Available to those with high-deductible health plans',
      tips: [
        'Triple tax advantage: tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses',
        'Contribution limits: $3,650 for individual coverage, $7,300 for family coverage (2022)',
        'Can be used as a retirement account after age 65'
      ]
    });
    
    // Charitable contributions
    eligibleStrategies.push({
      id: 'charitable_giving',
      title: 'Charitable Giving Strategies',
      description: 'Optimize your charitable donations for maximum tax benefits.',
      estimatedSavings: 'Varies',
      eligibility: 'Available to taxpayers who itemize deductions',
      tips: [
        'Consider bunching donations in alternate years to exceed standard deduction threshold',
        'Donate appreciated securities to avoid capital gains tax',
        'For those over 70½, qualified charitable distributions from IRAs can satisfy required minimum distributions'
      ]
    });
    
    setStrategies(eligibleStrategies);
    setPotentialSavings(totalPotentialSavings);
    setCalculationComplete(true);
  };
  
  const handleAnswerSelection = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
    
    if (questionId === 'income') {
      setAnnualIncome(answer);
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateTaxStrategies();
    }
  };
  
  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedIncome = annualIncome.replace(/,/g, '');
    handleAnswerSelection('income', formattedIncome);
  };
  
  const formatCurrency = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format with commas
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnnualIncome(formatCurrency(value));
  };
  
  const resetCalculator = () => {
    setCurrentStep(0);
    setAnswers({});
    setAnnualIncome('');
    setStrategies([]);
    setPotentialSavings(0);
    setCalculationComplete(false);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-indigo-400">Smart Tax Planning</h1>
        <p className="text-gray-300">Optimize your tax strategy and maximize savings</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tax Calculator Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {!calculationComplete ? (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">Tax Savings Calculator</h2>
                  <p className="text-gray-300">Answer a few simple questions to discover potential tax-saving strategies.</p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-700 h-2 rounded-full mt-4">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / (questions.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Question {currentStep + 1} of {questions.length}</p>
                </div>
                
                <div className="py-4">
                  <h3 className="text-lg font-medium text-white mb-3">{questions[currentStep].text}</h3>
                  
                  {questions[currentStep].helpText && (
                    <p className="text-sm text-gray-400 mb-4">{questions[currentStep].helpText}</p>
                  )}
                  
                  {currentStep === 0 ? (
                    <form onSubmit={handleIncomeSubmit} className="space-y-4">
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 sm:text-sm">$</span>
                        </div>
                        <input
                          type="text"
                          value={annualIncome}
                          onChange={handleIncomeChange}
                          className="bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm rounded-md py-3"
                          placeholder="0.00"
                          aria-describedby="income-currency"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 sm:text-sm" id="income-currency">USD</span>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
                      >
                        Continue
                      </button>
                    </form>
                  ) : (
                    <div className="grid gap-3">
                      {questions[currentStep].options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleAnswerSelection(questions[currentStep].id, option.value)}
                          className="flex items-center p-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors text-left"
                        >
                          <div className="mr-3 h-5 w-5 flex-shrink-0 rounded-full border-2 border-indigo-400 flex items-center justify-center">
                            {answers[questions[currentStep].id] === option.value && (
                              <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                            )}
                          </div>
                          <span className="text-white">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {currentStep > 0 && (
                    <div className="mt-6">
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        ← Back to previous question
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Your Tax Saving Opportunities</h2>
                    <p className="text-gray-300">Based on your answers, we've identified these strategies.</p>
                  </div>
                  <button
                    onClick={resetCalculator}
                    className="text-xs px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
                  >
                    Start Over
                  </button>
                </div>
                
                {/* Summary Banner */}
                <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 rounded-lg p-4 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <p className="text-indigo-200 font-medium">Potential Annual Tax Savings</p>
                      <p className="text-white text-3xl font-bold">
                        {potentialSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </p>
                    </div>
                    <button className="mt-3 md:mt-0 px-4 py-2 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-100 transition-colors">
                      Download Full Report
                    </button>
                  </div>
                </div>
                
                {/* Strategy Cards */}
                <div className="space-y-6">
                  {strategies.map((strategy) => (
                    <div key={strategy.id} className="bg-gray-700 rounded-lg p-5 border border-gray-600">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-white">{strategy.title}</h3>
                        <span className="bg-indigo-900 text-indigo-300 px-2 py-1 rounded text-sm">
                          Save up to {strategy.estimatedSavings}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-2">{strategy.description}</p>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-400">Eligibility: {strategy.eligibility}</p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-white mb-2">Pro Tips:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                          {strategy.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {strategy.resources && (
                        <div className="mt-4 flex items-center">
                          <span className="text-xs text-gray-400">Learn more:</span>
                          <a href={strategy.resources[0].url} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-indigo-400 hover:text-indigo-300">
                            {strategy.resources[0].title}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-gray-700 rounded-lg p-5 border border-gray-600">
                  <h3 className="text-lg font-medium text-white mb-2">Important Notice</h3>
                  <p className="text-gray-300 text-sm">
                    This information is for educational purposes only and is not tax or legal advice. 
                    Consult with a qualified tax professional before implementing any tax strategy.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tax Calendar */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-5">
              <h2 className="text-lg font-medium text-indigo-400 mb-3">Tax Calendar</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-indigo-900 text-white text-xs font-medium px-2 py-1 rounded mr-3 mt-1">
                    APR 15
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Individual Tax Return Due</p>
                    <p className="text-gray-400 text-xs">Form 1040 or extension request due</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-gray-700 text-white text-xs font-medium px-2.5 py-1 rounded mr-3 mt-1">
                    JUN 15
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Quarterly Estimated Taxes</p>
                    <p className="text-gray-400 text-xs">Q2 estimated tax payments due</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-gray-700 text-white text-xs font-medium px-2.5 py-1 rounded mr-3 mt-1">
                    SEP 15
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Quarterly Estimated Taxes</p>
                    <p className="text-gray-400 text-xs">Q3 estimated tax payments due</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded mr-3 mt-1">
                    DEC 31
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Tax Year End</p>
                    <p className="text-gray-400 text-xs">Last day for tax-deductible activities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tax Resources */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-5">
              <h2 className="text-lg font-medium text-indigo-400 mb-3">Tax Resources</h2>
              <div className="space-y-3">
                <a href="#" className="block p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <h3 className="text-white text-sm font-medium">2023 Tax Brackets</h3>
                  <p className="text-gray-400 text-xs mt-1">Current federal income tax rates and brackets</p>
                </a>
                <a href="#" className="block p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <h3 className="text-white text-sm font-medium">Tax Deduction Checklist</h3>
                  <p className="text-gray-400 text-xs mt-1">Comprehensive list of potential deductions</p>
                </a>
                <a href="#" className="block p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <h3 className="text-white text-sm font-medium">Retirement Contribution Limits</h3>
                  <p className="text-gray-400 text-xs mt-1">Current IRA and 401(k) contribution limits</p>
                </a>
                <a href="#" className="block p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <h3 className="text-white text-sm font-medium">Tax Loss Harvesting Guide</h3>
                  <p className="text-gray-400 text-xs mt-1">How to offset gains with investment losses</p>
                </a>
              </div>
            </div>
          </div>
          
          {/* Ask a Tax Expert */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-5">
              <h2 className="text-lg font-medium text-indigo-400 mb-3">Ask a Tax Expert</h2>
              <p className="text-gray-300 text-sm mb-4">
                Have questions about your specific tax situation? Our AI assistant can help, or connect with a certified tax professional.
              </p>
              <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors mb-2">
                Ask AI Assistant
              </button>
              <button className="w-full px-4 py-2 border border-indigo-500 text-indigo-400 hover:bg-indigo-900 hover:text-indigo-300 font-medium rounded-md transition-colors">
                Schedule Advisor Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 