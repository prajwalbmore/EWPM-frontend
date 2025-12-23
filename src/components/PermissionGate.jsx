import usePermissions from '../hooks/usePermissions';

/**
 * Component to conditionally render children based on permissions
 */
const PermissionGate = ({ 
  children, 
  permission, 
  fallback = null,
  project = null,
  task = null 
}) => {
  const perms = usePermissions();
  let hasPermission = false;

  switch (permission) {
    case 'manageTenants':
      hasPermission = perms.canManageTenants;
      break;
    case 'manageUsers':
      hasPermission = perms.canManageUsers;
      break;
    case 'createProjects':
      hasPermission = perms.canCreateProjects;
      break;
    case 'deleteProjects':
      hasPermission = perms.canDeleteProjects;
      break;
    case 'createTasks':
      hasPermission = perms.canCreateTasks;
      break;
    case 'assignTasks':
      hasPermission = perms.canAssignTasks;
      break;
    case 'deleteTasks':
      hasPermission = perms.canDeleteTasks;
      break;
    case 'viewReports':
      hasPermission = perms.canViewReports;
      break;
    case 'viewAuditLogs':
      hasPermission = perms.canViewAuditLogs;
      break;
    case 'editProject':
      hasPermission = project ? perms.canEditProject(project) : false;
      break;
    case 'editTask':
      hasPermission = task ? perms.canEditTask(task) : false;
      break;
    case 'deleteTask':
      hasPermission = task ? perms.canDeleteTask(task) : false;
      break;
    default:
      hasPermission = false;
  }

  return hasPermission ? children : fallback;
};

export default PermissionGate;

