import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (token, userId, tenantId) => {
  // If socket exists and is connected, just update rooms if needed
  if (socket?.connected) {
    if (userId) {
      const userIdStr = userId.toString ? userId.toString() : String(userId);
      socket.emit('join:user', userIdStr);
      console.log('Re-joined user room:', userIdStr);
    }
    if (tenantId && tenantId !== 'all') {
      const tenantIdStr = tenantId.toString ? tenantId.toString() : String(tenantId);
      socket.emit('join:tenant', tenantIdStr);
      console.log('Re-joined tenant room:', tenantIdStr);
    }
    return socket;
  }

  // Disconnect existing socket if not connected
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  // Socket.IO connects to the base server URL (not /api)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const serverUrl = apiBaseUrl.replace('/api', '') || import.meta.env.VITE_API_URL || 'http://localhost:5000';
  console.log('🔌 Initializing socket connection to:', serverUrl);

  socket = io(serverUrl, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  // Join user room for personal notifications
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    if (userId) {
      // Ensure userId is a string - handle both _id and id fields
      let userIdStr;
      if (typeof userId === 'object' && userId._id) {
        userIdStr = userId._id.toString();
      } else if (typeof userId === 'object' && userId.id) {
        userIdStr = userId.id.toString();
      } else {
        userIdStr = userId.toString ? userId.toString() : String(userId);
      }
      socket.emit('join:user', userIdStr);
      console.log('✅ Emitted join:user with:', userIdStr, 'Room will be: user:' + userIdStr);
    }
    if (tenantId && tenantId !== 'all') {
      // Ensure tenantId is a string
      let tenantIdStr;
      if (typeof tenantId === 'object' && tenantId._id) {
        tenantIdStr = tenantId._id.toString();
      } else if (typeof tenantId === 'object' && tenantId.id) {
        tenantIdStr = tenantId.id.toString();
      } else {
        tenantIdStr = tenantId.toString ? tenantId.toString() : String(tenantId);
      }
      socket.emit('join:tenant', tenantIdStr);
      console.log('✅ Emitted join:tenant with:', tenantIdStr);
    }
    
    // Log all rooms this socket is in (for debugging)
    setTimeout(() => {
      console.log('Socket rooms after join:', Array.from(socket.rooms));
    }, 500);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
  });

  // Listen to all events for debugging
  socket.onAny((eventName, ...args) => {
    console.log('📡 Socket event:', eventName, args);
  });

  // If already connected, join rooms immediately
  if (socket.connected) {
    if (userId) {
      let userIdStr;
      if (typeof userId === 'object' && userId._id) {
        userIdStr = userId._id.toString();
      } else if (typeof userId === 'object' && userId.id) {
        userIdStr = userId.id.toString();
      } else {
        userIdStr = userId.toString ? userId.toString() : String(userId);
      }
      socket.emit('join:user', userIdStr);
      console.log('✅ Immediately joined user room:', userIdStr);
    }
    if (tenantId && tenantId !== 'all') {
      let tenantIdStr;
      if (typeof tenantId === 'object' && tenantId._id) {
        tenantIdStr = tenantId._id.toString();
      } else if (typeof tenantId === 'object' && tenantId.id) {
        tenantIdStr = tenantId.id.toString();
      } else {
        tenantIdStr = tenantId.toString ? tenantId.toString() : String(tenantId);
      }
      socket.emit('join:tenant', tenantIdStr);
      console.log('✅ Immediately joined tenant room:', tenantIdStr);
    }
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

