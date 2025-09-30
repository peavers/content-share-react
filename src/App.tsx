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
import VideosPage from './components/VideosPage';
import UploadPage from './components/UploadPage';
import VideoDetailPage from './components/VideoDetailPage';
import TagManagement from './components/admin/TagManagement';
import AdminVideoManagement from './components/admin/AdminVideoManagement';

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
              <Route path="/" element={
                <ProtectedRoute>
                  <VideosPage />
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

              <Route path="/admin/tag-management" element={
                <ProtectedRoute>
                  <TagManagement />
                </ProtectedRoute>
              } />

              <Route path="/admin/videos" element={
                <ProtectedRoute>
                  <AdminVideoManagement />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </OrganizationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;