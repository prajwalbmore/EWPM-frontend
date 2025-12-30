import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProjectById } from "../store/slices/projectSlice";
import { fetchTasks } from "../store/slices/taskSlice";
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
} from "lucide-react";
import { format } from "date-fns";
import ProjectModal from "../components/Projects/ProjectModal";
import usePermissions from "../hooks/usePermissions";
import { toast } from "sonner";

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
    if (window.confirm("Are you sure you want to delete this project?")) {
      // Delete logic would go here
      toast.error("Delete functionality not implemented in this view");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PLANNING: "bg-white/10 text-white/70",
      IN_PROGRESS: "bg-blue-500/15 text-blue-300",
      ON_HOLD: "bg-yellow-500/15 text-yellow-300",
      COMPLETED: "bg-green-500/15 text-green-300",
      CANCELLED: "bg-red-500/15 text-red-300",
    };
    return colors[status] || colors.PLANNING;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PLANNING":
        return <AlertCircle className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Play className="w-4 h-4" />;
      case "ON_HOLD":
        return <Pause className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: "bg-white/10 text-white/70",
      MEDIUM: "bg-blue-500/15 text-blue-300",
      HIGH: "bg-orange-500/15 text-orange-300",
      CRITICAL: "bg-red-500/15 text-red-300",
    };
    return colors[priority] || colors.MEDIUM;
  };

  const getMemberRoleColor = (role) => {
    const colors = {
      MEMBER: "bg-blue-500/15 text-blue-300",
      LEAD: "bg-purple-500/15 text-purple-300",
      VIEWER: "bg-white/10 text-white/70",
    };
    return colors[role] || colors.MEMBER;
  };

  const projectTasks =
    tasks?.filter(
      (task) => task.projectId?._id === id || task.projectId === id
    ) || [];
  const completedTasks = projectTasks.filter((t) => t.status === "DONE").length;
  const totalTasks = projectTasks.length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary-400" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 py-12 text-center backdrop-blur-xl">
        <AlertCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Project Not Found
        </h2>
        <p className="text-white/60 mb-4">
          The project you're looking for doesn't exist or you don't have access
          to it.
        </p>
        <Link to="/projects" className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-400">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/projects" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
              {currentProject.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1">
              Project Details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {canEditProject(currentProject) && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
          {canDeleteProjects && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-500/15 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-rose-300 hover:bg-rose-500/20"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Status</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(currentProject.status)}
                <span
                  className={`rounded-full px-3 py-1 text-xs ring-1 ${getStatusColor(currentProject.status)}`}
                >
                  {currentProject.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Priority</p>
              <span
                className={`rounded-full px-3 py-1 text-xs ring-1 ${getPriorityColor(currentProject.priority)}`}
              >
                {currentProject.priority}
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {progress}%
                </span>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              Description
            </h2>
            <p className="text-white/70 whitespace-pre-wrap">
              {currentProject.description || "No description provided."}
            </p>
          </div>

          {/* Tasks */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5" />
                Tasks ({totalTasks})
              </h2>
              <Link
                to={`/tasks?projectId=${id}`}
                className="text-primary-300 hover:text-primary-200 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            {projectTasks.length > 0 ? (
              <div className="space-y-3">
                {projectTasks.slice(0, 5).map((task) => (
                  <Link
                    key={task._id}
                    to={`/tasks/${task._id}`}
                    className="block p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          {task.title}
                        </p>
                        <p className="text-sm text-white/60 mt-1">
                          {task.assigneeId
                            ? `Assigned to: ${task.assigneeId.firstName} ${task.assigneeId.lastName}`
                            : "Unassigned"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ring-1 ${
                          task.status === "DONE"
                            ? "bg-green-500/15 text-green-300 ring-green-500/20"
                            : task.status === "IN_PROGRESS"
                            ? "bg-blue-500/15 text-blue-300 ring-blue-500/20"
                            : "bg-white/10 text-white/70 ring-white/20"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center py-8">No tasks yet</p>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              Project Information
            </h2>
            <div className="space-y-4">
              {currentProject.startDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-white/40 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/60">Start Date</p>
                    <p className="font-medium text-white">
                      {format(
                        new Date(currentProject.startDate),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                </div>
              )}
              {currentProject.endDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-white/40 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/60">End Date</p>
                    <p className="font-medium text-white">
                      {format(new Date(currentProject.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              )}
              {currentProject.budget && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-white/40 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/60">Budget</p>
                    <p className="font-medium text-white">
                      ${currentProject.budget.toLocaleString()}
                    </p>
                    {currentProject.spent !== undefined && (
                      <p className="text-xs text-white/50 mt-1">
                        Spent: ${currentProject.spent.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members ({currentProject.members?.length || 0})
            </h2>
            {currentProject.members && currentProject.members.length > 0 ? (
              <div className="space-y-3">
                {currentProject.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-500/15 rounded-full flex items-center justify-center ring-1 ring-primary-500/30">
                        <User className="w-5 h-5 text-primary-300" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {member.userId?.firstName} {member.userId?.lastName}
                        </p>
                        <p className="text-xs text-white/50">
                          {member.userId?.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ring-1 ${getMemberRoleColor(member.role)}`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center py-4">
                No members added yet
              </p>
            )}
          </div>

          {/* Project Manager & Owner */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              Project Leadership
            </h2>
            <div className="space-y-3">
              {currentProject.managerId && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/15 rounded-full flex items-center justify-center ring-1 ring-blue-500/30">
                    <User className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Manager</p>
                    <p className="font-medium text-white">
                      {currentProject.managerId.firstName}{" "}
                      {currentProject.managerId.lastName}
                    </p>
                  </div>
                </div>
              )}

              {/* {currentProject.ownerId && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Owner</p>
                    <p className="font-medium text-gray-900">
                      {currentProject.ownerId.firstName}{" "}
                      {currentProject.ownerId.lastName}
                    </p>
                  </div>
                </div>
              )} */}
            </div>
          </div>

          {/* Tags */}
          {currentProject.tags && currentProject.tags.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentProject.tags.map((tag, index) => (
                  <span key={index} className="rounded-full px-3 py-1 text-xs ring-1 bg-white/10 text-white/70 ring-white/20">
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
