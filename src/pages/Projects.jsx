import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects, createProject, deleteProject } from '../store/slices/projectSlice';
import { Plus, Trash2, Edit, FolderKanban, Users } from 'lucide-react';
import ProjectModal from '../components/Projects/ProjectModal';
import usePermissions from '../hooks/usePermissions';

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);
  const {
    canCreateProjects,
    canDeleteProjects,
    canEditProject,
  } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await dispatch(deleteProject(id));
      dispatch(fetchProjects());
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PLANNING: 'bg-white/10 text-white/70',
      IN_PROGRESS: 'bg-blue-500/15 text-blue-300',
      ON_HOLD: 'bg-yellow-500/15 text-yellow-300',
      COMPLETED: 'bg-green-500/15 text-green-300',
      CANCELLED: 'bg-red-500/15 text-red-300',
    };
    return colors[status] || colors.PLANNING;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-sm text-white/60">Manage your projects</p>
        </div>
        {canCreateProjects && (
          <button 
            onClick={handleCreate} 
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-400"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary-400" />
          <p className="text-sm text-white/60">Loading projects...</p>
        </div>
      ) : projects?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition hover:-translate-y-1 hover:shadow-primary-500/10 p-4 sm:p-5"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <Link to={`/projects/${project._id}`} className="block group">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors truncate">
                      {project.name}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-white/60 line-clamp-2">{project.description || 'No description'}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                <span className={`rounded-full px-3 py-1 text-xs ring-1 ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className="text-xs sm:text-sm text-white/50 flex items-center gap-1">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  {project.members?.length || 0} members
                </span>
              </div>

              <div className="flex items-center gap-2">
                {canEditProject(project) && (
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-white/20"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
                {canDeleteProjects && (
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500/15 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-rose-300 hover:bg-rose-500/20"
                    aria-label="Delete project"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center backdrop-blur-xl">
          <FolderKanban className="w-12 h-12 sm:w-16 sm:h-16 text-white/40 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-white/60 mb-4">No projects yet</p>
          {canCreateProjects && (
            <button onClick={handleCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-400">
              Create your first project
            </button>
          )}
        </div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onSuccess={() => {
          setIsModalOpen(false);
          dispatch(fetchProjects());
        }}
      />
    </div>
  );
};

export default Projects;

