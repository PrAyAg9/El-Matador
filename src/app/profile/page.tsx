'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import DashboardLayout from '@/components/dashboard/Layout'
import { UserIcon, CreditCardIcon, BellIcon, CogIcon } from '@heroicons/react/24/outline'

// Add this interface near the top of the file, before the component
interface NotificationPrefs {
  emailNotifications: boolean;
  marketUpdates: boolean;
  portfolioAlerts: boolean;
  recommendationUpdates: boolean;
  newsDigest: boolean;
  aiInsights: boolean;
  [key: string]: boolean; // Add index signature
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [pageLoading, setPageLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Personal information form state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  })

  // Financial profile form state
  const [financialProfile, setFinancialProfile] = useState({
    annualIncome: '100000',
    incomeRange: '75000-150000',
    riskTolerance: 'moderate',
    investmentGoals: ['retirement', 'wealth-building'],
    investmentHorizon: '10-20',
    existingInvestments: true,
    investmentExperience: 'intermediate'
  })

  // Notification preferences form state
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    emailNotifications: true, 
    marketUpdates: true,
    portfolioAlerts: true,
    recommendationUpdates: true,
    newsDigest: false,
    aiInsights: true
  })

  // Account settings form state
  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: false,
    darkMode: true,
    dataSharing: true,
    language: 'english'
  })

  useEffect(() => {
    if (user) {
      const [firstName, lastName] = (user.displayName || '').split(' ');
      
      // Set form data
      setPersonalInfo(prev => ({
        ...prev,
        firstName: firstName || '',
        lastName: lastName || '',
        email: user.email || '',
        phone: user.financialProfile?.phone || ''
      }))
    }
  }, [user]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else {
        // Simulate loading profile data
        const timer = setTimeout(() => {
          setPageLoading(false)
        }, 800)
        return () => clearTimeout(timer)
      }
    }
  }, [user, loading, router])

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFinancialProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    
    if (type === 'checkbox') {
      setFinancialProfile(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (name === 'investmentGoals' && type === 'checkbox') {
      if (checked) {
        setFinancialProfile(prev => ({
          ...prev,
          investmentGoals: [...prev.investmentGoals, value]
        }))
      } else {
        setFinancialProfile(prev => ({
          ...prev,
          investmentGoals: prev.investmentGoals.filter(goal => goal !== value)
        }))
      }
    } else {
      setFinancialProfile(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleNotificationPrefsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setNotificationPrefs(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleAccountSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    
    if (type === 'checkbox') {
      setAccountSettings(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setAccountSettings(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaveLoading(true)
    
    // Simulate API call to save profile data
    setTimeout(() => {
      setSaveLoading(false)
      setSuccessMessage('Your changes have been saved successfully.')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }, 1500)
  }

  if (loading || pageLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen w-full">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-xl font-semibold text-gray-300">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-400">Profile Settings</h1>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-indigo-900 bg-opacity-30 border-l-4 border-indigo-500 text-indigo-300 rounded">
            {successMessage}
          </div>
        )}
        
        {/* Profile Tabs */}
        <div className="mb-6 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'personal', label: 'Personal Information', icon: <UserIcon className="w-5 h-5 mr-2" /> },
              { id: 'financial', label: 'Financial Profile', icon: <CreditCardIcon className="w-5 h-5 mr-2" /> },
              { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5 mr-2" /> },
              { id: 'account', label: 'Account Settings', icon: <CogIcon className="w-5 h-5 mr-2" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Profile Content */}
        <div className="bg-gray-800 rounded-xl shadow-lg">
          <form onSubmit={handleSave}>
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-indigo-300 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={personalInfo.firstName}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={personalInfo.lastName}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-opacity-50"
                      readOnly
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Contact support to change your email address
                    </p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={personalInfo.dateOfBirth}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center"
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Financial Profile */}
            {activeTab === 'financial' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-indigo-300 mb-6">Financial Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-300 mb-1">
                      Annual Income ($)
                    </label>
                    <input
                      type="number"
                      id="annualIncome"
                      name="annualIncome"
                      value={financialProfile.annualIncome}
                      onChange={handleFinancialProfileChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="incomeRange" className="block text-sm font-medium text-gray-300 mb-1">
                      Income Range
                    </label>
                    <select
                      id="incomeRange"
                      name="incomeRange"
                      value={financialProfile.incomeRange}
                      onChange={handleFinancialProfileChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="0-50000">$0 - $50,000</option>
                      <option value="50000-75000">$50,000 - $75,000</option>
                      <option value="75000-150000">$75,000 - $150,000</option>
                      <option value="150000-300000">$150,000 - $300,000</option>
                      <option value="300000+">$300,000+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-300 mb-1">
                      Risk Tolerance
                    </label>
                    <select
                      id="riskTolerance"
                      name="riskTolerance"
                      value={financialProfile.riskTolerance}
                      onChange={handleFinancialProfileChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="conservative">Conservative</option>
                      <option value="moderate">Moderate</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="investmentHorizon" className="block text-sm font-medium text-gray-300 mb-1">
                      Investment Horizon (years)
                    </label>
                    <select
                      id="investmentHorizon"
                      name="investmentHorizon"
                      value={financialProfile.investmentHorizon}
                      onChange={handleFinancialProfileChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="0-5">0-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10-20">10-20 years</option>
                      <option value="20+">20+ years</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <legend className="text-sm font-medium text-gray-300 mb-3">Investment Goals</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    {[
                      { id: 'retirement', label: 'Retirement' },
                      { id: 'wealth-building', label: 'Wealth Building' },
                      { id: 'education', label: 'Education' },
                      { id: 'house', label: 'House Purchase' }
                    ].map((goal) => (
                      <div key={goal.id} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            id={`goal-${goal.id}`}
                            name="investmentGoals"
                            value={goal.id}
                            checked={financialProfile.investmentGoals.includes(goal.id)}
                            onChange={handleFinancialProfileChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                          />
                        </div>
                        <label htmlFor={`goal-${goal.id}`} className="ml-3 text-sm text-gray-300">
                          {goal.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center"
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Notification Preferences */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-indigo-300 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { id: 'marketUpdates', label: 'Market Updates', description: 'Get alerts about significant market movements' },
                    { id: 'portfolioAlerts', label: 'Portfolio Alerts', description: 'Receive alerts when your portfolio changes significantly' },
                    { id: 'recommendationUpdates', label: 'Recommendation Updates', description: 'Get notified when there are new investment recommendations' },
                    { id: 'newsDigest', label: 'News Digest', description: 'Receive weekly digest of financial news relevant to your portfolio' },
                    { id: 'aiInsights', label: 'AI Insights', description: 'Get personalized AI-generated insights about your finances' }
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id={notification.id}
                          name={notification.id}
                          checked={notificationPrefs[notification.id] || false}
                          onChange={handleNotificationPrefsChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={notification.id} className="font-medium text-gray-300">{notification.label}</label>
                        <p className="text-gray-500">{notification.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center"
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-indigo-300 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="twoFactorAuth"
                          name="twoFactorAuth"
                          checked={accountSettings.twoFactorAuth}
                          onChange={handleAccountSettingsChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="twoFactorAuth" className="font-medium text-gray-300">Two-Factor Authentication</label>
                        <p className="text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="darkMode"
                          name="darkMode"
                          checked={accountSettings.darkMode}
                          onChange={handleAccountSettingsChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="darkMode" className="font-medium text-gray-300">Dark Mode</label>
                        <p className="text-gray-500">Use dark theme throughout the application</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="dataSharing"
                          name="dataSharing"
                          checked={accountSettings.dataSharing}
                          onChange={handleAccountSettingsChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="dataSharing" className="font-medium text-gray-300">Data Sharing</label>
                        <p className="text-gray-500">Allow El Matador to use your data for better investment recommendations</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={accountSettings.language}
                      onChange={handleAccountSettingsChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center"
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
} 