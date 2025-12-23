import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initializeSocket, disconnectSocket } from '../services/socket';

const SocketInitializer = () => {
  const { user, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && accessToken) {
      // Initialize socket when user is logged in
      console.log('🔌 Initializing socket for user:', user._id, 'tenant:', user.tenantId);
      const socket = initializeSocket(accessToken, user._id, user.tenantId);
      
      // Wait for connection before joining rooms
      socket.on('connect', () => {
        console.log('✅ Socket connected successfully');
        console.log('User ID:', user._id);
        console.log('Tenant ID:', user.tenantId);
        console.log('Socket ID:', socket.id);
      });
      
      // Log connection status
      console.log('Socket connection status:', socket.connected ? 'Connected' : 'Not connected');
      
      return () => {
        // Cleanup on unmount or when user/accessToken changes
        console.log('🧹 Cleaning up socket');
        disconnectSocket();
      };
    } else {
      // Disconnect socket when user logs out
      console.log('👋 User logged out, disconnecting socket');
      disconnectSocket();
    }
  }, [user, accessToken]);

  return null;
};

export default SocketInitializer;
