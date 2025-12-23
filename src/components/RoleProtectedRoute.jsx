import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as permissions from '../utils/permissions';
import Unauthorized from '../pages/Unauthorized';

/**
 * Route protection based on roles
 */
const RoleProtectedRoute = ({ children, allowedRoles = [], requireTenantWork = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if route requires tenant work (not SUPER_ADMIN)
  if (requireTenantWork && !permissions.canDoTenantWork(user)) {
    return <Unauthorized />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !permissions.hasAnyRole(user, allowedRoles)) {
    return <Unauthorized />;
  }

  return children;
};

export default RoleProtectedRoute;

