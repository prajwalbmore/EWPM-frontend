import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Menu } from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import NotificationCenter from "../Notifications/NotificationCenter";

const Header = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm shadow-md z-40 border-b border-gray-200/50">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sidebar toggle (mobile only) */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            EWPM
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <NotificationCenter />
          
          <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="hidden lg:block">
                <span className="font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({user?.role?.replace(/_/g, ' ')})
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-600
              hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { LogOut, User } from 'lucide-react';
// import { logout } from '../../store/slices/authSlice';

// const Header = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-40 border-b border-gray-200">
//       <div className="flex items-center justify-between h-full px-6">
//         <div className="flex items-center">
//           <h1 className="text-xl font-bold text-primary-600">EWPM</h1>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <User className="w-4 h-4" />
//             <span>{user?.firstName} {user?.lastName}</span>
//             <span className="text-xs text-gray-400">({user?.role})</span>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

