import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import userReducer from './slices/userSlice';
import tenantReducer from './slices/tenantSlice';
import auditReducer from './slices/auditSlice';
import permissionReducer from './slices/permissionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    users: userReducer,
    tenants: tenantReducer,
    audit: auditReducer,
    permissions: permissionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
