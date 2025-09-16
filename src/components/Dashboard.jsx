import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiCalls, setApiCalls] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Use a counter to ensure unique IDs
  const callIdCounter = useRef(0);

  const addApiCall = (method, endpoint, status, data) => {
    setApiCalls(prev => [{
      id: `${Date.now()}-${++callIdCounter.current}`,
      timestamp: new Date().toLocaleTimeString(),
      method,
      endpoint,
      status,
      data: JSON.stringify(data, null, 2)
    }, ...prev.slice(0, 9)]); // Keep last 10 calls
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Test health check first
      try {
        const health = await apiService.healthCheck();
        setHealthStatus('Connected');
        addApiCall('GET', '/health', 'success', health);
      } catch (healthErr) {
        setHealthStatus('Disconnected');
        addApiCall('GET', '/health', 'error', { error: healthErr.message });
      }

      // Load user profile
      try {
        const profileData = await apiService.getUserProfile();
        setProfile(profileData);
        addApiCall('GET', '/api/user/profile', 'success', profileData);
      } catch (profileErr) {
        addApiCall('GET', '/api/user/profile', 'error', { error: profileErr.message });
      }

      // Load content
      try {
        const contentData = await apiService.getSharedContent();
        setContent(contentData);
        addApiCall('GET', '/api/content', 'success', contentData);
      } catch (contentErr) {
        addApiCall('GET', '/api/content', 'error', { error: contentErr.message });
      }

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (err) {
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
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-0 space-y-8">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* API Status */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${healthStatus === 'Connected' ? 'bg-green-500' : 'bg-red-500'} mr-3`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">API Status</p>
                    <p className={`text-lg font-semibold ${healthStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}`}>
                      {healthStatus || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Content */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Content</p>
                    <p className="text-2xl font-bold text-gray-900">{content.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Shared Items */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Shared Items</p>
                    <p className="text-2xl font-bold text-gray-900">{content.filter(c => c.shared).length || 0}</p>
                  </div>
                </div>
              </div>

              {/* API Calls */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">API Calls</p>
                    <p className="text-2xl font-bold text-gray-900">{apiCalls.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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