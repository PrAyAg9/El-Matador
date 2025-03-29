'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/components/auth/AuthProvider';
import { FiArrowRight, FiBarChart2, FiPieChart, FiDollarSign, FiMessageCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: <FiPieChart className="h-6 w-6" />,
      title: 'Expense Tracking',
      description: 'Visualize your spending patterns with beautiful charts and insights.'
    },
    {
      icon: <FiBarChart2 className="h-6 w-6" />,
      title: 'Financial Health',
      description: 'Get a clear picture of your financial health with our scoring system.'
    },
    {
      icon: <FiDollarSign className="h-6 w-6" />,
      title: 'Investment Tracking',
      description: 'Monitor your investments and portfolio growth over time.'
    },
    {
      icon: <FiMessageCircle className="h-6 w-6" />,
      title: 'AI Assistant',
      description: 'Ask financial questions and get expert advice from our AI assistant.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg
              viewBox="0 0 1200 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full opacity-10"
            >
              <defs>
                <pattern id="pattern1" patternUnits="userSpaceOnUse" width="200" height="200" patternTransform="scale(0.75)">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(79, 70, 229, 0.2)" strokeWidth="1" />
                </pattern>
                <pattern id="pattern2" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(1.5)">
                  <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(79, 70, 229, 0.1)" strokeWidth="1" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(79, 70, 229, 0.1)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="1200" height="800" fill="url(#pattern1)" />
              <rect width="1200" height="800" fill="url(#pattern2)" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  <Image 
                    src="/matador.png" 
                    alt="El Matador" 
                    width={128} 
                    height={128}
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
                El Matador <span className="text-indigo-400">Financial</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your AI-powered financial assistant for tracking expenses, 
                monitoring investments, and improving your financial health.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg transition duration-150"
                  >
                    Go to Dashboard
                    <FiArrowRight className="ml-2" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg transition duration-150"
                    >
                      Get Started
                      <FiArrowRight className="ml-2" />
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center justify-center px-8 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-200 hover:bg-gray-800 md:text-lg transition duration-150"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800 bg-opacity-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Financial Tools
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage your finances in one place
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300"
              >
                <div className="bg-indigo-600 p-2 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join El Matador today and transform the way you manage your money with AI-powered insights and recommendations.
          </p>
          
          {!user && (
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-200 md:text-lg transition duration-150"
            >
              Create Your Account
              <FiArrowRight className="ml-2" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="relative w-10 h-10 mr-2">
                <Image
                  src="/matador.png"
                  alt="El Matador"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-white font-bold text-xl">El Matador</span>
            </div>
            
            <div className="mt-4 md:mt-0 text-gray-400 text-sm">
              © {new Date().getFullYear()} El Matador Financial. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
