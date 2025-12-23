import { useSelector } from 'react-redux';
import * as permissions from '../utils/permissions';

/**
 * Custom hook to check user permissions
 */
export const usePermissions = () => {
  const { user } = useSelector((state) => state.auth);

  return {
    user,
    // Role checks
    isSuperAdmin: permissions.hasRole(user, permissions.ROLES.SUPER_ADMIN),
    isOrgAdmin: permissions.hasRole(user, permissions.ROLES.ORG_ADMIN),
    isProjectManager: permissions.hasRole(user, permissions.ROLES.PROJECT_MANAGER),
    isEmployee: permissions.hasRole(user, permissions.ROLES.EMPLOYEE),
    
    // Permission checks
    canManageTenants: permissions.canManageTenants(user),
    canManageUsers: permissions.canManageUsers(user),
    canManageProjects: permissions.canManageProjects(user),
    canCreateProjects: permissions.canCreateProjects(user),
    canDeleteProjects: permissions.canDeleteProjects(user),
    canManageTasks: permissions.canManageTasks(user),
    canCreateTasks: permissions.canCreateTasks(user),
    canAssignTasks: permissions.canAssignTasks(user),
    canDeleteTasks: permissions.canDeleteTasks(user),
    canViewReports: permissions.canViewReports(user),
    canViewAuditLogs: permissions.canViewAuditLogs(user),
    canViewUsers: permissions.canViewUsers(user),
    canDoTenantWork: permissions.canDoTenantWork(user),
    
    // Context-specific permissions
    canEditProject: (project) => permissions.canEditProject(user, project),
    canEditTask: (task) => permissions.canEditTask(user, task),
    canDeleteTask: (task) => permissions.canDeleteTask(user, task),
  };
};

export default usePermissions;

