import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { AuthProvider } from './contexts/AuthContext';
import { OrganizationProvider } from './contexts/OrganizationContext';
import awsConfig from './config/awsConfig';

// Components
import LoginComponent from './components/auth/LoginComponent';
import RegisterComponent from './components/auth/RegisterComponent';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import VideoDetailPage from './components/VideoDetailPage';

// Configure Amplify
Amplify.configure(awsConfig);

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <OrganizationProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/register" element={<RegisterComponent />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/upload" element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              } />

              <Route path="/video/:videoId" element={
                <ProtectedRoute>
                  <VideoDetailPage />
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