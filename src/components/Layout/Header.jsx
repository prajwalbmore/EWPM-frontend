import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import NotificationCenter from "../Notifications/NotificationCenter";

const Header = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  /* -------------------- Handlers -------------------- */
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  /* -------------------- Derived Data -------------------- */
  const userInitials = `${user?.firstName?.[0] ?? ""}${
    user?.lastName?.[0] ?? ""
  }`;
  const userRole = user?.role?.replace(/_/g, " ") ?? "";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-xl">
      <div className="flex h-full items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
        {/* ---------------- Left ---------------- */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sidebar toggle (mobile) */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition active:scale-95"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Brand */}
          <img
            src="/logo.svg"
            alt="EWPM Logo"
            className="h-12 w-auto select-none rounded-md"
            draggable={false}
          />
        </div>

        {/* ---------------- Right ---------------- */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <NotificationCenter />

          {/* User Info */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs shadow-md">
              {userInitials || "U"}
            </div>

            <div className="hidden lg:block leading-tight">
              <span className="block text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </span>
              {userRole && (
                <span className="text-[11px] text-white/40 capitalize">
                  ({userRole})
                </span>
              )}
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 md:px-4 py-2
              text-xs sm:text-sm text-white/70 hover:text-white hover:bg-white/10
              transition-all duration-200 active:scale-95"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
