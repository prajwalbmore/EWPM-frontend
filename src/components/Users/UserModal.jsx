import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createUser, updateUser } from '../../store/slices/userSlice';
import { tenantAPI } from '../../services/api/tenant.api';
import { X } from 'lucide-react';
import usePermissions from '../../hooks/usePermissions';

const TENANT_REQUIRED_ROLES = ['EMPLOYEE', 'PROJECT_MANAGER'];

const UserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const dispatch = useDispatch();
  const { isOrgAdmin, isSuperAdmin } = usePermissions();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'EMPLOYEE',
    tenantId: '',
    isActive: true,
  });

  const [tenants, setTenants] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(false);

  /* -------------------- EFFECTS -------------------- */

  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      setFormData({
        email: user.email || '',
        password: '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || 'EMPLOYEE',
        tenantId: user.tenantId || '',
        isActive: user.isActive ?? true,
      });
    } else {
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'EMPLOYEE',
        tenantId: '',
        isActive: true,
      });
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (
      isOpen &&
      isSuperAdmin &&
      TENANT_REQUIRED_ROLES.includes(formData.role)
    ) {
      fetchTenants();
    }
  }, [isOpen, isSuperAdmin, formData.role]);

  /* -------------------- API -------------------- */

  const fetchTenants = async () => {
    setLoadingTenants(true);
    try {
      const res = await tenantAPI.getAllTenants({ limit: 100 });
      setTenants(res.data || []);
    } catch (err) {
      console.error('Error fetching tenants', err);
    } finally {
      setLoadingTenants(false);
    }
  };

  /* -------------------- HANDLERS -------------------- */

  const handleChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
      ...(e.target.name === 'role' &&
        !TENANT_REQUIRED_ROLES.includes(value) && { tenantId: '' }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user && formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    if (
      isSuperAdmin &&
      TENANT_REQUIRED_ROLES.includes(formData.role) &&
      !formData.tenantId
    ) {
      alert('Please select a tenant');
      return;
    }

    const payload = { ...formData };

    if (user && !payload.password) delete payload.password;
    if (!TENANT_REQUIRED_ROLES.includes(payload.role)) delete payload.tenantId;

    if (user) {
      await dispatch(updateUser({ id: user._id, userData: payload }));
    } else {
      await dispatch(createUser(payload));
    }

    onSuccess();
  };

  if (!isOpen) return null;

  /* -------------------- UI -------------------- */

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {user ? 'Edit User' : 'Create User'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="label text-xs sm:text-sm">First Name *</label>
              <input
                className="input text-sm"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label text-xs sm:text-sm">Last Name *</label>
              <input
                className="input text-sm"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label text-xs sm:text-sm">Email *</label>
            <input
              className="input text-sm"
              type="email"
              name="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={!!user}
              required
            />
            {user && (
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label text-xs sm:text-sm">
              Password {!user && '*'}
            </label>
            <input
              className="input text-sm"
              type="password"
              name="password"
              placeholder={
                user
                  ? 'Leave blank to keep current password'
                  : 'Minimum 8 characters'
              }
              value={formData.password}
              onChange={handleChange}
              required={!user}
            />
          </div>

          {/* Role FIRST */}
          <div>
            <label className="label text-xs sm:text-sm">Role *</label>
            <select
              className="input text-sm"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              {isSuperAdmin && (
                <option value="SUPER_ADMIN">Super Admin</option>
              )}
              <option value="EMPLOYEE">Employee</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              {(isOrgAdmin || isSuperAdmin) && (
                <option value="ORG_ADMIN">Org Admin</option>
              )}
            </select>
          </div>

          {/* Tenant AFTER role */}
          {isSuperAdmin && TENANT_REQUIRED_ROLES.includes(formData.role) && (
            <div>
              <label className="label text-xs sm:text-sm">Tenant *</label>
              <select
                className="input text-sm"
                name="tenantId"
                value={formData.tenantId}
                onChange={handleChange}
                required
                disabled={loadingTenants}
              >
                <option value="">Select tenant</option>
                {tenants.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.subdomain})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="label text-xs sm:text-sm">Status</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-xs sm:text-sm">Active</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-sm sm:text-base py-2.5 sm:py-2"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-sm sm:text-base py-2.5 sm:py-2">
              {user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createUser, updateUser } from '../../store/slices/userSlice';
// import { tenantAPI } from '../../services/api/tenant.api';
// import { X } from 'lucide-react';
// import usePermissions from '../../hooks/usePermissions';

// const UserModal = ({ isOpen, onClose, user, onSuccess }) => {
//   const dispatch = useDispatch();
//   const { user: currentUser } = useSelector((state) => state.auth);
//   const { isOrgAdmin, isSuperAdmin } = usePermissions();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     firstName: '',
//     lastName: '',
//     role: 'EMPLOYEE',
//     tenantId: '',
//     isActive: true,
//   });
//   const [tenants, setTenants] = useState([]);
//   const [isLoadingTenants, setIsLoadingTenants] = useState(false);

//   useEffect(() => {
//     // Fetch tenants when modal opens and user is SUPER_ADMIN
//     // Only fetch if not creating a SUPER_ADMIN user
//     if (isOpen && isSuperAdmin && formData.role !== 'SUPER_ADMIN') {
//       fetchTenants();
//     }
//   }, [isOpen, isSuperAdmin, formData.role]);

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         email: user.email || '',
//         password: '', // Don't pre-fill password
//         firstName: user.firstName || '',
//         lastName: user.lastName || '',
//         role: user.role || 'EMPLOYEE',
//         // SUPER_ADMIN users don't have tenantId
//         tenantId: user.role === 'SUPER_ADMIN' ? '' : (user.tenantId || ''),
//         isActive: user.isActive !== undefined ? user.isActive : true,
//       });
//     } else {
//       setFormData({
//         email: '',
//         password: '',
//         firstName: '',
//         lastName: '',
//         role: 'EMPLOYEE',
//         tenantId: '',
//         isActive: true,
//       });
//     }
//   }, [user, isOpen]);

//   const fetchTenants = async () => {
//     setIsLoadingTenants(true);
//     try {
//       const response = await tenantAPI.getAllTenants({ limit: 100 });
//       setTenants(response.data || []);
//     } catch (error) {
//       console.error('Error fetching tenants:', error);
//     } finally {
//       setIsLoadingTenants(false);
//     }
//   };

//   const handleChange = (e) => {
//     const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
//     setFormData({
//       ...formData,
//       [e.target.name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate password for new users
//     if (!user && (!formData.password || formData.password.length < 8)) {
//       alert('Password must be at least 8 characters');
//       return;
//     }

//     // Validate tenant selection for SUPER_ADMIN creating non-SUPER_ADMIN users
//     if (isSuperAdmin && !user && formData.role !== 'SUPER_ADMIN' && !formData.tenantId) {
//       alert('Please select a tenant for this user');
//       return;
//     }

//     const userData = { ...formData };
    
//     // Don't send password if it's empty (for updates)
//     if (user && !userData.password) {
//       delete userData.password;
//     }

//     // SUPER_ADMIN users should not have a tenantId
//     if (formData.role === 'SUPER_ADMIN') {
//       delete userData.tenantId;
//     }

//     if (user) {
//       await dispatch(updateUser({ id: user._id, userData }));
//     } else {
//       await dispatch(createUser(userData));
//     }
//     onSuccess();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {user ? 'Edit User' : 'Create User'}
//           </h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 First Name *
//               </label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//                 className="input"
//                 placeholder="John"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Last Name *
//               </label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//                 className="input"
//                 placeholder="Doe"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email *
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="input"
//               placeholder="user@example.com"
//               disabled={!!user} // Don't allow email change for existing users
//             />
//             {user && (
//               <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password {!user && '*'}
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required={!user}
//               minLength={8}
//               className="input"
//               placeholder={user ? 'Leave blank to keep current password' : 'Min 8 characters'}
//             />
//             {user && (
//               <p className="text-xs text-gray-500 mt-1">
//                 Leave blank to keep current password
//               </p>
//             )}
//           </div>

//           {/* Tenant Selection - Only for SUPER_ADMIN creating non-SUPER_ADMIN users */}
//           {isSuperAdmin && formData.role !== 'SUPER_ADMIN' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Tenant *
//               </label>
//               <select
//                 name="tenantId"
//                 value={formData.tenantId}
//                 onChange={handleChange}
//                 required
//                 className="input"
//                 disabled={isLoadingTenants}
//               >
//                 <option value="">Select a tenant...</option>
//                 {tenants.map((tenant) => (
//                   <option key={tenant._id} value={tenant._id}>
//                     {tenant.name} ({tenant.subdomain})
//                   </option>
//                 ))}
//               </select>
//               {!formData.tenantId && (
//                 <p className="text-xs text-red-500 mt-1">
//                   Please select a tenant for this user
//                 </p>
//               )}
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 required
//                 className="input"
//                 disabled={!isOrgAdmin && formData.role === 'SUPER_ADMIN'}
//               >
//                 {isSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
//                 <option value="EMPLOYEE">Employee</option>
//                 <option value="PROJECT_MANAGER">Project Manager</option>
//                 {(isOrgAdmin || isSuperAdmin) && <option value="ORG_ADMIN">Org Admin</option>}
//               </select>
//               {!isOrgAdmin && formData.role === 'SUPER_ADMIN' && (
//                 <p className="text-xs text-red-500 mt-1">
//                   You cannot assign SUPER_ADMIN role
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//               <div className="flex items-center gap-2 mt-2">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   checked={formData.isActive}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                 />
//                 <span className="text-sm text-gray-700">Active</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-end gap-4 pt-4 border-t">
//             <button type="button" onClick={onClose} className="btn btn-secondary">
//               Cancel
//             </button>
//             <button type="submit" className="btn btn-primary">
//               {user ? 'Update' : 'Create'} User
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserModal;

