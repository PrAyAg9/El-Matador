'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile form data
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '(555) 123-4567',
    address: '123 Financial St, Money City, 12345',
    occupation: 'Software Engineer',
    financialGoals: 'Retirement, Home purchase, Travel',
    bio: 'I am interested in personal finance and investing for the long-term.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile logic would go here
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Your Profile</h1>
          <p className="text-gray-300">Manage your account information and preferences</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-white">
                  {formData.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">{formData.displayName || 'User'}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Member since {new Date().getFullYear()}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Email Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-8">
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'personal'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'security'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button
            className={`py-3 px-1 border-b-2 text-sm font-medium ${
              activeTab === 'preferences'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </nav>
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-400 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-white">{formData.displayName || 'Not set'}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email Address
                  </label>
                  <p className="text-white">{formData.email}</p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-white">{formData.phone}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-400 mb-1">
                    Occupation
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-white">{formData.occupation}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-white">{formData.address}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="financialGoals" className="block text-sm font-medium text-gray-400 mb-1">
                    Financial Goals
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="financialGoals"
                      name="financialGoals"
                      value={formData.financialGoals}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-white">{formData.financialGoals}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-white">{formData.bio}</p>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your current password"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Update Password
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
            <p className="text-gray-300 mb-4">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive updates and alerts via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Push Notifications</p>
                    <p className="text-sm text-gray-400">Receive real-time alerts on your device</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Financial Reports</p>
                    <p className="text-sm text-gray-400">Receive weekly summaries of your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">App Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Dark Mode</p>
                    <p className="text-sm text-gray-400">Use dark theme for the app interface</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Currency Display</p>
                    <div className="mt-1">
                      <select className="bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-3">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 