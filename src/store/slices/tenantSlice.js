import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tenantAPI } from '../../services/api/tenant.api';
// import toast from 'react-hot-toast';
import { toast } from 'sonner';

// Async thunks
export const fetchTenants = createAsyncThunk(
  'tenants/fetchTenants',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await tenantAPI.getAllTenants(params);
      return {
        tenants: response.data.data || response.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenants');
    }
  }
);

export const fetchTenantById = createAsyncThunk(
  'tenants/fetchTenantById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tenantAPI.getTenantById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenant');
    }
  }
);

export const createTenant = createAsyncThunk(
  'tenants/createTenant',
  async (tenantData, { rejectWithValue }) => {
    try {
      const response = await tenantAPI.createTenant(tenantData);
      toast.success('Tenant created successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create tenant';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateTenant = createAsyncThunk(
  'tenants/updateTenant',
  async ({ id, tenantData }, { rejectWithValue }) => {
    try {
      const response = await tenantAPI.updateTenant(id, tenantData);
      toast.success('Tenant updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update tenant';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteTenant = createAsyncThunk(
  'tenants/deleteTenant',
  async (id, { rejectWithValue }) => {
    try {
      await tenantAPI.deleteTenant(id);
      toast.success('Tenant deleted successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete tenant';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const suspendTenant = createAsyncThunk(
  'tenants/suspendTenant',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tenantAPI.suspendTenant(id);
      toast.success('Tenant suspended successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to suspend tenant';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const activateTenant = createAsyncThunk(
  'tenants/activateTenant',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tenantAPI.activateTenant(id);
      toast.success('Tenant activated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to activate tenant';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchGlobalStats = createAsyncThunk(
  'tenants/fetchGlobalStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tenantAPI.getGlobalStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch global stats');
    }
  }
);

// Initial state
const initialState = {
  tenants: [],
  currentTenant: null,
  globalStats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  isLoading: false,
  error: null,
};

// Slice
const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    clearCurrentTenant: (state) => {
      state.currentTenant = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tenants
      .addCase(fetchTenants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tenants = action.payload.tenants || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch tenant by ID
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.currentTenant = action.payload;
      })
      // Create tenant
      .addCase(createTenant.fulfilled, (state, action) => {
        if (action.payload.tenant) {
          state.tenants.unshift(action.payload.tenant);
        }
      })
      // Update tenant
      .addCase(updateTenant.fulfilled, (state, action) => {
        const index = state.tenants.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tenants[index] = action.payload;
        }
        if (state.currentTenant?._id === action.payload._id) {
          state.currentTenant = action.payload;
        }
      })
      // Delete tenant
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.tenants = state.tenants.filter((t) => t._id !== action.payload);
        if (state.currentTenant?._id === action.payload) {
          state.currentTenant = null;
        }
      })
      // Suspend/Activate tenant
      .addCase(suspendTenant.fulfilled, (state, action) => {
        const index = state.tenants.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tenants[index] = action.payload;
        }
      })
      .addCase(activateTenant.fulfilled, (state, action) => {
        const index = state.tenants.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tenants[index] = action.payload;
        }
      })
      // Global stats
      .addCase(fetchGlobalStats.fulfilled, (state, action) => {
        state.globalStats = action.payload;
      });
  },
});

export const { clearCurrentTenant, clearError } = tenantSlice.actions;
export default tenantSlice.reducer;

