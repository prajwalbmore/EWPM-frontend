import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchUserPermissions,
  updateUserPermissions,
  resetUserPermissions,
} from "../../store/slices/permissionSlice";
import {
  Shield,
  Save,
  RotateCcw,
  User,
  Mail,
  X,
} from "lucide-react";
import usePermissions from "../../hooks/usePermissions";
import { toast } from "sonner";

const PermissionModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const { isSuperAdmin } = usePermissions();

  const [permissions, setPermissions] = useState(null);
  const [editedPermissions, setEditedPermissions] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) loadUserPermissions();
  }, [isOpen, user]);

  const loadUserPermissions = async () => {
    if (!user?._id) return;
    setIsLoading(true);
    try {
      const res = await dispatch(fetchUserPermissions(user._id)).unwrap();
      setPermissions(res.permissions);
      setEditedPermissions(JSON.parse(JSON.stringify(res.permissions)));
      setHasChanges(false);
    } catch {
      toast.error("Failed to load permissions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (permissions && editedPermissions) {
      setHasChanges(
        JSON.stringify(permissions) !== JSON.stringify(editedPermissions)
      );
    }
  }, [permissions, editedPermissions]);

  const handlePermissionChange = (module, action, value) => {
    setEditedPermissions((prev) => ({
      ...prev,
      [module]: {
        ...(prev?.[module] || {}),
        [action]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!user?._id) return;
    setIsSaving(true);
    try {
      await dispatch(
        updateUserPermissions({
          userId: user._id,
          permissions: editedPermissions,
        })
      ).unwrap();
      await loadUserPermissions();
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Reset permissions to role defaults? This cannot be undone."
      )
    )
      return;

    await dispatch(resetUserPermissions(user._id)).unwrap();
    await loadUserPermissions();
    toast.success("Permissions reset");
  };

  const permissionModules = [
    { key: "manageTenants", actions: ["create", "read", "update", "delete"] },
    { key: "manageUsers", actions: ["create", "read", "update", "delete"] },
    { key: "manageProjects", actions: ["create", "read", "update", "delete"] },
    {
      key: "manageTasks",
      actions: ["create", "read", "update", "delete", "assign"],
    },
    { key: "viewReports", actions: ["read"] },
    { key: "viewAuditLogs", actions: ["read"] },
  ];

  const displayModules = isSuperAdmin
    ? permissionModules
    : permissionModules.filter((m) => m.key !== "manageTenants");

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-500/15 ring-1 ring-primary-500/20">
              <User className="h-6 w-6 text-primary-200" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Manage Permissions
              </h2>
              <div className="mt-1 flex flex-wrap gap-4 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-6 custom-scrollbar-dark">
          {isLoading ? (
            <div className="py-16 text-center text-white/60">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary-400" />
              Loading permissions...
            </div>
          ) : (
            displayModules.map((module) => (
              <div
                key={module.key}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <h3 className="mb-4 text-sm font-semibold text-white">
                  {module.key}
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {module.actions.map((action) => {
                    const checked =
                      editedPermissions?.[module.key]?.[action] || false;

                    return (
                      <label
                        key={action}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            handlePermissionChange(
                              module.key,
                              action,
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-white/20 bg-white/10 text-primary-500 focus:ring-primary-500/30"
                        />
                        {action}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Defaults
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-400 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
// import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { fetchUserPermissions, updateUserPermissions, resetUserPermissions } from '../../store/slices/permissionSlice';
// import { Shield, Save, RotateCcw, User, Mail, Building2, X } from 'lucide-react';
// import usePermissions from '../../hooks/usePermissions';
// import { toast } from 'sonner';

// const PermissionModal = ({ isOpen, onClose, user }) => {
//   const dispatch = useDispatch();
//   const { isSuperAdmin, isOrgAdmin } = usePermissions();
//   const [permissions, setPermissions] = useState(null);
//   const [editedPermissions, setEditedPermissions] = useState(null);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (isOpen && user) {
//       loadUserPermissions();
//     }
//   }, [isOpen, user]);

//   const loadUserPermissions = async () => {
//     if (!user?._id) return;
    
//     setIsLoading(true);
//     try {
//       const result = await dispatch(fetchUserPermissions(user._id)).unwrap();
//       setPermissions(result.permissions);
//       setEditedPermissions(JSON.parse(JSON.stringify(result.permissions)));
//       setHasChanges(false);
//     } catch (error) {
//       toast.error('Failed to load user permissions');
//       console.error('Error loading permissions:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (permissions && editedPermissions) {
//       const hasChangesValue = JSON.stringify(permissions) !== JSON.stringify(editedPermissions);
//       setHasChanges(hasChangesValue);
//     }
//   }, [permissions, editedPermissions]);

//   const handlePermissionChange = (module, action, value) => {
//     setEditedPermissions((prev) => {
//       const updated = JSON.parse(JSON.stringify(prev));
//       if (!updated[module]) updated[module] = {};
//       updated[module][action] = value;
//       return updated;
//     });
//   };

//   const handleSave = async () => {
//     if (!user?._id || !editedPermissions) return;
    
//     setIsSaving(true);
//     try {
//       await dispatch(
//         updateUserPermissions({
//           userId: user._id,
//           permissions: editedPermissions,
//         })
//       ).unwrap();
//       await loadUserPermissions();
//       toast.success('Permissions updated successfully!');
//     } catch (error) {
//       console.error('Error updating permissions:', error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleReset = async () => {
//     if (!user?._id) return;
    
//     if (window.confirm('Are you sure you want to reset this user\'s permissions to role defaults? This action cannot be undone.')) {
//       try {
//         await dispatch(resetUserPermissions(user._id)).unwrap();
//         await loadUserPermissions();
//         toast.success('Permissions reset to defaults successfully!');
//       } catch (error) {
//         console.error('Error resetting permissions:', error);
//       }
//     }
//   };

//   const getRoleLabel = (role) => {
//     const labels = {
//       SUPER_ADMIN: 'Super Admin',
//       ORG_ADMIN: 'Organization Admin',
//       PROJECT_MANAGER: 'Project Manager',
//       EMPLOYEE: 'Employee',
//     };
//     return labels[role] || role;
//   };

//   const getModuleLabel = (module) => {
//     const labels = {
//       manageTenants: 'Tenant Management',
//       manageUsers: 'User Management',
//       manageProjects: 'Project Management',
//       manageTasks: 'Task Management',
//       viewReports: 'Reports',
//       viewAuditLogs: 'Audit Logs',
//     };
//     return labels[module] || module;
//   };

//   const getActionLabel = (action) => {
//     const labels = {
//       create: 'Create',
//       read: 'Read',
//       update: 'Update',
//       delete: 'Delete',
//       assign: 'Assign',
//     };
//     return labels[action] || action;
//   };

//   const permissionModules = [
//     { key: 'manageTenants', actions: ['create', 'read', 'update', 'delete'] },
//     { key: 'manageUsers', actions: ['create', 'read', 'update', 'delete'] },
//     { key: 'manageProjects', actions: ['create', 'read', 'update', 'delete'] },
//     { key: 'manageTasks', actions: ['create', 'read', 'update', 'delete', 'assign'] },
//     { key: 'viewReports', actions: ['read'] },
//     { key: 'viewAuditLogs', actions: ['read'] },
//   ];

//   // Filter modules based on user role
//   const getFilteredModules = (userRole) => {
//     if (userRole === 'EMPLOYEE') {
//       return permissionModules.filter((m) => 
//         m.key === 'manageProjects' || m.key === 'manageTasks'
//       );
//     }
//     return permissionModules;
//   };

//   if (!isOpen || !user) return null;

//   const filteredModules = getFilteredModules(user.role);
//   const displayModules = isSuperAdmin 
//     ? filteredModules 
//     : filteredModules.filter((m) => m.key !== 'manageTenants');

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
//       <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
//           <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
//             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
//               <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
//             </div>
//             <div className="min-w-0 flex-1">
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
//                 Manage Permissions
//               </h2>
//               <div className="flex items-center gap-4 mt-1">
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <span className="font-medium">{user.firstName} {user.lastName}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Mail className="w-4 h-4" />
//                   {user.email}
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Shield className="w-4 h-4" />
//                   {getRoleLabel(user.role)}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {isLoading ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
//               <p className="text-gray-500">Loading permissions...</p>
//             </div>
//           ) : editedPermissions ? (
//             <div className="space-y-6">
//               {displayModules.map((module) => (
//                 <div key={module.key} className="border border-gray-200 rounded-lg p-4">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     {getModuleLabel(module.key)}
//                   </h3>
//                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//                     {module.actions.map((action) => {
//                       const isChecked = editedPermissions[module.key]?.[action] || false;
//                       return (
//                         <label
//                           key={action}
//                           className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={isChecked}
//                             onChange={(e) =>
//                               handlePermissionChange(module.key, action, e.target.checked)
//                             }
//                             className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                           />
//                           <span className="text-sm font-medium text-gray-700">
//                             {getActionLabel(action)}
//                           </span>
//                         </label>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">Failed to load permissions</p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between p-6 border-t sticky bottom-0 bg-white">
//           <button
//             onClick={handleReset}
//             className="btn btn-secondary flex items-center gap-2"
//             title="Reset to role defaults"
//             disabled={isSaving || isLoading}
//           >
//             <RotateCcw className="w-4 h-4" />
//             Reset to Defaults
//           </button>
//           <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
//             <button
//               onClick={onClose}
//               className="btn btn-secondary text-sm sm:text-base py-2.5 sm:py-2"
//               disabled={isSaving}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={!hasChanges || isSaving || isLoading}
//               className="btn btn-primary flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSaving ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>Saving...</span>
//                 </>
//               ) : (
//                 <>
//                   <Save className="w-4 h-4" />
//                   <span className="hidden sm:inline">Save Changes</span>
//                   <span className="sm:hidden">Save</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PermissionModal;

