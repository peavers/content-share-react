import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { AuthProvider } from './contexts/AuthContext';
import { OrganizationProvider } from './contexts/OrganizationContext';
import awsConfig from './config/awsConfig';
import type { AppProps } from './types';

// Authentication Components
import LoginComponent from './components/auth/LoginComponent';
import RegisterComponent from './components/auth/RegisterComponent';
import ForgotPasswordComponent from './components/auth/ForgotPasswordComponent';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout Component
import MainLayout from './components/layout/MainLayout';

// Page Components
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { VideosPage } from './components/videos/VideosPage';
import VideoUpload from './components/VideoUpload';
import { OrganizationPage } from './components/organization/OrganizationPage';
import { SettingsPage } from './components/settings/SettingsPage';

// Configure Amplify
Amplify.configure(awsConfig);

const App: React.FC<AppProps> = () => {
  return (
    <Router>
      <AuthProvider>
        <OrganizationProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/register" element={<RegisterComponent />} />
              <Route path="/forgot-password" element={<ForgotPasswordComponent />} />

              {/* Protected Routes with Layout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardOverview />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/videos" element={
                <ProtectedRoute>
                  <MainLayout>
                    <VideosPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <MainLayout>
                    <VideoUpload />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/organization" element={
                <ProtectedRoute>
                  <MainLayout>
                    <OrganizationPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </OrganizationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;