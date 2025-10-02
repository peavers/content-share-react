import React from 'react';
import { useOrganization } from '../../contexts';
import { useAuth } from '../../contexts';

interface AdminRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

/**
 * Protected route wrapper that requires admin permissions
 * Checks if user has the required permission in their current workspace
 * Platform admins (ROLE_PLATFORM_ADMIN) have access to all routes
 */
const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  requiredPermission = 'view_admin'
}) => {
  const { currentWorkspace, hasPermissionInCurrentWorkspace } = useOrganization();
  const { hasScope } = useAuth();

  // Platform admins have access to everything
  const isPlatformAdmin = hasScope('ROLE_PLATFORM_ADMIN');

  // Check if user has the required permission or is a platform admin
  const hasAccess = isPlatformAdmin || hasPermissionInCurrentWorkspace(requiredPermission);

  if (!hasAccess) {
    // Redirect to main page if user doesn't have admin access
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Access Denied</h1>
            <p className="py-6">
              You don't have permission to access this page.
              {currentWorkspace?.currentUserRole && (
                <> Your current role is <strong>{currentWorkspace.currentUserRole}</strong>.</>
              )}
            </p>
            <a href="/" className="btn btn-primary">
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
