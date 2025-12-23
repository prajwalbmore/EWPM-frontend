import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchManageableUsers } from '../store/slices/permissionSlice';
import { Shield, User as UserIcon, Mail, Building2, Search, X } from 'lucide-react';
import PermissionModal from '../components/Users/PermissionModal';
import usePermissions from '../hooks/usePermissions';

const Permissions = () => {
  const dispatch = useDispatch();
  const { manageableUsers, isLoading } = useSelector((state) => state.permissions);
  const { isSuperAdmin, isOrgAdmin } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchManageableUsers());
  }, [dispatch]);

  const getRoleLabel = (role) => {
    const labels = {
      SUPER_ADMIN: 'Super Admin',
      ORG_ADMIN: 'Organization Admin',
      PROJECT_MANAGER: 'Project Manager',
      EMPLOYEE: 'Employee',
    };
    return labels[role] || role;
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

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return manageableUsers;
    }

    const query = searchQuery.toLowerCase().trim();
    return manageableUsers.filter((userData) => {
      const userInfo = userData.user;
      const fullName = `${userInfo.firstName} ${userInfo.lastName}`.toLowerCase();
      const email = userInfo.email.toLowerCase();
      const role = getRoleLabel(userInfo.role).toLowerCase();
      
      return (
        fullName.includes(query) ||
        email.includes(query) ||
        role.includes(query) ||
        userInfo.firstName.toLowerCase().includes(query) ||
        userInfo.lastName.toLowerCase().includes(query)
      );
    });
  }, [manageableUsers, searchQuery]);

  const handleManagePermissions = (userData) => {
    setSelectedUser(userData.user);
    setIsPermissionModalOpen(true);
  };

  const handlePermissionModalClose = () => {
    setIsPermissionModalOpen(false);
    setSelectedUser(null);
    // Refresh the user list after closing modal
    dispatch(fetchManageableUsers());
  };

  if (!isSuperAdmin && !isOrgAdmin) {
    return (
      <div className="card text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500">You do not have permission to manage permissions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
          Permission Management
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {isSuperAdmin
            ? 'Manage permissions for individual users'
            : 'Manage permissions for Project Manager and Employee users in your organization'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="card border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="card text-center py-12 sm:py-16 border border-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-500">Loading users...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
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
                  {filteredUsers.map((userData) => {
                    const userInfo = userData.user;
                    return (
                      <tr key={userData.userId} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserIcon className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {userInfo.firstName} {userInfo.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-600 text-sm">
                          <div className="flex items-center gap-2 truncate max-w-xs">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{userInfo.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className={`badge ${getRoleBadgeColor(userInfo.role)} text-xs`}>
                            {getRoleLabel(userInfo.role)}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`badge text-xs ${
                              userInfo.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {userInfo.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleManagePermissions(userData)}
                              className="btn btn-primary flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2"
                              title="Manage permissions"
                            >
                              <Shield className="w-4 h-4" />
                              <span className="hidden lg:inline">Manage Permission</span>
                              <span className="lg:hidden">Manage</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredUsers.map((userData) => {
              const userInfo = userData.user;
              return (
                <div key={userData.userId} className="card border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {userInfo.firstName} {userInfo.lastName}
                      </p>
                      <p className="text-xs text-gray-600 truncate mt-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {userInfo.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`badge ${getRoleBadgeColor(userInfo.role)} text-xs`}>
                      {getRoleLabel(userInfo.role)}
                    </span>
                    <span
                      className={`badge text-xs ${
                        userInfo.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {userInfo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleManagePermissions(userData)}
                    className="w-full btn btn-primary flex items-center justify-center gap-2 text-sm py-2"
                    title="Manage permissions"
                  >
                    <Shield className="w-4 h-4" />
                    Manage Permission
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : manageableUsers.length === 0 ? (
        <div className="card text-center py-12 sm:py-16 border border-gray-100">
          <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-500">No users available for permission management</p>
        </div>
      ) : (
        <div className="card text-center py-12 sm:py-16 border border-gray-100">
          <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-500 mb-4">No users found matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base"
          >
            Clear search
          </button>
        </div>
      )}

      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={handlePermissionModalClose}
        user={selectedUser}
      />
    </div>
  );
};

export default Permissions;
