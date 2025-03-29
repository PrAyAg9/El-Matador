'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { generateChatResponse } from '@/lib/gemini/client';

// Sample suggestions for different financial topics
const CHAT_SUGGESTIONS = {
  invest: {
    title: 'Investment Advice',
    items: [
      'How should I invest $10,000?',
      'What are index funds?',
      'What investment strategy matches a moderate risk tolerance?',
      'Should I invest in individual stocks or ETFs?'
    ]
  },
  budget: {
    title: 'Budgeting Help',
    items: [
      'How do I create a monthly budget?',
      'What is the 50/30/20 budget rule?',
      'How can I reduce my monthly expenses?',
      'What budgeting apps do you recommend?'
    ]
  },
  retire: {
    title: 'Retirement Planning',
    items: [
      'How much should I save for retirement?',
      'What is the difference between 401(k) and IRA?',
      'When can I retire based on my current savings?',
      'How does Social Security fit into retirement planning?'
    ]
  },
  market: {
    title: 'Market Insights',
    items: [
      'How do interest rates affect the stock market?',
      'What is dollar-cost averaging?',
      'How should I prepare for market volatility?',
      'What economic indicators should I track?'
    ]
  }
};

export default function ChatInterface() {
  const { userData, isTestUser } = useAuth();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting message - now displayed separately instead of in the messages array
  const welcomeMessage = `Hello${userData?.displayName ? ' ' + userData.displayName : ''}! I'm your AI financial assistant. How can I help you today?`;

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Generate AI response using Gemini API
      let aiResponse;
      
      if (isTestUser) {
        // Use mock responses for test user to avoid API calls
        aiResponse = await getMockResponse(userMessage);
      } else {
        // Use actual Gemini API
        aiResponse = await generateChatResponse(
          messages,
          userMessage,
          userData
        );
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
    // Option 1: Automatically send the suggestion
    // handleSendMessage();
    
    // Option 2: Just set the input and let user send
    setActiveSuggestionCategory(null);
    inputRef.current?.focus();
  };

  // Mock response generator for test user mode
  const getMockResponse = async (message: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500));
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('invest') || lowerMessage.includes('stock')) {
      return `Based on your ${userData?.financialProfile?.riskTolerance || 'moderate'} risk profile, I recommend focusing on a diversified portfolio with a mix of stocks and bonds. 

For someone with a ${userData?.financialProfile?.riskTolerance || 'moderate'} risk tolerance, a good starting point might be:
- 60% in broad market index funds
- 30% in bond funds
- 10% in international stocks

Would you like specific investment recommendations?`;
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('spend')) {
      return `Looking at your financial profile, you might consider allocating 50% to essentials, 30% to savings/investments, and 20% to discretionary spending. 

Here's a simple breakdown:
• Essentials: Housing, utilities, food, transportation, insurance
• Savings: Emergency fund, retirement, specific goals
• Discretionary: Entertainment, dining out, hobbies

Would you like help creating a detailed budget?`;
    }
    
    if (lowerMessage.includes('retirement') || lowerMessage.includes('401k')) {
      return `Retirement planning is essential. With your current profile, you should aim to save at least 15% of your income for retirement.

Some key retirement strategies:
1. Max out tax-advantaged accounts (401(k), IRA)
2. Take full advantage of employer matches
3. Consider a Roth IRA for tax diversity
4. Increase savings rate as your income grows

Have you maxed out your 401(k) contributions this year?`;
    }
    
    if (lowerMessage.includes('market') || lowerMessage.includes('economy')) {
      return `The market has been showing mixed signals lately. Key factors to watch include:

• Federal Reserve policy and interest rates
• Inflation trends and consumer spending
• Corporate earnings reports
• Geopolitical developments

Remember that short-term market movements shouldn't drastically change a well-designed long-term investment strategy.

Would you like me to explain how these factors might affect your specific investments?`;
    }
    
    return `I understand you're asking about "${message}". To provide the most relevant advice, could you share more details about your specific financial goals?

I can help with:
• Investment strategies
• Budgeting and saving
• Retirement planning
• Debt management
• Tax planning

What area would you like to focus on?`;
  };

  // Get the active suggestions
  const getActiveSuggestions = () => {
    if (activeSuggestionCategory && CHAT_SUGGESTIONS[activeSuggestionCategory]) {
      return CHAT_SUGGESTIONS[activeSuggestionCategory];
    }
    return null;
  };

  const activeSuggestions = getActiveSuggestions();

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
        <h2 className="text-lg font-semibold">Financial Assistant</h2>
        <div className="text-xs bg-indigo-700 px-2 py-1 rounded-full">
          {isTestUser ? 'Demo Mode' : 'AI Powered'}
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="flex-shrink-0 mr-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600">
                  <span className="text-sm font-medium text-white">AI</span>
                </div>
              </div>
              <div className="max-w-[75%] p-3 rounded-lg bg-gray-100 text-gray-800">
                <p className="whitespace-pre-wrap text-sm">{welcomeMessage}</p>
              </div>
            </div>
          )}
          
          {/* Chat history */}
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
                    ? 'bg-indigo-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.text}</p>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 ml-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200">
                    <span className="text-sm font-medium text-indigo-800">
                      {userData?.displayName?.charAt(0) || userData?.email?.charAt(0) || 'U'}
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
              <div className="max-w-[75%] p-3 rounded-lg bg-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Anchor for scrolling to bottom */}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      
      {/* Suggestions */}
      {messages.length < 3 && !activeSuggestionCategory && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Try asking about:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(CHAT_SUGGESTIONS).map(category => (
              <button
                key={category}
                onClick={() => setActiveSuggestionCategory(category)}
                className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100"
              >
                {CHAT_SUGGESTIONS[category].title}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Active suggestions */}
      {activeSuggestions && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">{activeSuggestions.title}</h3>
            <button
              onClick={() => setActiveSuggestionCategory(null)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {activeSuggestions.items.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 text-sm text-left bg-white border border-gray-200 rounded-md hover:bg-indigo-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Chat input */}
      <div className="px-4 py-3 bg-gray-100 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about investments, budgeting, retirement..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">
          {isTestUser 
            ? 'Using demo mode with simulated responses'
            : 'AI-powered assistance by Google Gemini'}
        </p>
      </div>
    </div>
  );
} 