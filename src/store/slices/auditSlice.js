import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auditAPI } from '../../services/api/audit.api';

// Async thunks
export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchAuditLogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await auditAPI.getAuditLogs(params);
      return {
        logs: response.data.data || response.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit logs');
    }
  }
);

export const fetchAuditLogById = createAsyncThunk(
  'audit/fetchAuditLogById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await auditAPI.getAuditLogById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit log');
    }
  }
);

// Initial state
const initialState = {
  logs: [],
  currentLog: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  },
  isLoading: false,
  error: null,
};

// Slice
const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    clearCurrentLog: (state) => {
      state.currentLog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch audit logs
      .addCase(fetchAuditLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logs = action.payload.logs || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch audit log by ID
      .addCase(fetchAuditLogById.fulfilled, (state, action) => {
        state.currentLog = action.payload;
      });
  },
});

export const { clearCurrentLog, clearError } = auditSlice.actions;
export default auditSlice.reducer;

