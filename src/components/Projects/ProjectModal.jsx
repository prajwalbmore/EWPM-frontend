import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, updateProject } from '../../store/slices/projectSlice';
import { userAPI } from '../../services/api/user.api';
import { X, UserPlus } from 'lucide-react';
import usePermissions from '../../hooks/usePermissions';

const ProjectModal = ({ isOpen, onClose, project, onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isOrgAdmin, isProjectManager } = usePermissions();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    startDate: '',
    endDate: '',
    members: [],
  });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedMemberRole, setSelectedMemberRole] = useState('MEMBER');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'PLANNING',
        priority: project.priority || 'MEDIUM',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        members: project.members ? project.members.map(m => ({
          userId: m.userId?._id || m.userId,
          role: m.role || 'MEMBER'
        })) : [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'PLANNING',
        priority: 'MEDIUM',
        startDate: '',
        endDate: '',
        members: [],
      });
    }
    setSelectedMemberId('');
    setSelectedMemberRole('MEMBER');
  }, [project, isOpen]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await userAPI.getUsers({ limit: 100 });
      setAvailableUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMember = () => {
    if (!selectedMemberId) return;
    
    // Check if user is already added
    if (formData.members.some(m => m.userId === selectedMemberId)) {
      alert('User is already added to the project');
      return;
    }

    const newMember = {
      userId: selectedMemberId,
      role: selectedMemberRole
    };

    setFormData({
      ...formData,
      members: [...formData.members, newMember]
    });

    setSelectedMemberId('');
    setSelectedMemberRole('MEMBER');
  };

  const handleRemoveMember = (userId) => {
    setFormData({
      ...formData,
      members: formData.members.filter(m => m.userId !== userId)
    });
  };

  const handleMemberRoleChange = (userId, newRole) => {
    setFormData({
      ...formData,
      members: formData.members.map(m =>
        m.userId === userId ? { ...m, role: newRole } : m
      )
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (project) {
      await dispatch(updateProject({ id: project._id, projectData: formData }));
    } else {
      await dispatch(createProject(formData));
    }
    onSuccess();
  };

  const getMemberName = (userId) => {
    const user = availableUsers.find(u => u._id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {project ? 'Edit Project' : 'Create Project'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="label">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input text-sm"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="label">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input text-sm"
              placeholder="Enter project description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="input text-sm"
                disabled={isProjectManager && project && project.managerId?._id !== user?.id && project.ownerId?._id !== user?.id}
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="label">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="input text-sm">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input text-sm"
              />
            </div>

            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input text-sm"
              />
            </div>
          </div>

          {/* Project Members */}
          <div>
            <label className="label">
              Project Members
            </label>
            <div className="space-y-3">
              {/* Add Member Section */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="input flex-1 text-sm"
                  disabled={isLoadingUsers}
                >
                  <option value="">Select a user...</option>
                  {availableUsers
                    .filter(u => !formData.members.some(m => m.userId === u._id))
                    .map(user => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                </select>
                <select
                  value={selectedMemberRole}
                  onChange={(e) => setSelectedMemberRole(e.target.value)}
                  className="input text-sm sm:w-[150px]"
                >
                  <option value="MEMBER">Member</option>
                  <option value="LEAD">Lead</option>
                  <option value="VIEWER">Viewer</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!selectedMemberId}
                  className="btn btn-secondary flex items-center justify-center gap-2 text-sm py-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {/* Members List */}
              {formData.members.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                  {formData.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 text-sm font-medium">
                            {getMemberName(member.userId).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {getMemberName(member.userId)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={member.role}
                          onChange={(e) => handleMemberRoleChange(member.userId, e.target.value)}
                          className="input text-sm"
                          style={{ width: '120px' }}
                        >
                          <option value="MEMBER">Member</option>
                          <option value="LEAD">Lead</option>
                          <option value="VIEWER">Viewer</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.userId)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove member"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary text-sm sm:text-base py-2.5 sm:py-2">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-sm sm:text-base py-2.5 sm:py-2">
              {project ? 'Update' : 'Create'} Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

