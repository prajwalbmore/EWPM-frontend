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
      PLANNING: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      ON_HOLD: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.PLANNING;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Projects
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your projects</p>
        </div>
        {canCreateProjects && (
          <button 
            onClick={handleCreate} 
            className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">New Project</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="card text-center py-12 sm:py-16">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-500">Loading projects...</p>
        </div>
      ) : projects?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="card border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <Link to={`/projects/${project._id}`} className="block group">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors truncate">
                      {project.name}
                    </h3>
                  </Link>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{project.description || 'No description'}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                <span className={`badge ${getStatusColor(project.status)} text-xs`}>
                  {project.status}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  {project.members?.length || 0} members
                </span>
              </div>

              <div className="flex items-center gap-2">
                {canEditProject(project) && (
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 btn btn-secondary flex items-center justify-center gap-2 text-xs sm:text-sm py-2"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
                {canDeleteProjects && (
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="btn btn-danger flex items-center justify-center gap-2 px-3 sm:px-4 py-2"
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
        <div className="card text-center py-12 sm:py-16 border border-gray-100">
          <FolderKanban className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-500 mb-4">No projects yet</p>
          {canCreateProjects && (
            <button onClick={handleCreate} className="btn btn-primary">
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

