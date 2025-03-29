'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { 
  CurrencyDollarIcon, 
  CreditCardIcon,
  ShieldCheckIcon, 
  BanknotesIcon, 
  CalculatorIcon, 
  BuildingLibraryIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CubeTransparentIcon
} from '@heroicons/react/24/outline';

export default function ElMatadorServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const services = [
    {
      id: 1,
      title: 'Budget Creation & Management',
      description: 'Create personalized budgets based on your income, expenses, and financial goals. Get real-time tracking and smart suggestions to help you stay on track.',
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      color: 'from-purple-500 to-indigo-600',
      link: '/assistant?query=create+budget'
    },
    {
      id: 2,
      title: 'Credit Score Improvement',
      description: 'Analyze your credit history and receive tailored recommendations to boost your credit score. Track your progress and learn about factors affecting your score.',
      icon: <CreditCardIcon className="h-8 w-8" />,
      color: 'from-blue-500 to-cyan-600',
      link: '/assistant?query=improve+credit+score'
    },
    {
      id: 3,
      title: 'Retirement Planning',
      description: 'Plan your retirement with confidence using our smart calculator. Get personalized savings targets, investment strategies, and projected returns.',
      icon: <CalculatorIcon className="h-8 w-8" />,
      color: 'from-green-500 to-emerald-600',
      link: '/assistant?query=retirement+planning'
    },
    {
      id: 4,
      title: 'Investment Opportunities',
      description: 'Discover investment opportunities tailored to your location, risk tolerance, and financial goals. From stocks and bonds to real estate and alternative investments.',
      icon: <ChartBarIcon className="h-8 w-8" />,
      color: 'from-orange-500 to-amber-600',
      link: '/assistant?query=investment+opportunities'
    },
    {
      id: 5,
      title: 'Tax Planning & Optimization',
      description: 'Understand the tax implications of your investments and financial decisions. Receive strategies to optimize your tax position and maximize your returns.',
      icon: <BuildingLibraryIcon className="h-8 w-8" />,
      color: 'from-red-500 to-pink-600',
      link: '/assistant?query=tax+planning'
    },
    {
      id: 6,
      title: 'Stock & Mutual Fund Analysis',
      description: 'Get comprehensive analysis of stocks and mutual funds based on your investment profile. Receive tailored recommendations for your portfolio.',
      icon: <CubeTransparentIcon className="h-8 w-8" />,
      color: 'from-teal-500 to-green-600',
      link: '/assistant?query=stock+analysis'
    },
    {
      id: 7,
      title: 'Estate Planning & Asset Protection',
      description: 'Protect your assets and plan for the future with comprehensive estate planning guidance. Learn about wills, trusts, and asset protection strategies.',
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      color: 'from-violet-500 to-purple-600',
      link: '/assistant?query=estate+planning'
    },
    {
      id: 8,
      title: 'Banking & Financial Services',
      description: 'Find the right bank and financial services for your specific needs. Compare rates, fees, benefits, and receive personalized recommendations.',
      icon: <BanknotesIcon className="h-8 w-8" />,
      color: 'from-blue-400 to-indigo-500',
      link: '/assistant?query=banking+services'
    },
    {
      id: 9,
      title: 'International Money Management',
      description: 'Optimize your spending, investments, and money transfers internationally. Get advice on currency exchange, international investments, and global financial planning.',
      icon: <GlobeAltIcon className="h-8 w-8" />,
      color: 'from-indigo-500 to-blue-600',
      link: '/assistant?query=international+money+management'
    }
  ];

  const filteredServices = searchQuery
    ? services.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : services;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-400">
          El Matador <span className="text-gray-300">Financial Services</span>
        </h1>
        <p className="mt-2 text-gray-300">
          Your intelligent financial companion. Explore our comprehensive range of financial assistance services.
        </p>
      </div>
      
      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a service..."
            className="w-full px-4 py-3 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Services Grid */}
      <div id="el-matador-services" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="flex flex-col overflow-hidden transition-transform duration-300 transform bg-gray-800 rounded-xl hover:scale-[1.02]"
          >
            <div className={`bg-gradient-to-r ${service.color} p-6`}>
              <div className="flex justify-between items-center">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  {service.icon}
                </div>
                <Link 
                  href={service.link}
                  className="flex items-center text-sm font-medium text-white hover:underline"
                >
                  Ask El Matador
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="flex flex-col flex-grow p-6">
              <h3 className="text-xl font-semibold text-gray-300">{service.title}</h3>
              <p className="mt-2 text-sm text-gray-400 flex-grow">{service.description}</p>
              <Link
                href={service.link}
                className="inline-flex items-center justify-center w-full px-4 py-2 mt-4 font-medium text-white transition-colors duration-150 bg-gray-700 border border-transparent rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Section */}
      <div className="mt-16 bg-gray-800 rounded-xl p-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-indigo-400 mb-3">Why Choose El Matador?</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            Our AI-powered financial assistant offers unique benefits to help you achieve your financial goals faster.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-medium text-gray-300">Personalized Advice</h3>
            <p className="text-gray-400">
              Receive tailored recommendations based on your unique financial situation, goals, and risk tolerance.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-medium text-gray-300">Real-time Insights</h3>
            <p className="text-gray-400">
              Get up-to-date information and analysis on markets, investments, and financial trends to make informed decisions.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-medium text-gray-300">Time-saving Automation</h3>
            <p className="text-gray-400">
              Automate financial tasks and get quick answers to complex financial questions without extensive research.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to transform your finances?</h2>
            <p className="text-indigo-100">
              Get started with El Matador today and take control of your financial future.
            </p>
          </div>
          <Link
            href="/assistant"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-indigo-600 bg-white border border-transparent rounded-md shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            Chat with El Matador
          </Link>
        </div>
      </div>
    </div>
  );
} 