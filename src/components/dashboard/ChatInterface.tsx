'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

// Simulated function for generating chat responses
const generateChatResponse = async (
  history: { role: 'user' | 'model'; text: string }[],
  message: string,
  userData: any
): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  
  // Convert message to lowercase for easier matching
  const msgLower = message.toLowerCase();
  
  // Check for specific financial topics
  if (msgLower.includes('invest') || msgLower.includes('stock') || msgLower.includes('etf') || msgLower.includes('fund')) {
    return "Based on your financial profile, I recommend a diversified portfolio with a mix of stocks, bonds, and ETFs. Consider allocating 60% to stocks, 30% to bonds, and 10% to alternative investments based on your risk tolerance. Would you like more specific investment recommendations?";
  }
  
  if (msgLower.includes('budget') || msgLower.includes('spend') || msgLower.includes('saving')) {
    return "Looking at your income and expenses, I recommend using the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. This would mean allocating about $" + (Math.floor(Math.random() * 2000) + 1000) + " to your essential needs, $" + (Math.floor(Math.random() * 1000) + 600) + " to discretionary spending, and $" + (Math.floor(Math.random() * 800) + 400) + " to savings and debt repayment. Let me help you create a personalized budget plan.";
  }
  
  if (msgLower.includes('debt') || msgLower.includes('loan') || msgLower.includes('credit')) {
    return "To reduce your debt efficiently, I recommend the avalanche method - paying minimum amounts on all debts, then using extra money to pay off high-interest debt first. This could save you thousands in interest payments. Based on the typical debt profile, focusing on credit cards first, then personal loans, and finally mortgages or student loans makes financial sense. Would you like me to create a personalized debt payoff plan?";
  }
  
  if (msgLower.includes('retire') || msgLower.includes('401k') || msgLower.includes('ira')) {
    return "For retirement planning, I suggest maximizing your tax-advantaged accounts like 401(k) and IRAs first. Based on your age and income, aim to save about 15% of your income for retirement. If you start investing $500 monthly with a 7% average return, you could have approximately $" + (Math.floor(Math.random() * 500000) + 500000) + " in 30 years. Would you like a more detailed retirement projection?";
  }
  
  if (msgLower.includes('tax') || msgLower.includes('deduction') || msgLower.includes('write-off')) {
    return "There are several tax strategies that might benefit you. Consider maximizing contributions to tax-advantaged accounts, harvesting tax losses in your investment portfolio, and tracking potential deductible expenses. Based on your profile, you might qualify for home office deductions, education credits, or health care deductions. Would you like more specific tax optimization advice?";
  }
  
  if (msgLower.includes('house') || msgLower.includes('mortgage') || msgLower.includes('property')) {
    return "When considering a home purchase, the general guideline is to spend no more than 28% of your gross monthly income on housing expenses. With current mortgage rates around 6-7%, a $300,000 home with 20% down would result in payments of approximately $1,800-$2,000 per month including taxes and insurance. Would you like me to analyze your specific home buying situation?";
  }
  
  if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey') || message.length < 10) {
    return "Hello there! I'm your El Matador financial assistant. I can help you with investment strategies, retirement planning, budgeting, debt management, and other financial questions. What would you like to know about today?";
  }
  
  // Default response if no specific topics are matched
  return "Thank you for your question about " + message.split(' ').slice(0, 3).join(' ') + "... As your financial assistant, I can provide personalized advice on this topic. To give you the most accurate guidance, could you share a bit more about your specific situation or what aspect you're most interested in?";
};

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

export default function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting message - now displayed separately instead of in the messages array
  const welcomeMessage = `Hello${user?.displayName ? ' ' + user.displayName : ''}! I'm your AI financial assistant. How can I help you today?`;

  // Scroll to bottom of chat whenever messages change
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Generate AI response
      const aiResponse = await generateChatResponse(
        messages,
        userMessage,
        user
      );
      
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
        <div className="text-xs bg-indigo-700 px-2 py-1 rounded-full">
          AI Powered
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
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.text}</p>
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
          
          {/* Anchor for scrolling to bottom */}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      
      {/* Suggestions */}
      {messages.length < 3 && !activeSuggestionCategory && (
        <div className="px-4 py-3 bg-gray-700 border-t border-gray-600">
          <h3 className="text-sm font-medium text-gray-200 mb-2">Try asking about:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(CHAT_SUGGESTIONS).map(category => (
              <button
                key={category}
                onClick={() => setActiveSuggestionCategory(category)}
                className="px-3 py-1 text-xs bg-indigo-800 text-white rounded-full hover:bg-indigo-700"
              >
                {CHAT_SUGGESTIONS[category].title}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Active suggestions */}
      {activeSuggestions && (
        <div className="px-4 py-3 bg-gray-700 border-t border-gray-600">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-200">{activeSuggestions.title}</h3>
            <button
              onClick={() => setActiveSuggestionCategory(null)}
              className="text-xs text-gray-300 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {activeSuggestions.items.map((suggestion: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 text-sm text-left bg-gray-600 text-white border border-gray-500 rounded-md hover:bg-indigo-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Chat input */}
      <div className="px-4 py-3 bg-gray-700 border-t border-gray-600">
        <div className="flex">
          <input
            type="text"
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about investments, budgeting, retirement..."
            className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white border border-gray-500 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400 text-center">
          AI-powered assistance by El Matador
        </p>
      </div>
    </div>
  );
} 