# Frontend Permissions Guide

This document outlines how role-based permissions are implemented in the frontend.

## Permission Utilities

### Location: `src/utils/permissions.js`

Contains all permission checking functions:
- `hasRole(user, role)` - Check if user has specific role
- `hasAnyRole(user, roles)` - Check if user has any of the roles
- `canManageTenants(user)` - SUPER_ADMIN only
- `canManageUsers(user)` - SUPER_ADMIN, ORG_ADMIN
- `canCreateProjects(user)` - ORG_ADMIN, PROJECT_MANAGER
- `canDeleteProjects(user)` - ORG_ADMIN only
- `canCreateTasks(user)` - ORG_ADMIN, PROJECT_MANAGER
- `canAssignTasks(user)` - ORG_ADMIN, PROJECT_MANAGER
- `canViewReports(user)` - ORG_ADMIN, PROJECT_MANAGER
- `canViewAuditLogs(user)` - ORG_ADMIN only
- `canEditProject(user, project)` - Context-aware permission
- `canEditTask(user, task)` - Context-aware permission

## Custom Hook

### `usePermissions()` Hook

Located in `src/hooks/usePermissions.js`

Provides easy access to all permission checks:

```javascript
const {
  isSuperAdmin,
  isOrgAdmin,
  isProjectManager,
  isEmployee,
  canCreateProjects,
  canDeleteProjects,
  canEditProject,
  // ... etc
} = usePermissions();
```

## Route Protection

### `RoleProtectedRoute` Component

Located in `src/components/RoleProtectedRoute.jsx`

Protects routes based on roles:

```javascript
<RoleProtectedRoute allowedRoles={['ORG_ADMIN', 'PROJECT_MANAGER']}>
  <Reports />
</RoleProtectedRoute>

<RoleProtectedRoute requireTenantWork={true}>
  <Projects />
</RoleProtectedRoute>
```

## Permission Gate Component

### `PermissionGate` Component

Located in `src/components/PermissionGate.jsx`

Conditionally renders children based on permissions:

```javascript
<PermissionGate permission="createProjects">
  <button>Create Project</button>
</PermissionGate>

<PermissionGate permission="editProject" project={project}>
  <button>Edit</button>
</PermissionGate>
```

## UI Restrictions by Role

### SUPER_ADMIN
- ✅ Can see: Dashboard, Tenants
- ❌ Cannot see: Projects, Tasks, Users, Reports (tenant work)
- Sidebar: Only Dashboard and Tenants

### ORG_ADMIN
- ✅ Can see: Dashboard, Projects, Tasks, Users, Reports
- ✅ Can do: All CRUD operations on projects, tasks, users
- Sidebar: All menu items except Tenants

### PROJECT_MANAGER
- ✅ Can see: Dashboard, Projects (own only), Tasks (own projects), Reports (own projects)
- ✅ Can do: Create projects, manage own projects, create tasks in own projects
- ❌ Cannot: Delete projects, manage users, view audit logs
- Sidebar: Dashboard, Projects, Tasks, Reports (no Users, Tenants)

### EMPLOYEE
- ✅ Can see: Dashboard, Tasks (assigned only)
- ✅ Can do: Update assigned tasks, comment on assigned tasks
- ❌ Cannot: Create tasks, assign tasks, manage projects, view reports
- Sidebar: Dashboard, Tasks only

## Page-Level Restrictions

### Projects Page
- Create button: ORG_ADMIN, PROJECT_MANAGER
- Edit button: ORG_ADMIN (all), PROJECT_MANAGER (own only)
- Delete button: ORG_ADMIN only

### Tasks Page
- Create button: ORG_ADMIN, PROJECT_MANAGER
- Edit button: ORG_ADMIN (all), PROJECT_MANAGER (own projects), EMPLOYEE (assigned only)
- Delete button: ORG_ADMIN, PROJECT_MANAGER
- Assignee filter: Hidden for EMPLOYEE

### Users Page
- Entire page: SUPER_ADMIN, ORG_ADMIN only
- All actions: ORG_ADMIN only

### Reports Page
- Entire page: ORG_ADMIN, PROJECT_MANAGER only
- PROJECT_MANAGER sees only their projects' data

### Tenants Page
- Entire page: SUPER_ADMIN only

## Component-Level Restrictions

### TaskModal
- Assignee dropdown: Only shown if `canAssignTasks`
- EMPLOYEE: Shows read-only assignee info

### ProjectModal
- Status field: PROJECT_MANAGER can only edit own projects

### UserModal
- SUPER_ADMIN role option: Hidden for ORG_ADMIN
- Role selection: Disabled if trying to assign SUPER_ADMIN

## Best Practices

1. **Always check permissions before showing actions**
   ```javascript
   {canCreateProjects && (
     <button onClick={handleCreate}>Create</button>
   )}
   ```

2. **Use PermissionGate for complex conditions**
   ```javascript
   <PermissionGate permission="editProject" project={project}>
     <button>Edit</button>
   </PermissionGate>
   ```

3. **Use RoleProtectedRoute for route-level protection**
   ```javascript
   <Route
     path="users"
     element={
       <RoleProtectedRoute allowedRoles={['ORG_ADMIN']}>
         <Users />
       </RoleProtectedRoute>
     }
   />
   ```

4. **Filter data based on role in useEffect**
   ```javascript
   useEffect(() => {
     if (canDoTenantWork) {
       dispatch(fetchProjects());
     }
   }, [canDoTenantWork]);
   ```

## Security Notes

⚠️ **Important**: Frontend permissions are for UX only. All security is enforced on the backend. The backend will reject unauthorized requests even if the UI allows them.

Frontend restrictions:
- Improve user experience
- Prevent confusion
- Guide users to allowed actions
- Reduce unnecessary API calls

Backend restrictions:
- Actual security enforcement
- Cannot be bypassed
- Always validated

