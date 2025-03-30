'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import ReactMarkdown from 'react-markdown';
import { SparklesIcon, StarIcon } from '@heroicons/react/24/solid';
import { generateChatResponse } from '@/lib/gemini/client';

// Various suggestion categories
interface SuggestionCategory {
  title: string;
  items: string[];
}

interface ChatSuggestions {
  [key: string]: SuggestionCategory;
}

// Predefined chat suggestions
const CHAT_SUGGESTIONS: ChatSuggestions = {
  investing: {
    title: 'Investing',
    items: [
      'What investments are right for my risk profile?',
      'How should I allocate my 401(k)?',
      'Should I invest in stocks or ETFs?',
      'What\'s a good investment strategy for retirement?'
    ]
  },
  budgeting: {
    title: 'Budgeting',
    items: [
      'How do I create a monthly budget?',
      'What\'s the 50/30/20 budget rule?',
      'How can I reduce my monthly expenses?',
      'How much should I save each month?'
    ]
  },
  retirement: {
    title: 'Retirement',
    items: [
      'How much do I need to save for retirement?',
      'What\'s the difference between traditional and Roth IRA?',
      'When should I start taking Social Security?',
      'How can I catch up on retirement savings?'
    ]
  }
};

// El Matador services
interface ElMatadorService {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

const EL_MATADOR_SERVICES: ElMatadorService[] = [
  {
    id: 'budget',
    title: 'Budget Creation & Management',
    description: 'Create personalized budgets based on your income, expenses, and financial goals.',
    icon: <div className="w-6 h-6 text-yellow-400">💰</div>
  },
  {
    id: 'credit',
    title: 'Credit Score Improvement',
    description: 'Analyze your credit history and receive tailored recommendations to boost your score.',
    icon: <div className="w-6 h-6 text-yellow-400">📈</div>
  },
  {
    id: 'retirement',
    title: 'Retirement Planning',
    description: 'Plan your retirement with confidence using our smart calculator and personalized strategies.',
    icon: <div className="w-6 h-6 text-yellow-400">🏖️</div>
  },
  {
    id: 'investment',
    title: 'Investment Opportunities',
    description: 'Discover investment opportunities tailored to your risk tolerance and financial goals.',
    icon: <div className="w-6 h-6 text-yellow-400">📊</div>
  },
  {
    id: 'tax',
    title: 'Tax Planning & Optimization',
    description: 'Understand tax implications and receive strategies to optimize your tax position.',
    icon: <div className="w-6 h-6 text-yellow-400">📝</div>
  },
  {
    id: 'stock',
    title: 'Stock & Mutual Fund Analysis',
    description: 'Get comprehensive analysis of stocks and mutual funds based on your investment profile.',
    icon: <div className="w-6 h-6 text-yellow-400">📊</div>
  },
  {
    id: 'estate',
    title: 'Estate Planning & Asset Protection',
    description: 'Protect your assets and plan for the future with comprehensive estate planning guidance.',
    icon: <div className="w-6 h-6 text-yellow-400">🏠</div>
  },
  {
    id: 'banking',
    title: 'Banking & Financial Services',
    description: 'Find the right bank and financial services for your specific needs.',
    icon: <div className="w-6 h-6 text-yellow-400">🏦</div>
  }
];

export default function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState<string | null>(null);
  const [showElMatadorServices, setShowElMatadorServices] = useState(false);
  const [isElMatadorMode, setIsElMatadorMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting message - now displayed separately instead of in the messages array
  const welcomeMessage = `Hello${user?.displayName ? ' ' + user.displayName : ''}! I'm your AI financial assistant. How can I help you today?`;

  // Scroll to bottom of chat whenever messages change
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // If in El Matador mode, format response with premium markdown
      let aiResponse = "";
      
      if (isElMatadorMode) {
        // Format an El Matador style enhanced response
        const msgLower = userMessage.toLowerCase();
        
        if (msgLower.includes('budget') || msgLower.includes('budget creation')) {
          aiResponse = `## Budget Creation & Management

Based on your financial profile, here's a personalized budget breakdown:

### Monthly Income Allocation:
- **Essential Expenses (50%):** $${Math.floor(Math.random() * 2000) + 1000}
  - Housing: $${Math.floor(Math.random() * 1000) + 800}
  - Utilities: $${Math.floor(Math.random() * 200) + 100}
  - Groceries: $${Math.floor(Math.random() * 300) + 200}
  - Transportation: $${Math.floor(Math.random() * 200) + 100}
  
- **Discretionary Spending (30%):** $${Math.floor(Math.random() * 1000) + 600}
  - Entertainment: $${Math.floor(Math.random() * 300) + 200}
  - Dining out: $${Math.floor(Math.random() * 300) + 200}
  - Shopping: $${Math.floor(Math.random() * 300) + 200}
  
- **Savings & Debt (20%):** $${Math.floor(Math.random() * 800) + 400}
  - Emergency fund: $${Math.floor(Math.random() * 300) + 200}
  - Retirement: $${Math.floor(Math.random() * 300) + 100}
  - Debt repayment: $${Math.floor(Math.random() * 200) + 100}

Would you like me to help you implement this budget or make adjustments to specific categories?`;
        } else if (msgLower.includes('credit') || msgLower.includes('credit score')) {
          aiResponse = `## Credit Score Improvement Plan

Based on your current profile, here are targeted recommendations to improve your credit score:

### Current Factors Affecting Your Score:
- **Payment History (35% impact):** Good standing with 2 late payments in past year
- **Credit Utilization (30% impact):** Currently at 68% (Recommendation: below 30%)
- **Credit Age (15% impact):** Average account age of 4 years
- **Credit Mix (10% impact):** Good mix of revolving and installment credit
- **New Credit (10% impact):** 3 recent inquiries in the past 6 months

### Action Plan:
1. **Reduce utilization immediately:**
   - Pay down highest utilization cards first
   - Consider a balance transfer to a 0% APR card

2. **Set up automatic payments:**
   - Ensure at least minimum payments are automatic
   - Set calendar reminders for payment dates

3. **Don't close old accounts:**
   - Keep your oldest accounts active with small purchases
   - Pay them off monthly to maintain history without cost

Would you like a more detailed plan for any of these areas?`;
        } else if (msgLower.includes('retirement') || msgLower.includes('retirement planning')) {
          aiResponse = `## Retirement Planning Analysis

Based on your current age, income, and savings profile, here's your retirement outlook:

### Your Retirement Numbers:
- **Target Retirement Age:** 65
- **Current Retirement Savings:** $${Math.floor(Math.random() * 100000) + 50000}
- **Monthly Contributions:** $${Math.floor(Math.random() * 1000) + 500}
- **Estimated Annual Return:** 7%

### Projections:
- **Estimated Retirement Nest Egg:** $${Math.floor(Math.random() * 1000000) + 1000000}
- **Monthly Income in Retirement:** $${Math.floor(Math.random() * 5000) + 3000}
- **Retirement Income Gap:** $${Math.floor(Math.random() * 1000) + 500}/month

### Recommendations:
1. **Increase 401(k) Contributions:**
   - Raise contribution by 2% to maximize employer match
   - Current match: 100% up to 5% of salary

2. **Optimize Investment Allocation:**
   - Current allocation: 60% stocks, 30% bonds, 10% cash
   - Recommended: 70% stocks, 25% bonds, 5% cash (based on your age and risk tolerance)

3. **Consider Roth Conversion Strategy:**
   - Tax benefits for partial conversions in current tax bracket
   - Provides tax diversification in retirement

Would you like a detailed year-by-year retirement savings plan?`;
        } else {
          // Use Gemini API but format the response differently
          const rawResponse = await generateChatResponse(messages, userMessage, user);
          
          // Format as El Matador premium response
          aiResponse = `## El Matador Financial Analysis

${rawResponse}`;
        }
      } else {
        // Use Gemini API for standard responses
        aiResponse = await generateChatResponse(messages, userMessage, user);
      }
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Sorry, I encountered an issue processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
      // Focus input field after response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleElMatadorService = (serviceId: string) => {
    // Set El Matador mode
    setIsElMatadorMode(true);
    
    // Hide services panel
    setShowElMatadorServices(false);
    
    // Find the selected service
    const service = EL_MATADOR_SERVICES.find(s => s.id === serviceId);
    
    if (service) {
      // Set input to the service title
      setInput(service.title);
      
      // Send the message
      setTimeout(handleSendMessage, 100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setActiveSuggestionCategory(null);
    inputRef.current?.focus();
  };

  // Get active suggestions based on the selected category
  const activeSuggestions = activeSuggestionCategory 
    ? CHAT_SUGGESTIONS[activeSuggestionCategory] 
    : null;

  return (
    <div className="flex flex-col h-[600px] bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
        <h2 className="text-lg font-semibold">Financial Assistant</h2>
        <div className="flex items-center">
          {isElMatadorMode && (
            <span className="mr-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded-full flex items-center">
              <StarIcon className="w-3 h-3 mr-1" />
              El Matador Mode
            </span>
          )}
          <div className="text-xs bg-indigo-700 px-2 py-1 rounded-full">
            AI Powered
          </div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
        <div className="space-y-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="flex-shrink-0 mr-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600">
                  <span className="text-sm font-medium text-white">AI</span>
                </div>
              </div>
              <div className="max-w-[75%] p-3 rounded-lg bg-gray-700 text-white">
                <p className="whitespace-pre-wrap text-sm">{welcomeMessage}</p>
              </div>
            </div>
          )}
          
          {/* Chat history with Markdown support */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'model' && (
                <div className="flex-shrink-0 mr-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600">
                    <span className="text-sm font-medium text-white">AI</span>
                  </div>
                </div>
              )}
              <div
                className={`max-w-[75%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                ) : (
                  <div className="prose prose-sm prose-invert max-w-none text-sm">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 ml-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-400">
                    <span className="text-sm font-medium text-indigo-900">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex-shrink-0 mr-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600">
                  <span className="text-sm font-medium text-white">AI</span>
                </div>
              </div>
              <div className="max-w-[75%] p-3 rounded-lg bg-gray-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* El Matador Services Panel */}
          {showElMatadorServices && (
            <div className="bg-gray-900 rounded-lg p-4 border border-yellow-500 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-yellow-400 flex items-center">
                  <StarIcon className="w-5 h-5 mr-2" />
                  El Matador Premium Services
                </h3>
                <button 
                  onClick={() => setShowElMatadorServices(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Select a premium service for in-depth financial analysis and personalized recommendations:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EL_MATADOR_SERVICES.map(service => (
                  <button
                    key={service.id}
                    onClick={() => handleElMatadorService(service.id)}
                    className="bg-gray-800 hover:bg-gray-700 border border-yellow-700 hover:border-yellow-500 rounded-lg p-3 text-left transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="mt-1 mr-3">{service.icon}</div>
                      <div>
                        <h4 className="font-medium text-yellow-400">{service.title}</h4>
                        <p className="text-gray-400 text-xs mt-1">{service.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Anchor for scrolling to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        {/* Suggestion categories */}
        {!activeSuggestions && !showElMatadorServices && (
          <div className="flex mb-3 space-x-2 overflow-x-auto pb-2 scrollbar-thin">
            {Object.keys(CHAT_SUGGESTIONS).map(category => (
              <button
                key={category}
                onClick={() => setActiveSuggestionCategory(category)}
                className="px-3 py-1 text-xs rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 whitespace-nowrap"
              >
                {CHAT_SUGGESTIONS[category].title}
              </button>
            ))}
            <button
              onClick={() => {
                setShowElMatadorServices(true);
                setActiveSuggestionCategory(null);
              }}
              className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white whitespace-nowrap flex items-center"
            >
              <StarIcon className="w-3 h-3 mr-1" />
              Let El Matador Work
            </button>
          </div>
        )}
        
        {/* Suggestion items */}
        {activeSuggestions && (
          <div className="mb-3">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium text-indigo-400">{activeSuggestions.title} Suggestions</h3>
              <button
                onClick={() => setActiveSuggestionCategory(null)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {activeSuggestions.items.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left text-sm p-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input form */}
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your financial question..."
            className="flex-1 p-3 rounded-l-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-r-lg ${
              isLoading || !input.trim()
                ? 'bg-indigo-700 text-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            Send
          </button>
        </div>
        
        {/* El Matador AI Agent coming soon message */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-pulse">
              <SparklesIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-sm text-gradient bg-gradient-to-r from-yellow-500 to-amber-300 bg-clip-text text-transparent font-semibold">
              Elmatador AI Agent coming soon - The future of finance automation
            </p>
            <div className="animate-pulse">
              <SparklesIcon className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 