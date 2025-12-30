import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTenants,
  fetchGlobalStats,
  suspendTenant,
  activateTenant,
  deleteTenant,
} from "../store/slices/tenantSlice";
import {
  Plus,
  Trash2,
  Edit,
  Building2,
  Users,
  FolderKanban,
  Power,
  PowerOff,
} from "lucide-react";
import TenantModal from "../components/Tenants/TenantModal";
import usePermissions from "../hooks/usePermissions";

const Tenants = () => {
  const dispatch = useDispatch();
  const { tenants, globalStats, isLoading, pagination } = useSelector(
    (state) => state.tenants
  );
  const { canManageTenants } = usePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [filters, setFilters] = useState({
    isActive: "",
    plan: "",
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchTenants(filters));
    dispatch(fetchGlobalStats());
  }, [dispatch, filters]);

  if (!canManageTenants) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center backdrop-blur-xl">
        <Building2 className="mx-auto mb-4 h-14 w-14 text-white/40" />
        <h2 className="text-lg font-semibold text-white">Access Denied</h2>
        <p className="mt-1 text-sm text-white/60">
          Only SUPER_ADMIN can manage tenants
        </p>
      </div>
    );
  }

  const handleCreate = () => {
    setEditingTenant(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const handleSuspend = async (id) => {
    if (window.confirm("Suspend this tenant?")) {
      await dispatch(suspendTenant(id));
      dispatch(fetchTenants(filters));
    }
  };

  const handleActivate = async (id) => {
    await dispatch(activateTenant(id));
    dispatch(fetchTenants(filters));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete tenant permanently?")) {
      await dispatch(deleteTenant(id));
      dispatch(fetchTenants(filters));
    }
  };

  const planBadge = {
    FREE: "bg-white/10 text-white/70",
    BASIC: "bg-blue-500/15 text-blue-300",
    PRO: "bg-purple-500/15 text-purple-300",
    ENTERPRISE: "bg-emerald-500/15 text-emerald-300",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tenant Management</h1>
          <p className="text-sm text-white/60">
            Manage all organizations (tenants)
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-400"
        >
          <Plus className="h-4 w-4" />
          New Tenant
        </button>
      </div>

      {/* Stats */}
      {globalStats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Tenants",
              value: globalStats.totalTenants,
              icon: Building2,
              color: "bg-primary-500/15 text-primary-300",
            },
            {
              label: "Active Tenants",
              value: globalStats.activeTenants,
              icon: Power,
              color: "bg-emerald-500/15 text-emerald-300",
            },
            {
              label: "Total Users",
              value: globalStats.totalUsers,
              icon: Users,
              color: "bg-blue-500/15 text-blue-300",
            },
            {
              label: "Total Projects",
              value: globalStats.totalProjects,
              icon: FolderKanban,
              color: "bg-purple-500/15 text-purple-300",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/60">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stat.value || 0}
                  </p>
                </div>
                <div
                  className={`rounded-xl p-3 ring-1 ring-white/10 ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">
              Status
            </label>
            <select
              value={filters.isActive}
              onChange={(e) =>
                setFilters({ ...filters, isActive: e.target.value, page: 1 })
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white option:text-black outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option className="text-black" value="">
                All
              </option>
              <option className="text-black" value="true">
                Active
              </option>
              <option className="text-black" value="false">
                Inactive
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">
              Plan
            </label>
            <select
              value={filters.plan}
              onChange={(e) =>
                setFilters({ ...filters, plan: e.target.value, page: 1 })
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option className="text-black" value="">
                All
              </option>
              <option className="text-black" value="FREE">
                Free
              </option>
              <option className="text-black" value="BASIC">
                Basic
              </option>
              <option className="text-black" value="PRO">
                Pro
              </option>
              <option className="text-black" value="ENTERPRISE">
                Enterprise
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary-400" />
          <p className="text-sm text-white/60">Loading tenants...</p>
        </div>
      ) : tenants?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tenants.map((tenant) => (
            <div
              key={tenant._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{tenant.name}</h3>
                  <p className="text-xs text-white/60">@{tenant.subdomain}</p>
                </div>
                <span
                  className={`rounded-lg px-2 py-0.5 text-xs font-medium ${
                    planBadge[tenant.subscription?.plan || "FREE"]
                  }`}
                >
                  {tenant.subscription?.plan || "FREE"}
                </span>
              </div>

              <div className="mb-3 flex gap-4 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {tenant.stats?.userCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  <FolderKanban className="h-3 w-3" />
                  {tenant.stats?.projectCount || 0}
                </span>
              </div>

              <div className="mb-4 flex items-center justify-between text-xs">
                <span
                  className={`rounded-md px-2 py-0.5 ${
                    tenant.isActive
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-rose-500/15 text-rose-300"
                  }`}
                >
                  {tenant.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-white/50">
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tenant)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-xs text-white/70 hover:bg-white/10"
                >
                  <Edit className="mx-auto h-4 w-4" />
                </button>

                {tenant.isActive ? (
                  <button
                    onClick={() => handleSuspend(tenant._id)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/70 hover:bg-white/10"
                  >
                    <PowerOff className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(tenant._id)}
                    className="rounded-xl bg-primary-500 px-3 py-2 text-white hover:bg-primary-400"
                  >
                    <Power className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(tenant._id)}
                  className="rounded-xl bg-rose-500/20 px-3 py-2 text-rose-300 hover:bg-rose-500/30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
          <Building2 className="mx-auto mb-4 h-14 w-14 text-white/40" />
          <p className="text-sm text-white/60 mb-4">No tenants found</p>
          <button
            onClick={handleCreate}
            className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-400"
          >
            Create Tenant
          </button>
        </div>
      )}

      <TenantModal
        isOpen={isModalOpen}
        tenant={editingTenant}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTenant(null);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          dispatch(fetchTenants(filters));
        }}
      />
    </div>
  );
};

export default Tenants;
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTenants, fetchGlobalStats, suspendTenant, activateTenant, deleteTenant } from '../store/slices/tenantSlice';
// import { Plus, Trash2, Edit, Building2, Users, FolderKanban, Power, PowerOff } from 'lucide-react';
// import TenantModal from '../components/Tenants/TenantModal';
// import usePermissions from '../hooks/usePermissions';

// const Tenants = () => {
//   const dispatch = useDispatch();
//   const { tenants, globalStats, isLoading, pagination } = useSelector((state) => state.tenants);
//   const { canManageTenants } = usePermissions();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTenant, setEditingTenant] = useState(null);
//   const [filters, setFilters] = useState({
//     isActive: '',
//     plan: '',
//     page: 1,
//   });

//   if (!canManageTenants) {
//     return (
//       <div className="card text-center py-12 sm:py-16 border border-gray-100">
//         <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
//         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
//         <p className="text-sm sm:text-base text-gray-500">Only SUPER_ADMIN can manage tenants</p>
//       </div>
//     );
//   }

//   useEffect(() => {
//     dispatch(fetchTenants(filters));
//     dispatch(fetchGlobalStats());
//   }, [dispatch, filters]);

//   const handleCreate = () => {
//     setEditingTenant(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (tenant) => {
//     setEditingTenant(tenant);
//     setIsModalOpen(true);
//   };

//   const handleSuspend = async (id) => {
//     if (window.confirm('Are you sure you want to suspend this tenant?')) {
//       await dispatch(suspendTenant(id));
//       dispatch(fetchTenants(filters));
//     }
//   };

//   const handleActivate = async (id) => {
//     await dispatch(activateTenant(id));
//     dispatch(fetchTenants(filters));
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
//       await dispatch(deleteTenant(id));
//       dispatch(fetchTenants(filters));
//     }
//   };

//   const getPlanColor = (plan) => {
//     const colors = {
//       FREE: 'bg-gray-100 text-gray-800',
//       BASIC: 'bg-blue-100 text-blue-800',
//       PRO: 'bg-purple-100 text-purple-800',
//       ENTERPRISE: 'bg-green-100 text-green-800',
//     };
//     return colors[plan] || colors.FREE;
//   };

//   const handlePageChange = (newPage) => {
//     setFilters({ ...filters, page: newPage });
//   };

//   return (
//     <div className="space-y-4 sm:space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
//             Tenant Management
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600">Manage all organizations (tenants)</p>
//         </div>
//         <button
//           onClick={handleCreate}
//           className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
//         >
//           <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
//           <span className="text-sm sm:text-base">New Tenant</span>
//         </button>
//       </div>

//       {/* Global Stats */}
//       {globalStats && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//           <div className="card border border-gray-100 hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Total Tenants</p>
//                 <p className="text-2xl sm:text-3xl font-bold text-gray-900">{globalStats.totalTenants || 0}</p>
//               </div>
//               <div className="bg-primary-500 p-3 sm:p-4 rounded-xl flex-shrink-0">
//                 <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//               </div>
//             </div>
//           </div>
//           <div className="card border border-gray-100 hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Active Tenants</p>
//                 <p className="text-2xl sm:text-3xl font-bold text-green-600">{globalStats.activeTenants || 0}</p>
//               </div>
//               <div className="bg-green-500 p-3 sm:p-4 rounded-xl flex-shrink-0">
//                 <Power className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//               </div>
//             </div>
//           </div>
//           <div className="card border border-gray-100 hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Total Users</p>
//                 <p className="text-2xl sm:text-3xl font-bold text-gray-900">{globalStats.totalUsers || 0}</p>
//               </div>
//               <div className="bg-blue-500 p-3 sm:p-4 rounded-xl flex-shrink-0">
//                 <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//               </div>
//             </div>
//           </div>
//           <div className="card border border-gray-100 hover:shadow-lg transition-shadow">
//             <div className="flex items-center justify-between">
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Total Projects</p>
//                 <p className="text-2xl sm:text-3xl font-bold text-gray-900">{globalStats.totalProjects || 0}</p>
//               </div>
//               <div className="bg-purple-500 p-3 sm:p-4 rounded-xl flex-shrink-0">
//                 <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="card border border-gray-100 shadow-sm">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//               Status
//             </label>
//             <select
//               value={filters.isActive}
//               onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
//               className="input text-sm"
//             >
//               <option value="">All Status</option>
//               <option value="true">Active</option>
//               <option value="false">Inactive</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//               Plan
//             </label>
//             <select
//               value={filters.plan}
//               onChange={(e) => setFilters({ ...filters, plan: e.target.value, page: 1 })}
//               className="input text-sm"
//             >
//               <option value="">All Plans</option>
//               <option value="FREE">Free</option>
//               <option value="BASIC">Basic</option>
//               <option value="PRO">Pro</option>
//               <option value="ENTERPRISE">Enterprise</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {isLoading ? (
//         <div className="card text-center py-12 sm:py-16 border border-gray-100">
//           <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
//           <p className="text-sm sm:text-base text-gray-500">Loading tenants...</p>
//         </div>
//       ) : tenants?.length > 0 ? (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
//             {tenants.map((tenant) => (
//               <div
//                 key={tenant._id}
//                 className="card border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 <div className="flex items-start justify-between mb-3 sm:mb-4">
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">{tenant.name}</h3>
//                     <p className="text-xs sm:text-sm text-gray-600 truncate">@{tenant.subdomain}</p>
//                     {tenant.domain && (
//                       <p className="text-xs text-gray-500 mt-1 truncate">{tenant.domain}</p>
//                     )}
//                   </div>
//                   <span className={`badge ${getPlanColor(tenant.subscription?.plan || 'FREE')} text-xs flex-shrink-0 ml-2`}>
//                     {tenant.subscription?.plan || 'FREE'}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
//                   <div className="flex items-center gap-1">
//                     <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
//                     <span>{tenant.stats?.userCount || 0} users</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <FolderKanban className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
//                     <span>{tenant.stats?.projectCount || 0} projects</span>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
//                   <span
//                     className={`badge text-xs ${
//                       tenant.isActive
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}
//                   >
//                     {tenant.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     Created: {new Date(tenant.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>

//                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
//                   <button
//                     onClick={() => handleEdit(tenant)}
//                     className="flex-1 btn btn-secondary flex items-center justify-center gap-2 text-xs sm:text-sm py-2"
//                   >
//                     <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
//                     <span className="hidden sm:inline">Edit</span>
//                   </button>
//                   {tenant.isActive ? (
//                     <button
//                       onClick={() => handleSuspend(tenant._id)}
//                       className="btn btn-secondary flex items-center justify-center gap-2 px-3 sm:px-4 py-2"
//                       title="Suspend tenant"
//                       aria-label="Suspend tenant"
//                     >
//                       <PowerOff className="w-3 h-3 sm:w-4 sm:h-4" />
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleActivate(tenant._id)}
//                       className="btn btn-primary flex items-center justify-center gap-2 px-3 sm:px-4 py-2"
//                       title="Activate tenant"
//                       aria-label="Activate tenant"
//                     >
//                       <Power className="w-3 h-3 sm:w-4 sm:h-4" />
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleDelete(tenant._id)}
//                     className="btn btn-danger flex items-center justify-center gap-2 px-3 sm:px-4 py-2"
//                     title="Delete tenant"
//                     aria-label="Delete tenant"
//                   >
//                     <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {pagination && pagination.pages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 card border border-gray-100">
//               <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
//                 Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
//                 {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
//                 {pagination.total} tenants
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handlePageChange(pagination.page - 1)}
//                   disabled={pagination.page === 1}
//                   className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4"
//                 >
//                   Previous
//                 </button>
//                 <span className="text-xs sm:text-sm text-gray-600 px-2">
//                   Page {pagination.page} of {pagination.pages}
//                 </span>
//                 <button
//                   onClick={() => handlePageChange(pagination.page + 1)}
//                   disabled={pagination.page === pagination.pages}
//                   className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="card text-center py-12 sm:py-16 border border-gray-100">
//           <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
//           <p className="text-sm sm:text-base text-gray-500 mb-4">No tenants found</p>
//           <button onClick={handleCreate} className="btn btn-primary">
//             Create your first tenant
//           </button>
//         </div>
//       )}

//       <TenantModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setEditingTenant(null);
//         }}
//         tenant={editingTenant}
//         onSuccess={() => {
//           setIsModalOpen(false);
//           dispatch(fetchTenants(filters));
//         }}
//       />
//     </div>
//   );
// };

// export default Tenants;
