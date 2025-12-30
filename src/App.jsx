import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
// import { Toaster } from 'react-hot-toast';
import { Toaster } from "sonner";
import { store } from "./store/store";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Layout from "./components/Layout/Layout";
import SocketInitializer from "./components/SocketInitializer";
import PermissionUpdateListener from "./components/PermissionUpdateListener";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Tenants from "./pages/Tenants";
import Permissions from "./pages/Permissions";
import Profile from "./pages/Profile";

function App() {
  return (
    <Provider store={store}>
      <SocketInitializer />
      <PermissionUpdateListener />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />

            {/* Tenant work routes - SUPER_ADMIN cannot access */}
            <Route
              path="projects"
              element={
                <RoleProtectedRoute requireTenantWork={true}>
                  <Projects />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="projects/:id"
              element={
                <RoleProtectedRoute requireTenantWork={true}>
                  <ProjectDetails />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="tasks"
              element={
                <RoleProtectedRoute requireTenantWork={true}>
                  <Tasks />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="tasks/:id"
              element={
                <RoleProtectedRoute requireTenantWork={true}>
                  <TaskDetails />
                </RoleProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="users"
              element={
                <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
                  <Users />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <RoleProtectedRoute
                  allowedRoles={["ORG_ADMIN", "PROJECT_MANAGER"]}
                >
                  <Reports />
                </RoleProtectedRoute>
              }
            />

            {/* SUPER_ADMIN only routes */}
            <Route
              path="tenants"
              element={
                <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                  <Tenants />
                </RoleProtectedRoute>
              }
            />

            {/* Permission Management - SUPER_ADMIN and ORG_ADMIN */}
            <Route
              path="permissions"
              element={
                <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "ORG_ADMIN"]}>
                  <Permissions />
                </RoleProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <Toaster
          position="top-center"
          richColors
          expand={true}
          duration={5000}
        />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
