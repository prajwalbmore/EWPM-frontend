import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from '../store/slices/taskSlice';
import { fetchProjects } from '../store/slices/projectSlice';
import { fetchUsers } from '../store/slices/userSlice';
import { Plus, Trash2, CheckSquare, Edit, User } from 'lucide-react';
import TaskModal from '../components/Tasks/TaskModal';
import usePermissions from '../hooks/usePermissions';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);
  const {
    canCreateTasks,
    canDeleteTasks,
    canEditTask,
    canAssignTasks,
    isEmployee,
  } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: '', projectId: '', assigneeId: '' });

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers({ limit: 100 }));
    dispatch(fetchTasks(filter));
  }, [dispatch, filter]);

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
    dispatch(fetchTasks(filter));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(id));
      dispatch(fetchTasks(filter));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      TODO: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      IN_REVIEW: 'bg-yellow-100 text-yellow-800',
      DONE: 'bg-green-100 text-green-800',
      BLOCKED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.TODO;
  };

  const filteredTasks = tasks?.filter((task) => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.projectId && task.projectId?._id !== filter.projectId) return false;
    if (filter.assigneeId === 'unassigned') {
      if (task.assigneeId) return false;
    } else if (filter.assigneeId && task.assigneeId?._id !== filter.assigneeId) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Tasks
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {isEmployee ? 'View your assigned tasks' : 'Manage your tasks'}
          </p>
        </div>
        {canCreateTasks && (
          <button 
            onClick={handleCreate} 
            className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">New Task</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="input text-sm"
            >
              <option value="">All Statuses</option>
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Project
            </label>
            <select
              value={filter.projectId}
              onChange={(e) => setFilter({ ...filter, projectId: e.target.value })}
              className="input text-sm"
            >
              <option value="">All Projects</option>
              {projects?.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          {!isEmployee && (
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Assignee
              </label>
              <select
                value={filter.assigneeId}
                onChange={(e) => setFilter({ ...filter, assigneeId: e.target.value })}
                className="input text-sm"
              >
                <option value="">All Assignees</option>
                <option value="unassigned">Unassigned</option>
                {users?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="card text-center py-12 sm:py-16 border border-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-500">Loading tasks...</p>
        </div>
      ) : filteredTasks?.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {filteredTasks.map((task) => (
            <div 
              key={task._id} 
              className="card border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <Link to={`/tasks/${task._id}`} className="block group flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                        {task.title}
                      </h3>
                    </Link>
                    {canEditTask(task) ? (
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className={`badge ${getStatusColor(task.status)} border-none cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs sm:text-sm flex-shrink-0`}
                        style={{ 
                          appearance: 'none',
                          paddingRight: '1.5rem',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.5rem center',
                          backgroundSize: '0.75rem'
                        }}
                      >
                        <option value="TODO">Todo</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="DONE">Done</option>
                        <option value="BLOCKED">Blocked</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`badge ${getStatusColor(task.status)} text-xs sm:text-sm flex-shrink-0`}>
                        {task.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                    {task.description || 'No description'}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <span className="truncate">
                      <span className="font-medium">Project:</span> {task.projectId?.name || 'No project'}
                    </span>
                    {task.assigneeId ? (
                      <span className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{task.assigneeId.firstName} {task.assigneeId.lastName}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-4 flex-shrink-0">
                  {canEditTask(task) && (
                    <button
                      onClick={() => handleEdit(task)}
                      className="btn btn-secondary flex items-center justify-center gap-2 px-3 sm:px-4 py-2"
                      title="Edit task"
                      aria-label="Edit task"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline text-xs sm:text-sm">Edit</span>
                    </button>
                  )}
                  {canDeleteTasks && (
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="btn btn-danger flex items-center justify-center gap-2 px-3 sm:px-4 py-2"
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12 sm:py-16 border border-gray-100">
          <CheckSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-500 mb-4">No tasks found</p>
          {canCreateTasks && (
            <button onClick={handleCreate} className="btn btn-primary">
              Create your first task
            </button>
          )}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        projects={projects}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          dispatch(fetchTasks(filter));
        }}
      />
    </div>
  );
};

export default Tasks;

