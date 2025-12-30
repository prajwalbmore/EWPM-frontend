import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchTaskById, updateTaskStatus, addComment } from '../store/slices/taskSlice';
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  Clock,
  Tag,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Pause,
  Play,
  MessageSquare,
  Send,
  FolderKanban,
} from 'lucide-react';
import { format } from 'date-fns';
import TaskModal from '../components/Tasks/TaskModal';
import usePermissions from '../hooks/usePermissions';
import { toast } from 'sonner';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTask, isLoading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const { canEditTask, canDeleteTasks, canAssignTasks } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [dispatch, id]);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // Delete logic would go here
      toast.error('Delete functionality not implemented in this view');
    }
  };

  const handleStatusChange = async (newStatus) => {
    await dispatch(updateTaskStatus({ id, status: newStatus }));
    dispatch(fetchTaskById(id));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await dispatch(addComment({ taskId: id, comment: comment.trim() }));
      setComment('');
      dispatch(fetchTaskById(id));
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      TODO: 'bg-white/10 text-white/70',
      IN_PROGRESS: 'bg-blue-500/15 text-blue-300',
      IN_REVIEW: 'bg-yellow-500/15 text-yellow-300',
      DONE: 'bg-green-500/15 text-green-300',
      BLOCKED: 'bg-red-500/15 text-red-300',
      CANCELLED: 'bg-white/10 text-white/70',
    };
    return colors[status] || colors.TODO;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'TODO':
        return <AlertCircle className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <Play className="w-4 h-4" />;
      case 'IN_REVIEW':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'DONE':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'BLOCKED':
        return <Pause className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: 'bg-white/10 text-white/70',
      MEDIUM: 'bg-blue-500/15 text-blue-300',
      HIGH: 'bg-orange-500/15 text-orange-300',
      CRITICAL: 'bg-red-500/15 text-red-300',
    };
    return colors[priority] || colors.MEDIUM;
  };

  const statusOptions = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED', 'CANCELLED'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary-400" />
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 py-12 text-center backdrop-blur-xl">
        <AlertCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Task Not Found</h2>
        <p className="text-white/60 mb-4">The task you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/tasks" className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-400">
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Link to="/tasks" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
              {currentTask.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {currentTask.projectId && (
                <Link
                  to={`/projects/${currentTask.projectId._id || currentTask.projectId}`}
                  className="text-primary-300 hover:text-primary-200 text-xs sm:text-sm font-medium truncate"
                >
                  {currentTask.projectId.name || 'Project'}
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {canEditTask(currentTask) && (
            <button onClick={handleEdit} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
          {canDeleteTasks && (
            <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-xl bg-rose-500/15 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-rose-300 hover:bg-rose-500/20">
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Status</p>
              {canEditTask(currentTask) ? (
                <select
                  value={currentTask.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  {getStatusIcon(currentTask.status)}
                  <span className={`rounded-full px-3 py-1 text-xs ring-1 ${getStatusColor(currentTask.status)}`}>
                    {currentTask.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Priority</p>
              <span className={`rounded-full px-3 py-1 text-xs ring-1 ${getPriorityColor(currentTask.priority)}`}>
                {currentTask.priority}
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Type</p>
              <span className="rounded-full px-3 py-1 text-xs ring-1 bg-white/10 text-white/70 ring-white/20">{currentTask.type || 'STORY'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
            <p className="text-white/70 whitespace-pre-wrap">
              {currentTask.description || 'No description provided.'}
            </p>
          </div>

          {/* Comments */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comments ({currentTask.comments?.length || 0})
            </h2>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="flex gap-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
                  rows={3}
                />
                <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-400 self-end">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Comments List */}
            {currentTask.comments && currentTask.comments.length > 0 ? (
              <div className="space-y-4">
                {currentTask.comments.map((comment, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-500/15 rounded-full flex items-center justify-center ring-1 ring-primary-500/30">
                          <User className="w-4 h-4 text-primary-300" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {comment.userId?.firstName} {comment.userId?.lastName}
                          </p>
                          <p className="text-xs text-white/50">
                            {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/70 mt-2">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center py-8">No comments yet</p>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Task Info */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Task Information</h2>
            <div className="space-y-4">
              {currentTask.assigneeId && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-white/40 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/60">Assigned To</p>
                    <p className="font-medium text-white">
                      {currentTask.assigneeId.firstName} {currentTask.assigneeId.lastName}
                    </p>
                    <p className="text-xs text-white/50">{currentTask.assigneeId.email}</p>
                  </div>
                </div>
              )}
              {currentTask.reporterId && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-white/40 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/60">Reporter</p>
                    <p className="font-medium text-white">
                      {currentTask.reporterId.firstName} {currentTask.reporterId.lastName}
                    </p>
                  </div>
                </div>
              )}
              {currentTask.dueDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-white/40 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/60">Due Date</p>
                    <p className="font-medium text-white">
                      {format(new Date(currentTask.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}
              {currentTask.estimatedHours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-white/40 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/60">Estimated Hours</p>
                    <p className="font-medium text-white">{currentTask.estimatedHours}h</p>
                    {currentTask.actualHours !== undefined && (
                      <p className="text-xs text-white/50 mt-1">
                        Actual: {currentTask.actualHours}h
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Link */}
          {currentTask.projectId && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Project</h2>
              <Link
                to={`/projects/${currentTask.projectId._id || currentTask.projectId}`}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-500/15 rounded-full flex items-center justify-center ring-1 ring-primary-500/30">
                  <FolderKanban className="w-5 h-5 text-primary-300" />
                </div>
                <div>
                  <p className="font-medium text-white">{currentTask.projectId.name}</p>
                  <p className="text-xs text-white/50">View project details</p>
                </div>
              </Link>
            </div>
          )}

          {/* Tags */}
          {currentTask.tags && currentTask.tags.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentTask.tags.map((tag, index) => (
                  <span key={index} className="rounded-full px-3 py-1 text-xs ring-1 bg-white/10 text-white/70 ring-white/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-white/40 mt-0.5" />
              <div>
                <p className="text-sm text-white/60">Created</p>
                <p className="font-medium text-white">
                  {format(new Date(currentTask.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={currentTask}
        onSuccess={() => {
          setIsModalOpen(false);
          dispatch(fetchTaskById(id));
        }}
      />
    </div>
  );
};

export default TaskDetails;

