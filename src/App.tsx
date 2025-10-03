import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { AuthProvider } from './contexts/AuthContext';
import { OrganizationProvider } from './contexts';
import { ThemeProvider } from './contexts';
import awsConfig from './config/awsConfig';

// Components
import LoginComponent from './components/auth/LoginComponent';
import RegisterComponent from './components/auth/RegisterComponent';
import ForgotPasswordComponent from './components/auth/ForgotPasswordComponent';
import AcceptInvitation from './components/auth/AcceptInvitation';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import VideosPage from './components/VideosPage';
import UploadPage from './components/UploadPage';
import VideoDetailPage from './components/VideoDetailPage';
import TagManagement from './components/admin/TagManagement';
import AdminVideoManagement from './components/admin/AdminVideoManagement';
import UserManagement from './components/admin/UserManagement';
import OrganizationMembers from './components/admin/OrganizationMembers';
import OrganizationSettings from './components/admin/OrganizationSettings';
import AdminFAB from './components/shared/AdminFAB';
import UserProfilePage from './components/UserProfilePage';
import SearchResultsPage from './components/SearchResultsPage';
import Footer from './components/shared/Footer';

// Configure Amplify
Amplify.configure(awsConfig);

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <OrganizationProvider>
            <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/register" element={<RegisterComponent />} />
              <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
              <Route path="/invitations/:token/accept" element={<AcceptInvitation />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <VideosPage />
                </ProtectedRoute>
              } />

              <Route path="/upload" element={
                <ProtectedRoute>
                  <AdminRoute requiredPermission="upload_files">
                    <UploadPage />
                  </AdminRoute>
                </ProtectedRoute>
              } />

              <Route path="/video/:videoId" element={
                <ProtectedRoute>
                  <VideoDetailPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/tag-management" element={
                <ProtectedRoute>
                  <AdminRoute requiredPermission="manage_tags">
                    <TagManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } />

              <Route path="/admin/videos" element={
                <ProtectedRoute>
                  <AdminRoute requiredPermission="manage_uploads">
                    <AdminVideoManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } />

              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <AdminRoute requiredPermission="view_admin">
                    <UserManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } />

              <Route path="/admin/organization-members" element={
                <ProtectedRoute>
                  <AdminRoute requiredPermission="invite_members">
                    <OrganizationMembers />
                  </AdminRoute>
                </ProtectedRoute>
              } />

              <Route path="/admin/organization-settings" element={
                <ProtectedRoute>
                  <AdminRoute requiredPermission="manage_org">
                    <OrganizationSettings />
                  </AdminRoute>
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } />

              <Route path="/search" element={
                <ProtectedRoute>
                  <SearchResultsPage />
                </ProtectedRoute>
              } />
            </Routes>
            <AdminFAB />
            <Footer />
            </div>
          </OrganizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;