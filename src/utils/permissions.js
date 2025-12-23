/**
 * Role-based permission utilities
 */

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  EMPLOYEE: 'EMPLOYEE',
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user, role) => {
  return user?.role === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user, roles) => {
  return user && roles.includes(user.role);
};

/**
 * Check if user can manage tenants
 */
export const canManageTenants = (user) => {
  return hasRole(user, ROLES.SUPER_ADMIN);
};

/**
 * Check if user can manage users
 */
export const canManageUsers = (user) => {
  return hasAnyRole(user, [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]);
};

/**
 * Check if user can manage projects
 */
export const canManageProjects = (user) => {
  return hasAnyRole(user, [ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER]);
};

/**
 * Check if user can create projects
 */
export const canCreateProjects = (user) => {
  return hasAnyRole(user, [ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER]);
};

/**
 * Check if user can delete projects
 */
export const canDeleteProjects = (user) => {
  return hasRole(user, ROLES.ORG_ADMIN);
};

/**
 * Check if user can manage tasks
 */
export const canManageTasks = (user) => {
  return hasAnyRole(user, [ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER]);
};

/**
 * Check if user can create tasks
 */
export const canCreateTasks = (user) => {
  return hasAnyRole(user, [ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER]);
};

/**
 * Check if user can assign tasks
 */
export const canAssignTasks = (user) => {
  return hasAnyRole(user, [ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER]);
};

/**
 * Check if user can delete tasks
 */
export const canDeleteTasks = (user) => {
  return hasAnyRole(user, [ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER]);
};

/**
 * Check if user can view reports
 */
export const canViewReports = (user) => {
  return hasAnyRole(user, [ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER]);
};

/**
 * Check if user can view audit logs
 */
export const canViewAuditLogs = (user) => {
  return hasRole(user, ROLES.ORG_ADMIN);
};

/**
 * Check if user can view users
 */
export const canViewUsers = (user) => {
  return hasAnyRole(user, [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]);
};

/**
 * Check if user is restricted to tenant work (not SUPER_ADMIN)
 */
export const canDoTenantWork = (user) => {
  return !hasRole(user, ROLES.SUPER_ADMIN);
};

/**
 * Check if user can edit a project (ORG_ADMIN can edit any, PROJECT_MANAGER only their own)
 */
export const canEditProject = (user, project) => {
  if (!user || !project) return false;
  
  if (hasRole(user, ROLES.ORG_ADMIN)) return true;
  
  if (hasRole(user, ROLES.PROJECT_MANAGER)) {
    return (
      project.managerId?._id === user.id ||
      project.ownerId?._id === user.id ||
      project.members?.some(
        m => m.userId?._id === user.id && m.role === 'LEAD'
      )
    );
  }
  
  return false;
};

/**
 * Check if user can edit a task
 */
export const canEditTask = (user, task) => {
  if (!user || !task) return false;
  
  if (hasRole(user, ROLES.ORG_ADMIN)) return true;
  
  if (hasRole(user, ROLES.PROJECT_MANAGER)) {
    // PROJECT_MANAGER can edit tasks in their projects
    // This will be checked on the backend, but we can show/hide UI
    return true; // Will be validated by backend
  }
  
  if (hasRole(user, ROLES.EMPLOYEE)) {
    // EMPLOYEE can only edit assigned tasks
    return task.assigneeId?._id === user.id || task.assigneeId === user.id;
  }
  
  return false;
};

/**
 * Check if user can delete a task
 */
export const canDeleteTask = (user, task) => {
  if (!user || !task) return false;
  
  return hasAnyRole(user, [ROLES.ORG_ADMIN, ROLES.PROJECT_MANAGER]);
};

