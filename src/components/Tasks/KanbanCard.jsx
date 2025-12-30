import { Link } from "react-router-dom";
import { Edit, Trash2, User, Calendar } from "lucide-react";
import { format } from "date-fns";

const KanbanCard = ({
  task,
  onClick,
  canEditTask,
  canDeleteTasks,
  onEdit,
  onDelete,
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task._id);
    e.dataTransfer.setData("currentStatus", task.status);
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
  };

  const statusBorderColors = {
    TODO: "rgba(255, 255, 255, 0.2)",
    IN_PROGRESS: "rgba(59, 130, 246, 0.3)",
    IN_REVIEW: "rgba(234, 179, 8, 0.3)",
    DONE: "rgba(34, 197, 94, 0.3)",
    BLOCKED: "rgba(239, 68, 68, 0.3)",
    CANCELLED: "rgba(255, 255, 255, 0.2)",
  };

  const priorityColors = {
    LOW: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    MEDIUM: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    HIGH: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    URGENT: "bg-red-500/15 text-red-300 border-red-500/30",
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group cursor-move rounded-lg border bg-white/5 p-3 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-0.5"
      style={{ borderColor: statusBorderColors[task.status] || statusBorderColors.TODO }}
    >
      {/* Task Title */}
      <Link
        to={`/tasks/${task._id}`}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
        className="block mb-2"
      >
        <h4 className="font-semibold text-white group-hover:text-primary-300 transition-colors line-clamp-2">
          {task.title}
        </h4>
      </Link>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-white/60 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Priority Badge */}
      {task.priority && (
        <div className="mb-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
              priorityColors[task.priority] || priorityColors.MEDIUM
            }`}
          >
            {task.priority}
          </span>
        </div>
      )}

      {/* Task Meta */}
      <div className="flex items-center justify-between text-xs text-white/50 mb-2">
        {task.projectId && (
          <span className="truncate max-w-[120px]" title={task.projectId.name}>
            📁 {task.projectId.name}
          </span>
        )}
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
      </div>

      {/* Assignee */}
      {task.assigneeId && (
        <div className="flex items-center gap-2 mb-2 text-xs text-white/60">
          <User size={12} />
          <span className="truncate">
            {task.assigneeId.firstName} {task.assigneeId.lastName}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/10">
        {canEditTask && canEditTask(task) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) {
                onEdit(task);
              }
            }}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            title="Edit task"
          >
            <Edit size={14} />
          </button>
        )}
        {canDeleteTasks && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) {
                onDelete(task._id);
              }
            }}
            className="p-1.5 rounded-lg border border-white/10 bg-rose-500/15 text-rose-300 hover:bg-rose-500/20 transition-colors"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;

