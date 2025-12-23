import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { permissionAPI } from '../../services/api/permission.api';
import { toast } from 'sonner';

// Async thunks
export const fetchManageableUsers = createAsyncThunk(
  'permissions/fetchManageableUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await permissionAPI.getManageableUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch manageable users');
    }
  }
);

export const fetchUserPermissions = createAsyncThunk(
  'permissions/fetchUserPermissions',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await permissionAPI.getUserPermissions(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user permissions');
    }
  }
);

export const updateUserPermissions = createAsyncThunk(
  'permissions/updateUserPermissions',
  async ({ userId, permissions }, { rejectWithValue }) => {
    try {
      const response = await permissionAPI.updateUserPermissions(userId, permissions);
      toast.success('Permissions updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update permissions';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const resetUserPermissions = createAsyncThunk(
  'permissions/resetUserPermissions',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await permissionAPI.resetUserPermissions(userId);
      toast.success('Permissions reset to defaults successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset permissions';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  manageableUsers: [],
  currentUserPermissions: null,
  isLoading: false,
  error: null,
};

// Slice
const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearCurrentUserPermissions: (state) => {
      state.currentUserPermissions = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updatePermissionsFromSocket: (state, action) => {
      const { userId, permissions } = action.payload;
      // Update in manageable users
      const index = state.manageableUsers.findIndex(
        (u) => u.userId.toString() === userId.toString()
      );
      if (index !== -1) {
        state.manageableUsers[index].permissions = permissions;
      }
      // Update current user permissions if it's the same user
      if (state.currentUserPermissions?.userId?.toString() === userId.toString()) {
        state.currentUserPermissions.permissions = permissions;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch manageable users
      .addCase(fetchManageableUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchManageableUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.manageableUsers = action.payload;
      })
      .addCase(fetchManageableUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch user permissions
      .addCase(fetchUserPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUserPermissions = action.payload;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update user permissions
      .addCase(updateUserPermissions.fulfilled, (state, action) => {
        const updated = action.payload;
        // Update in manageable users
        const index = state.manageableUsers.findIndex(
          (u) => u.userId.toString() === updated.userId.toString()
        );
        if (index !== -1) {
          state.manageableUsers[index].permissions = updated.permissions;
        }
        // Update current user permissions if it's the same user
        if (state.currentUserPermissions?.userId?.toString() === updated.userId.toString()) {
          state.currentUserPermissions = updated;
        }
      })
      // Reset user permissions
      .addCase(resetUserPermissions.fulfilled, (state, action) => {
        const updated = action.payload;
        // Update in manageable users
        const index = state.manageableUsers.findIndex(
          (u) => u.userId.toString() === updated.userId.toString()
        );
        if (index !== -1) {
          state.manageableUsers[index].permissions = updated.permissions;
        }
        // Update current user permissions if it's the same user
        if (state.currentUserPermissions?.userId?.toString() === updated.userId.toString()) {
          state.currentUserPermissions = updated;
        }
      });
  },
});

export const { clearCurrentUserPermissions, clearError, updatePermissionsFromSocket } = permissionSlice.actions;
export default permissionSlice.reducer;
