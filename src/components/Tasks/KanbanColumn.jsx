import { useRef } from "react";
import { Plus } from "lucide-react";
import KanbanCard from "./KanbanCard";

const KanbanColumn = ({
  column,
  tasks,
  onTaskDrop,
  onTaskClick,
  onAddTask,
  onEditTask,
  onDeleteTask,
  canCreateTasks,
  canEditTask,
  canDeleteTasks,
}) => {
  const columnRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const currentStatus = e.dataTransfer.getData("currentStatus");
    
    if (taskId && currentStatus !== column.status) {
      onTaskDrop(taskId, column.status);
    }
  };

  const columnTasks = tasks.filter((task) => task.status === column.status);

  return (
    <div
      ref={columnRef}
      className="flex h-full min-w-[260px] sm:min-w-[280px] max-w-[260px] sm:max-w-[280px] flex-col rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ maxHeight: "calc(100vh - 320px)" }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-semibold text-white">{column.name}</h3>
          <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/70">
            {columnTasks.length}
          </span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 custom-scrollbar-dark">
        {columnTasks.length > 0 ? (
          columnTasks.map((task) => (
            <KanbanCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick(task)}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              canEditTask={canEditTask}
              canDeleteTasks={canDeleteTasks}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-2">👀</div>
            <p className="text-sm text-white/40">No tasks</p>
            {canCreateTasks && (
              <button
                onClick={() => onAddTask(column.status)}
                className="mt-3 text-xs text-primary-300 hover:text-primary-200 transition-colors"
              >
                Add task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Task Button */}
      {canCreateTasks && columnTasks.length > 0 && (
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => onAddTask(column.status)}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;

