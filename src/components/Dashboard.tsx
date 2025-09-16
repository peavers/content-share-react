import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import type { UserProfile, ContentDto, ApiCall, DashboardProps } from '../types';

const Dashboard: React.FC<DashboardProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [content, setContent] = useState<ContentDto[]>([]);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Use a counter to ensure unique IDs
  const callIdCounter = useRef<number>(0);

  const addApiCall = (method: string, endpoint: string, status: 'success' | 'error', data: any): void => {
    setApiCalls(prev => [{
      id: `${Date.now()}-${++callIdCounter.current}`,
      timestamp: new Date().toLocaleTimeString(),
      method,
      endpoint,
      status,
      data: JSON.stringify(data, null, 2)
    }, ...prev.slice(0, 9)]); // Keep last 10 calls
  };

  const loadDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);

      // Test health check first
      try {
        const health = await apiService.healthCheck();
        setHealthStatus('Connected');
        addApiCall('GET', '/health', 'success', health);
      } catch (healthErr: any) {
        setHealthStatus('Disconnected');
        addApiCall('GET', '/health', 'error', { error: healthErr.message });
      }

      // Load user profile
      try {
        const profileData = await apiService.getUserProfile();
        setProfile(profileData);
        addApiCall('GET', '/api/user/profile', 'success', profileData);
      } catch (profileErr: any) {
        addApiCall('GET', '/api/user/profile', 'error', { error: profileErr.message });
      }

      // Load content
      try {
        const contentData = await apiService.getSharedContent();
        setContent(contentData);
        addApiCall('GET', '/api/content', 'success', contentData);
      } catch (contentErr: any) {
        addApiCall('GET', '/api/content', 'error', { error: contentErr.message });
      }

    } catch (err: any) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Content Share Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-500">Welcome,</span>
                <span className="ml-1 font-medium text-gray-900">{user?.username || 'User'}</span>
              </div>
              <button
                onClick={() => navigate('/upload')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Video</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">API Status</p>
                    <p className={`text-2xl font-bold ${healthStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
                      {healthStatus || 'Unknown'}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${healthStatus === 'Connected' ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                    <svg className={`w-6 h-6 ${healthStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Content Items</p>
                    <p className="text-2xl font-bold text-blue-600">{content.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">API Calls</p>
                    <p className="text-2xl font-bold text-purple-600">{apiCalls.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-medium">{user?.username}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">User ID</dt>
                      <dd className="mt-1 text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">{user?.userId}</dd>
                    </div>
                    {profile?.email && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-medium">{profile.email}</dd>
                      </div>
                    )}
                    {profile?.scopes && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Scopes</dt>
                        <dd className="mt-1">
                          <div className="flex flex-wrap gap-1">
                            {profile.scopes.map(scope => (
                              <span key={scope} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {scope}
                              </span>
                            ))}
                          </div>
                        </dd>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* API Calls Log */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recent API Calls</h3>
                  <button
                    onClick={loadDashboardData}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                  >
                    Refresh
                  </button>
                </div>
                <div className="p-6">
                  {apiCalls.length > 0 ? (
                    <div className="space-y-3">
                      {apiCalls.map(call => (
                        <div key={call.id} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${call.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                {call.method}
                              </span>
                              <span className="text-sm font-mono text-gray-600">{call.endpoint}</span>
                              <span className={`w-2 h-2 rounded-full ${call.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            </div>
                            <span className="text-xs text-gray-500">{call.timestamp}</span>
                          </div>
                          <details className="text-xs">
                            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">View Response</summary>
                            <pre className="mt-2 p-2 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">{call.data}</pre>
                          </details>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No API calls yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;