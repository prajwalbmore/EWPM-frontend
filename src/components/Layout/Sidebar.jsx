import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Building2,
  Shield,
  X,
} from "lucide-react";
import usePermissions from "../../hooks/usePermissions";

const Sidebar = ({ isOpen, onClose }) => {
  const {
    canManageTenants,
    canViewUsers,
    canViewReports,
    canDoTenantWork,
    isSuperAdmin,
    isOrgAdmin,
  } = usePermissions();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard", show: true },
    {
      path: "/projects",
      icon: FolderKanban,
      label: "Projects",
      show: canDoTenantWork,
    },
    {
      path: "/tasks",
      icon: CheckSquare,
      label: "Tasks",
      show: canDoTenantWork,
    },
    {
      path: "/users",
      icon: Users,
      label: "Users",
      show: canViewUsers,
    },
    {
      path: "/reports",
      icon: BarChart3,
      label: "Reports",
      show: canViewReports,
    },
    {
      path: "/tenants",
      icon: Building2,
      label: "Tenants",
      show: canManageTenants,
    },
    {
      path: "/permissions",
      icon: Shield,
      label: "Permissions",
      show: isSuperAdmin || isOrgAdmin,
    },
  ].filter((item) => item.show);

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-200/50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:top-16 md:z-30 z-50`}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-3 sm:p-4 overflow-y-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-semibold shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isOpen ? "" : ""}`} />
                    <span className="text-sm sm:text-base">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

// import { NavLink } from 'react-router-dom';
// import { LayoutDashboard, FolderKanban, CheckSquare, Users, BarChart3, Building2 } from 'lucide-react';
// import usePermissions from '../../hooks/usePermissions';

// const Sidebar = () => {
//   const {
//     canManageTenants,
//     canViewUsers,
//     canViewReports,
//     canDoTenantWork,
//   } = usePermissions();

//   const navItems = [
//     { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', show: true },
//     { 
//       path: '/projects', 
//       icon: FolderKanban, 
//       label: 'Projects', 
//       show: canDoTenantWork // SUPER_ADMIN cannot access
//     },
//     { 
//       path: '/tasks', 
//       icon: CheckSquare, 
//       label: 'Tasks', 
//       show: canDoTenantWork // SUPER_ADMIN cannot access
//     },
//     { 
//       path: '/users', 
//       icon: Users, 
//       label: 'Users', 
//       show: canViewUsers 
//     },
//     { 
//       path: '/reports', 
//       icon: BarChart3, 
//       label: 'Reports', 
//       show: canViewReports 
//     },
//     { 
//       path: '/tenants', 
//       icon: Building2, 
//       label: 'Tenants', 
//       show: canManageTenants 
//     },
//   ].filter(item => item.show);

//   return (
//     <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg z-30 border-r border-gray-200">
//       <nav className="p-4">
//         <ul className="space-y-2">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <li key={item.path}>
//                 <NavLink
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                       isActive
//                         ? 'bg-primary-50 text-primary-600 font-medium'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }`
//                   }
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{item.label}</span>
//                 </NavLink>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;

