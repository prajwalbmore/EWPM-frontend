import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../../store/slices/taskSlice';
import { fetchUsers } from '../../store/slices/userSlice';
import { X } from 'lucide-react';
import usePermissions from '../../hooks/usePermissions';

const TaskModal = ({ isOpen, onClose, task, projects, onSuccess }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { canAssignTasks, isEmployee } = usePermissions();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    type: 'STORY',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeId: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch users when modal opens
      dispatch(fetchUsers({ limit: 100 }));
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        projectId: task.projectId?._id || task.projectId || '',
        type: task.type || 'STORY',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        assigneeId: task.assigneeId?._id || task.assigneeId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        projectId: projects?.[0]?._id || '',
        type: 'STORY',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: '',
      });
    }
  }, [task, projects, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      // Set assigneeId to null if empty string
      assigneeId: formData.assigneeId || null,
    };
    
    if (task) {
      await dispatch(updateTask({ id: task._id, taskData }));
    } else {
      await dispatch(createTask(taskData));
    }
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto custom-scrollbar-dark">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/5">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-white/60 hover:text-white">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs sm:text-sm text-white/80 mb-1 block">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm text-white/80 mb-1 block">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs sm:text-sm text-white/80 mb-1 block">Project *</label>
              {isEmployee && task ? (
                <div className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50 cursor-not-allowed">
                  {task.projectId?.name || projects?.find(p => p._id === formData.projectId)?.name || 'N/A'}
                </div>
              ) : (
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
                  disabled={isEmployee && !!task}
                >
                  <option value="">Select project</option>
                  {projects?.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}
              {isEmployee && task && (
                <p className="text-xs text-white/50 mt-1">
                  You cannot change the project
                </p>
              )}
            </div>

            <div>
              <label className="text-xs sm:text-sm text-white/80 mb-1 block">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20">
                <option value="EPIC">Epic</option>
                <option value="STORY">Story</option>
                <option value="SUBTASK">Subtask</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs sm:text-sm text-white/80 mb-1 block">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20">
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <div>
              <label className="text-xs sm:text-sm text-white/80 mb-1 block">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {canAssignTasks && (
            <div>
              <label className="text-xs sm:text-sm text-white/80 mb-1 block">Assign To</label>
              <select
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Unassigned</option>
                {users?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
              <p className="text-xs text-white/50 mt-1">
                Select a user to assign this task to
              </p>
            </div>
          )}
          {isEmployee && task && (
            <div>
              <label className="text-xs sm:text-sm text-white/80 mb-1 block">Assigned To</label>
              <div className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50">
                {task.assigneeId ? (
                  `${task.assigneeId.firstName} ${task.assigneeId.lastName}`
                ) : (
                  'Unassigned'
                )}
              </div>
              <p className="text-xs text-white/50 mt-1">
                You cannot reassign tasks
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white">
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-400">
              {task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

