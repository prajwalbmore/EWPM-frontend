import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser } from '../store/slices/userSlice';
import { Plus, Trash2, Edit, User as UserIcon, Shield } from 'lucide-react';
import UserModal from '../components/Users/UserModal';
import PermissionModal from '../components/Users/PermissionModal';
import usePermissions from '../hooks/usePermissions';

const Users = () => {
  const dispatch = useDispatch();
  const { users, isLoading, pagination } = useSelector((state) => state.users);
  const { canManageUsers, isSuperAdmin, isOrgAdmin } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [permissionUser, setPermissionUser] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(id));
      dispatch(fetchUsers(filters));
    }
  };

  const handleManagePermissions = (user) => {
    setPermissionUser(user);
    setIsPermissionModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-800',
      ORG_ADMIN: 'bg-blue-100 text-blue-800',
      PROJECT_MANAGER: 'bg-green-100 text-green-800',
      EMPLOYEE: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || colors.EMPLOYEE;
  };

  const formatRole = (role) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Users
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your organization's users</p>
        </div>
        {canManageUsers && (
          <button 
            onClick={handleCreate} 
            className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">New User</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
              className="input text-sm"
            >
              <option value="">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ORG_ADMIN">Org Admin</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Status
            </label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
              className="input text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="card text-center py-12 sm:py-16 border border-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-500">Loading users...</p>
        </div>
      ) : users?.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block card border border-gray-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-700 text-sm">User</th>
                    <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-700 text-sm">Email</th>
                    <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-700 text-sm">Role</th>
                    <th className="text-left py-3 px-4 sm:px-6 font-semibold text-gray-700 text-sm">Status</th>
                    <th className="text-right py-3 px-4 sm:px-6 font-semibold text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm truncate max-w-xs">
                        {user.email}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`badge ${getRoleBadgeColor(user.role)} text-xs`}>
                          {formatRole(user.role)}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span
                          className={`badge text-xs ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        {canManageUsers && (
                          <div className="flex items-center justify-end gap-2">
                            {(isSuperAdmin || isOrgAdmin) && (
                              (isSuperAdmin || (isOrgAdmin && (user.role === 'PROJECT_MANAGER' || user.role === 'EMPLOYEE'))) && (
                                <button
                                  onClick={() => handleManagePermissions(user)}
                                  className="btn btn-secondary flex items-center gap-2 px-3 py-2"
                                  title="Manage permissions"
                                  aria-label="Manage permissions"
                                >
                                  <Shield className="w-4 h-4" />
                                </button>
                              )
                            )}
                            <button
                              onClick={() => handleEdit(user)}
                              className="btn btn-secondary flex items-center gap-2 px-3 py-2"
                              title="Edit user"
                              aria-label="Edit user"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="btn btn-danger flex items-center gap-2 px-3 py-2"
                              title="Delete user"
                              aria-label="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {users.map((user) => (
              <div key={user._id} className="card border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-600 truncate mt-1">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`badge ${getRoleBadgeColor(user.role)} text-xs`}>
                    {formatRole(user.role)}
                  </span>
                  <span
                    className={`badge text-xs ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {canManageUsers && (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    {(isSuperAdmin || isOrgAdmin) && (
                      (isSuperAdmin || (isOrgAdmin && (user.role === 'PROJECT_MANAGER' || user.role === 'EMPLOYEE'))) && (
                        <button
                          onClick={() => handleManagePermissions(user)}
                          className="flex-1 btn btn-secondary flex items-center justify-center gap-2 text-xs py-2"
                          title="Manage permissions"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Permissions</span>
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handleEdit(user)}
                      className="flex-1 btn btn-secondary flex items-center justify-center gap-2 text-xs py-2"
                      title="Edit user"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-danger flex items-center justify-center gap-2 px-4 py-2"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 card border border-gray-100">
              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4"
                >
                  Previous
                </button>
                <span className="text-xs sm:text-sm text-gray-600 px-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12 sm:py-16 border border-gray-100">
          <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-500 mb-4">No users found</p>
          {canManageUsers && (
            <button onClick={handleCreate} className="btn btn-primary">
              Create your first user
            </button>
          )}
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSuccess={() => {
          setIsModalOpen(false);
          dispatch(fetchUsers(filters));
        }}
      />

      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => {
          setIsPermissionModalOpen(false);
          setPermissionUser(null);
        }}
        user={permissionUser}
      />
    </div>
  );
};

export default Users;

