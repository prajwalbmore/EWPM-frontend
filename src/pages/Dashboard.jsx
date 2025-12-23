import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../store/slices/projectSlice';
import { fetchTasks } from '../store/slices/taskSlice';
import { fetchUsers } from '../store/slices/userSlice';
import { fetchTenants, fetchGlobalStats } from '../store/slices/tenantSlice';
import { fetchAuditLogs } from '../store/slices/auditSlice';
import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  TrendingUp, 
  Building2, 
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import usePermissions from '../hooks/usePermissions';
import { format } from 'date-fns';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);
  const { tenants, globalStats } = useSelector((state) => state.tenants);
  const { logs: auditLogs } = useSelector((state) => state.audit);
  const { 
    canDoTenantWork, 
    isEmployee, 
    isSuperAdmin, 
    isOrgAdmin, 
    isProjectManager,
    canViewAuditLogs 
  } = usePermissions();

  useEffect(() => {
    if (isSuperAdmin) {
      // SUPER_ADMIN: Fetch global stats and tenants
      dispatch(fetchTenants({ limit: 5 }));
      dispatch(fetchGlobalStats());
    } else if (canDoTenantWork) {
      // Other roles: Fetch tenant-specific data
      dispatch(fetchProjects({ limit: 5 }));
      dispatch(fetchTasks({ limit: 10 }));
      
      if (isOrgAdmin) {
        // ORG_ADMIN: Also fetch users and audit logs
        dispatch(fetchUsers({ limit: 5 }));
        dispatch(fetchAuditLogs({ limit: 10 }));
      }
    }
  }, [dispatch, canDoTenantWork, isSuperAdmin, isOrgAdmin]);

  // SUPER_ADMIN Dashboard Stats
  const superAdminStats = globalStats ? [
    {
      title: 'Total Tenants',
      value: globalStats.totalTenants || 0,
      icon: Building2,
      color: 'bg-blue-500',
      link: '/tenants',
    },
    {
      title: 'Active Tenants',
      value: globalStats.activeTenants || 0,
      icon: Activity,
      color: 'bg-green-500',
      link: '/tenants?isActive=true',
    },
    {
      title: 'Total Users',
      value: globalStats.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      link: null,
    },
    {
      title: 'Total Projects',
      value: globalStats.totalProjects || 0,
      icon: FolderKanban,
      color: 'bg-orange-500',
      link: null,
    },
  ] : [];

  // ORG_ADMIN Dashboard Stats
  const orgAdminStats = [
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      link: '/users',
    },
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: FolderKanban,
      color: 'bg-green-500',
      link: '/projects',
    },
    {
      title: 'Active Tasks',
      value: tasks?.filter((t) => t.status !== 'DONE' && t.status !== 'CANCELLED').length || 0,
      icon: CheckSquare,
      color: 'bg-purple-500',
      link: '/tasks',
    },
    {
      title: 'Completed Tasks',
      value: tasks?.filter((t) => t.status === 'DONE').length || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/tasks?status=DONE',
    },
  ];

  // PROJECT_MANAGER Dashboard Stats
  const projectManagerStats = [
    {
      title: 'My Projects',
      value: projects?.length || 0,
      icon: FolderKanban,
      color: 'bg-blue-500',
      link: '/projects',
    },
    {
      title: 'Active Tasks',
      value: tasks?.filter((t) => t.status !== 'DONE' && t.status !== 'CANCELLED').length || 0,
      icon: CheckSquare,
      color: 'bg-green-500',
      link: '/tasks',
    },
    {
      title: 'Completed Tasks',
      value: tasks?.filter((t) => t.status === 'DONE').length || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/tasks?status=DONE',
    },
  ];

  // EMPLOYEE Dashboard Stats
  const employeeStats = [
    {
      title: 'My Active Tasks',
      value: tasks?.filter((t) => t.status !== 'DONE' && t.status !== 'CANCELLED').length || 0,
      icon: CheckSquare,
      color: 'bg-green-500',
      link: '/tasks',
    },
    {
      title: 'My Completed Tasks',
      value: tasks?.filter((t) => t.status === 'DONE').length || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/tasks?status=DONE',
    },
  ];

  // Select stats based on role
  const stats = isSuperAdmin 
    ? superAdminStats 
    : isOrgAdmin 
    ? orgAdminStats 
    : isProjectManager 
    ? projectManagerStats 
    : employeeStats;

  const recentTasks = tasks?.slice(0, 5) || [];
  const recentTenants = tenants?.slice(0, 5) || [];
  const recentAuditLogs = auditLogs?.slice(0, 10) || [];

  const getActionColor = (action) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      LOGIN: 'bg-purple-100 text-purple-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back, <span className="font-semibold text-gray-900">{user?.firstName}</span>! 
          {isSuperAdmin && ' - System Overview'}
          {isOrgAdmin && ' - Organization Overview'}
          {isProjectManager && ' - Project Overview'}
          {isEmployee && ' - My Workspace'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${stats.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 sm:gap-6`}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          const StatCard = (
            <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 sm:p-4 rounded-xl shadow-lg flex-shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          );

          return stat.link ? (
            <Link key={stat.title} to={stat.link} className="block">
              {StatCard}
            </Link>
          ) : (
            <div key={stat.title}>{StatCard}</div>
          );
        })}
      </div>

      {/* SUPER_ADMIN: Recent Tenants */}
      {isSuperAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="card border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              Recent Tenants
            </h2>
            {recentTenants.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {recentTenants.map((tenant) => (
                  <div
                    key={tenant._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-primary-200 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                      <p className="font-semibold text-gray-900 truncate">{tenant.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">@{tenant.subdomain}</p>
                    </div>
                    <span
                      className={`badge flex-shrink-0 ${
                        tenant.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tenant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No tenants yet</p>
            )}
            <div className="mt-4 sm:mt-6">
              <Link to="/tenants" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base inline-flex items-center gap-1">
                View all tenants <span>→</span>
              </Link>
            </div>
          </div>

          <div className="card border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              System Overview
            </h2>
            {globalStats && (
              <div className="space-y-4">
                <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Platform Status</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-700">Operational</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Tenants</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{globalStats.totalTenants || 0}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Active Tenants</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">
                      {globalStats.activeTenants || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{globalStats.totalUsers || 0}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Projects</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{globalStats.totalProjects || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORG_ADMIN: Recent Audit Logs */}
      {isOrgAdmin && canViewAuditLogs && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="card border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              {isEmployee ? 'My Recent Tasks' : 'Recent Tasks'}
            </h2>
            {recentTasks.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-primary-200 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                      <p className="font-semibold text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{task.projectId?.name || 'No project'}</p>
                    </div>
                    <span
                      className={`badge flex-shrink-0 ${
                        task.status === 'DONE'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No tasks yet</p>
            )}
            <div className="mt-4 sm:mt-6">
              <Link to="/tasks" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base inline-flex items-center gap-1">
                View all tasks <span>→</span>
              </Link>
            </div>
          </div>

          <div className="card border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Recent Audit Logs
            </h2>
            {recentAuditLogs.length > 0 ? (
              <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto pr-2">
                {recentAuditLogs.map((log) => (
                  <div
                    key={log._id}
                    className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-primary-200 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`badge ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <span className="text-xs text-gray-500">
                          {log.resourceType}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 truncate font-medium">
                        {log.userId?.firstName} {log.userId?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No audit logs yet</p>
            )}
            <div className="mt-4 sm:mt-6">
              <Link to="/reports" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base inline-flex items-center gap-1">
                View reports <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT_MANAGER & EMPLOYEE: Recent Tasks */}
      {!isSuperAdmin && !isOrgAdmin && canDoTenantWork && (
        <div className="card border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            {isEmployee ? 'My Recent Tasks' : 'Recent Tasks'}
          </h2>
          {recentTasks.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-primary-200 transition-colors"
                >
                  <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                    <p className="font-semibold text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="truncate block sm:inline">{task.projectId?.name || 'No project'}</span>
                      {task.assigneeId && (
                        <span className="ml-0 sm:ml-2 text-xs text-gray-500 block sm:inline">
                          • Assigned to: {task.assigneeId.firstName} {task.assigneeId.lastName}
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`badge flex-shrink-0 ${
                      task.status === 'DONE'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No tasks yet</p>
          )}
          <div className="mt-4 sm:mt-6">
            <Link to="/tasks" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base inline-flex items-center gap-1">
              View all tasks <span>→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

