'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    timezone: 'America/New_York',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    },
    darkMode: true,
    language: 'en'
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState('profile');
  
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        displayName: user.displayName || '',
        email: user.email || '',
        // If user has a financial profile, use that data
        phone: user.financialProfile?.phone || '',
      }));
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentKey = parent as keyof typeof prev;
        const parentObj = prev[parentKey];
        
        // Ensure parentObj is an object before spreading
        if (parentObj && typeof parentObj === 'object') {
          return {
            ...prev,
            [parent]: {
              ...parentObj, // Safe to spread now that we've verified it's an object
              [child]: checked
            }
          };
        }
        // If not an object, return unchanged state
        return prev;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save the profile data
    console.log('Saving profile data:', formData);
    
    // In a real app, you would update the user profile in the database
    // For now, we'll just show a success message
    setSuccessMessage('Profile updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
    setIsEditMode(false);
  };
  
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Phoenix',
    'America/Anchorage',
    'America/Honolulu',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' }
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-gray-300">Manage your account and preferences</p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex -mb-px">
          <button
            className={`mr-8 py-2 font-medium text-sm ${
              selectedTab === 'profile'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setSelectedTab('profile')}
          >
            Profile
          </button>
          <button
            className={`mr-8 py-2 font-medium text-sm ${
              selectedTab === 'security'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setSelectedTab('security')}
          >
            Security
          </button>
          <button
            className={`mr-8 py-2 font-medium text-sm ${
              selectedTab === 'preferences'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setSelectedTab('preferences')}
          >
            Preferences
          </button>
          <button
            className={`py-2 font-medium text-sm ${
              selectedTab === 'integrations'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setSelectedTab('integrations')}
          >
            Connected Accounts
          </button>
        </div>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-900 text-green-200 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}
      
      {/* Profile Tab */}
      {selectedTab === 'profile' && (
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="mt-3 sm:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
              >
                {isEditMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            {!isEditMode ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-700 rounded-full overflow-hidden mb-4">
                      {user?.photoURL ? (
                        <Image 
                          src={user.photoURL} 
                          alt="Profile" 
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-800 text-white text-4xl font-bold">
                          {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium">{user?.displayName || 'User'}</p>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <dl>
                    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-400">Full name</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                        {formData.displayName || 'Not set'}
                      </dd>
                    </div>
                    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-gray-700">
                      <dt className="text-sm font-medium text-gray-400">Email address</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                        {formData.email}
                      </dd>
                    </div>
                    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-gray-700">
                      <dt className="text-sm font-medium text-gray-400">Phone number</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                        {formData.phone || 'Not set'}
                      </dd>
                    </div>
                    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-gray-700">
                      <dt className="text-sm font-medium text-gray-400">Time zone</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                        {formData.timezone}
                      </dd>
                    </div>
                    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-gray-700">
                      <dt className="text-sm font-medium text-gray-400">Account type</dt>
                      <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                        <span className="bg-indigo-900 text-indigo-300 px-2 py-1 rounded text-xs font-medium">
                          Premium
                        </span>
                      </dd>
                    </div>
                    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-gray-700">
                      <dt className="text-sm font-medium text-gray-400">Member since</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                        {user?.metadata?.creationTime ? 
                          new Date(user.metadata.creationTime).toLocaleDateString() : 
                          'Unknown'
                        }
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      id="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-2 px-3"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className="bg-gray-700 border border-gray-600 text-gray-400 block w-full sm:text-sm rounded-md py-2 px-3 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Contact support to change your email address
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-2 px-3"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-1">
                      Time Zone
                    </label>
                    <select
                      name="timezone"
                      id="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-2 px-3"
                    >
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
      {/* Security Tab */}
      {selectedTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Password</h2>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current-password"
                    id="current-password"
                    className="bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-2 px-3"
                  />
                </div>
                
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new-password"
                    id="new-password"
                    className="bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-2 px-3"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    className="bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-2 px-3"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Two-Factor Authentication</h2>
              
              <div className="bg-gray-700 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">Two-factor authentication is disabled</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Add an extra layer of security to your account by enabling 2FA.
                    </p>
                  </div>
                  <button
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
                  >
                    Enable
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="text-white font-medium mb-2">Recovery Options</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Recovery methods help you access your account if you lose your two-factor authentication device.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white text-sm">Recovery email: {user?.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white text-sm">Recovery phone: {formData.phone || 'Not set'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Login Sessions</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-white font-medium">Current Session</h3>
                      </div>
                      <div className="mt-2 ml-7 text-sm text-gray-400">
                        <p>Windows 10 · Chrome</p>
                        <p>IP: 192.168.1.1</p>
                        <p>Last activity: Just now</p>
                      </div>
                    </div>
                    <button
                      className="h-8 px-3 py-1 text-sm bg-red-900 hover:bg-red-800 text-red-300 font-medium rounded-md transition-colors"
                    >
                      End Session
                    </button>
                  </div>
                </div>
                
                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                  Logout from all other devices
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Preferences Tab */}
      {selectedTab === 'preferences' && (
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">User Preferences</h2>
            
            <form>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="notifications.email"
                        name="notificationPreferences.email"
                        type="checkbox"
                        checked={formData.notificationPreferences.email}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-600 bg-gray-700 focus:ring-indigo-500"
                      />
                      <label htmlFor="notifications.email" className="ml-3 text-sm text-white">
                        Email Notifications
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="notifications.push"
                        name="notificationPreferences.push"
                        type="checkbox"
                        checked={formData.notificationPreferences.push}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-600 bg-gray-700 focus:ring-indigo-500"
                      />
                      <label htmlFor="notifications.push" className="ml-3 text-sm text-white">
                        Push Notifications
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="notifications.sms"
                        name="notificationPreferences.sms"
                        type="checkbox"
                        checked={formData.notificationPreferences.sms}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-600 bg-gray-700 focus:ring-indigo-500"
                      />
                      <label htmlFor="notifications.sms" className="ml-3 text-sm text-white">
                        SMS Notifications
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-white mb-3">Appearance</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="darkMode"
                        name="darkMode"
                        type="checkbox"
                        checked={formData.darkMode}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-600 bg-gray-700 focus:ring-indigo-500"
                      />
                      <label htmlFor="darkMode" className="ml-3 text-sm text-white">
                        Dark Mode
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-white mb-3">Language</h3>
                  
                  <div>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="bg-gray-700 border border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-2 px-3"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Integrations Tab */}
      {selectedTab === 'integrations' && (
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Connected Accounts</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-md mr-3">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Facebook</h3>
                    <p className="text-gray-400 text-sm">Not connected</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors">
                  Connect
                </button>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-400 flex items-center justify-center rounded-md mr-3">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.21 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Twitter</h3>
                    <p className="text-gray-400 text-sm">Not connected</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors">
                  Connect
                </button>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-600 flex items-center justify-center rounded-md mr-3">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">GitHub</h3>
                    <p className="text-gray-400 text-sm">Not connected</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors">
                  Connect
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-800 flex items-center justify-center rounded-md mr-3">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Google</h3>
                    <p className="text-green-500 text-sm">Connected</p>
                  </div>
                </div>
                <button className="px-3 py-1 border border-gray-600 text-gray-300 text-sm font-medium rounded-md hover:bg-gray-700 transition-colors">
                  Disconnect
                </button>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-medium text-white mb-4">Financial Integrations</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">Link Bank Accounts</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        Connect your financial accounts to get personalized insights
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors">
                      Connect
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">Import Tax Documents</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        Import W-2s, 1099s, and other tax documents
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors">
                      Import
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 