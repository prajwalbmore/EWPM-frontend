import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../services/socket';
import { updatePermissionsFromSocket } from '../store/slices/permissionSlice';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

const PermissionUpdateListener = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) {
      console.warn('Socket not initialized for permission updates');
      return;
    }

    // Wait for socket to be connected
    const setupListener = () => {
      if (!socket.connected) {
        socket.once('connect', setupListener);
        return;
      }

      console.log('✅ Setting up permission update listener for user:', user._id);

      // Listen for permission updates for this user
      const handlePermissionUpdate = (data) => {
        console.log('🔔 Permission update received:', data);
        
        const userId = user._id.toString();
        const updatedUserId = data.userId?.toString();
        
        // Only process if it's for this user
        if (updatedUserId === userId) {
          // Update permissions in Redux store
          dispatch(updatePermissionsFromSocket({
            userId: updatedUserId,
            permissions: data.permissions
          }));

          // Show notification
          const updatedByName = data.updatedBy?.name || 'Administrator';
          toast.info('Permissions Updated', {
            description: `Your permissions have been updated by ${updatedByName}. Please refresh the page if you notice any access issues.`,
            duration: 8000,
            icon: <Shield className="w-5 h-5" />,
          });

          // Optionally reload the page to ensure UI reflects new permissions
          // Uncomment if you want automatic page reload
          // setTimeout(() => {
          //   window.location.reload();
          // }, 2000);
        }
      };

      // Listen for admin notifications (for admins viewing permission changes)
      const handleAdminPermissionUpdate = (data) => {
        console.log('🔔 Admin permission update notification:', data);
        
        // Show notification to admins
        const userName = data.user ? `${data.user.firstName} ${data.user.lastName}` : 'User';
        const updatedByName = data.updatedBy?.name || 'Administrator';
        
        toast.success('Permission Updated', {
          description: `${updatedByName} updated permissions for ${userName}`,
          duration: 5000,
          icon: <Shield className="w-5 h-5" />,
        });
      };

      // Register listeners
      socket.on('permission:updated', handlePermissionUpdate);
      socket.on('permission:updated:admin', handleAdminPermissionUpdate);

      console.log('✅ Permission update listeners registered');

      return () => {
        socket.off('permission:updated', handlePermissionUpdate);
        socket.off('permission:updated:admin', handleAdminPermissionUpdate);
      };
    };

    setupListener();

    // Also set up when socket connects
    if (socket) {
      socket.on('connect', setupListener);
    }

    return () => {
      if (socket) {
        socket.off('permission:updated');
        socket.off('permission:updated:admin');
        socket.off('connect', setupListener);
      }
    };
  }, [user, dispatch]);

  return null; // This component doesn't render anything
};

export default PermissionUpdateListener;

