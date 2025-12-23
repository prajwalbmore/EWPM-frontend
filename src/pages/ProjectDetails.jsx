import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProjectById } from '../store/slices/projectSlice';
import { fetchTasks } from '../store/slices/taskSlice';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Calendar,
  DollarSign,
  FolderKanban,
  User,
  Clock,
  Tag,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Pause,
  Play,
} from 'lucide-react';
import { format } from 'date-fns';
import ProjectModal from '../components/Projects/ProjectModal';
import usePermissions from '../hooks/usePermissions';
import { toast } from 'sonner';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, isLoading } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const { canEditProject, canDeleteProjects } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
      dispatch(fetchTasks({ projectId: id }));
    }
  }, [dispatch, id]);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      // Delete logic would go here
      toast.error('Delete functionality not implemented in this view');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PLANNING: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      ON_HOLD: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.PLANNING;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PLANNING':
        return <AlertCircle className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <Play className="w-4 h-4" />;
      case 'ON_HOLD':
        return <Pause className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800',
    };
    return colors[priority] || colors.MEDIUM;
  };

  const getMemberRoleColor = (role) => {
    const colors = {
      MEMBER: 'bg-blue-100 text-blue-800',
      LEAD: 'bg-purple-100 text-purple-800',
      VIEWER: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || colors.MEMBER;
  };

  const projectTasks = tasks?.filter((task) => task.projectId?._id === id || task.projectId === id) || [];
  const completedTasks = projectTasks.filter((t) => t.status === 'DONE').length;
  const totalTasks = projectTasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="card text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
        <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/projects" className="btn btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/projects" className="btn btn-secondary px-3 py-2">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {currentProject.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Project Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {canEditProject(currentProject) && (
            <button onClick={handleEdit} className="btn btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-2">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
          {canDeleteProjects && (
            <button onClick={handleDelete} className="btn btn-danger text-xs sm:text-sm px-3 sm:px-4 py-2">
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(currentProject.status)}
                <span className={`badge ${getStatusColor(currentProject.status)}`}>
                  {currentProject.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Priority</p>
              <span className={`badge ${getPriorityColor(currentProject.priority)}`}>
                {currentProject.priority}
              </span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{progress}%</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {currentProject.description || 'No description provided.'}
            </p>
          </div>

          {/* Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FolderKanban className="w-5 h-5" />
                Tasks ({totalTasks})
              </h2>
              <Link to={`/tasks?projectId=${id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            {projectTasks.length > 0 ? (
              <div className="space-y-3">
                {projectTasks.slice(0, 5).map((task) => (
                  <Link
                    key={task._id}
                    to={`/tasks/${task._id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {task.assigneeId
                            ? `Assigned to: ${task.assigneeId.firstName} ${task.assigneeId.lastName}`
                            : 'Unassigned'}
                        </p>
                      </div>
                      <span
                        className={`badge ${
                          task.status === 'DONE'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No tasks yet</p>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
            <div className="space-y-4">
              {currentProject.startDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(currentProject.startDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}
              {currentProject.endDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(currentProject.endDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}
              {currentProject.budget && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-medium text-gray-900">${currentProject.budget.toLocaleString()}</p>
                    {currentProject.spent !== undefined && (
                      <p className="text-xs text-gray-500 mt-1">
                        Spent: ${currentProject.spent.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members ({currentProject.members?.length || 0})
            </h2>
            {currentProject.members && currentProject.members.length > 0 ? (
              <div className="space-y-3">
                {currentProject.members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.userId?.firstName} {member.userId?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{member.userId?.email}</p>
                      </div>
                    </div>
                    <span className={`badge ${getMemberRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No members added yet</p>
            )}
          </div>

          {/* Project Manager & Owner */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Leadership</h2>
            <div className="space-y-3">
              {currentProject.managerId && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Manager</p>
                    <p className="font-medium text-gray-900">
                      {currentProject.managerId.firstName} {currentProject.managerId.lastName}
                    </p>
                  </div>
                </div>
              )}
              {currentProject.ownerId && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Owner</p>
                    <p className="font-medium text-gray-900">
                      {currentProject.ownerId.firstName} {currentProject.ownerId.lastName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {currentProject.tags && currentProject.tags.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentProject.tags.map((tag, index) => (
                  <span key={index} className="badge bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={currentProject}
        onSuccess={() => {
          setIsModalOpen(false);
          dispatch(fetchProjectById(id));
        }}
      />
    </div>
  );
};

export default ProjectDetails;

