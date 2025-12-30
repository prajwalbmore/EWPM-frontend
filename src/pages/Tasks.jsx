// import { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import {
//   fetchTasks,
//   updateTaskStatus,
//   deleteTask,
// } from "../store/slices/taskSlice";
// import { fetchProjects } from "../store/slices/projectSlice";
// import { fetchUsers } from "../store/slices/userSlice";
// import {
//   Plus,
//   Trash2,
//   CheckSquare,
//   Edit,
//   User,
//   LayoutGrid,
//   List,
// } from "lucide-react";
// import TaskModal from "../components/Tasks/TaskModal";
// import KanbanColumn from "../components/Tasks/KanbanColumn";
// import usePermissions from "../hooks/usePermissions";

// /* -------------------- Status Styles -------------------- */
// const statusStyles = {
//   TODO: "bg-white/10 text-white/70 border-white/20",
//   IN_PROGRESS: "bg-blue-500/15 text-blue-300 border-blue-500/30",
//   IN_REVIEW: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
//   DONE: "bg-green-500/15 text-green-300 border-green-500/30",
//   BLOCKED: "bg-red-500/15 text-red-300 border-red-500/30",
//   CANCELLED: "bg-white/10 text-white/50 border-white/20",
// };

// /* -------------------- Kanban Columns -------------------- */
// const kanbanColumns = [
//   { status: "TODO", name: "To Do" },
//   { status: "IN_PROGRESS", name: "In Progress" },
//   { status: "IN_REVIEW", name: "In Review" },
//   { status: "DONE", name: "Done" },
//   { status: "BLOCKED", name: "Blocked" },
//   { status: "CANCELLED", name: "Cancelled" },
// ];

// const Tasks = () => {
//   const dispatch = useDispatch();

//   const { tasks, isLoading } = useSelector((state) => state.tasks);
//   const { projects } = useSelector((state) => state.projects);
//   const { users } = useSelector((state) => state.users);

//   const { canCreateTasks, canDeleteTasks, canEditTask, isEmployee } =
//     usePermissions();

//   const [viewMode, setViewMode] = useState("kanban");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);

//   const [filter, setFilter] = useState({
//     status: "",
//     projectId: "",
//     assigneeId: "",
//   });

//   /* -------------------- Fetch Data -------------------- */
//   useEffect(() => {
//     dispatch(fetchProjects());
//     dispatch(fetchUsers({ limit: 100 }));
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(fetchTasks(filter));
//   }, [dispatch, filter]);

//   /* -------------------- Filtered Tasks -------------------- */
//   const filteredTasks = useMemo(() => {
//     return tasks?.filter((task) => {
//       if (filter.status && task.status !== filter.status) return false;
//       if (filter.projectId && task.projectId?._id !== filter.projectId)
//         return false;

//       if (
//         filter.assigneeId &&
//         filter.assigneeId !== "unassigned" &&
//         task.assigneeId?._id !== filter.assigneeId
//       )
//         return false;

//       if (filter.assigneeId === "unassigned" && task.assigneeId) return false;

//       return true;
//     });
//   }, [tasks, filter]);

//   /* -------------------- Handlers -------------------- */
//   const handleTaskDrop = async (taskId, status) => {
//     await dispatch(updateTaskStatus({ id: taskId, status }));
//     dispatch(fetchTasks(filter));
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this task?")) {
//       await dispatch(deleteTask(id));
//       dispatch(fetchTasks(filter));
//     }
//   };

//   /* -------------------- UI -------------------- */
//   return (
//     <div className="space-y-6 w-full overflow-x-hidden">
//       {/* ---------------- Header ---------------- */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-white">Tasks</h1>
//           <p className="text-white/60 text-sm">
//             {isEmployee
//               ? "Track tasks assigned to you"
//               : "Create, assign and manage tasks"}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* View Toggle */}
//           <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
//             <button
//               onClick={() => setViewMode("kanban")}
//               className={`p-2 rounded-lg ${
//                 viewMode === "kanban"
//                   ? "bg-primary-500 text-white"
//                   : "text-white/60 hover:bg-white/10"
//               }`}
//             >
//               <LayoutGrid size={16} />
//             </button>
//             <button
//               onClick={() => setViewMode("list")}
//               className={`p-2 rounded-lg ${
//                 viewMode === "list"
//                   ? "bg-primary-500 text-white"
//                   : "text-white/60 hover:bg-white/10"
//               }`}
//             >
//               <List size={16} />
//             </button>
//           </div>

//           {canCreateTasks && (
//             <button
//               onClick={() => {
//                 setEditingTask(null);
//                 setIsModalOpen(true);
//               }}
//               className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white"
//             >
//               <Plus size={16} />
//               New Task
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ---------------- Filters ---------------- */}
//       <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           <select
//             className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
//             value={filter.status}
//             onChange={(e) => setFilter({ ...filter, status: e.target.value })}
//           >
//             <option value="" className="text-black">
//               All Status
//             </option>
//             {Object.keys(statusStyles).map((s) => (
//               <option key={s} value={s} className="text-black">
//                 {s.replace("_", " ")}
//               </option>
//             ))}
//           </select>

//           <select
//             className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
//             value={filter.projectId}
//             onChange={(e) =>
//               setFilter({ ...filter, projectId: e.target.value })
//             }
//           >
//             <option value="" className="text-black">
//               All Projects
//             </option>
//             {projects?.map((p) => (
//               <option key={p._id} value={p._id}>
//                 {p.name}
//               </option>
//             ))}
//           </select>

//           {!isEmployee && (
//             <select
//               className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
//               value={filter.assigneeId}
//               onChange={(e) =>
//                 setFilter({ ...filter, assigneeId: e.target.value })
//               }
//             >
//               <option value="" className="text-black">
//                 All Assignees
//               </option>
//               <option value="unassigned" className="text-black">
//                 Unassigned
//               </option>
//               {users?.map((u) => (
//                 <option key={u._id} value={u._id} className="text-black">
//                   {u.firstName} {u.lastName}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>
//       </div>

//       {/* ---------------- Content ---------------- */}
//       {isLoading ? (
//         <div className="flex justify-center py-20">
//           <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-500" />
//         </div>
//       ) : viewMode === "kanban" ? (
//         filteredTasks?.length ? (
//           <div
//             className="
//               flex
//                gap-5 overflow-x-auto
//               pb-4 w-full
//               custom-scrollbar-dark
//             "
//           >
//             {kanbanColumns.map((column) => (
//               <div key={column.status} className=" w-full">
//                 <KanbanColumn
//                   key={column.status}
//                   column={column}
//                   tasks={filteredTasks}
//                   onTaskDrop={handleTaskDrop}
//                   onTaskClick={handleTaskClick}
//                   onAddTask={handleAddTask}
//                   onEditTask={handleEditTask}
//                   onDeleteTask={handleDeleteTask}
//                   canCreateTasks={canCreateTasks}
//                   canEditTask={canEditTask}
//                   canDeleteTasks={canDeleteTasks}
//                 />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <EmptyState />
//         )
//       ) : filteredTasks?.length ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredTasks.map((task) => (
//             <TaskCard
//               key={task._id}
//               task={task}
//               canEditTask={canEditTask}
//               canDeleteTasks={canDeleteTasks}
//               onEdit={() => {
//                 setEditingTask(task);
//                 setIsModalOpen(true);
//               }}
//               onDelete={() => handleDelete(task._id)}
//             />
//           ))}
//         </div>
//       ) : (
//         <EmptyState />
//       )}

//       {/* ---------------- Modal ---------------- */}
//       <TaskModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setEditingTask(null);
//         }}
//         task={editingTask}
//         projects={projects}
//         onSuccess={() => {
//           setIsModalOpen(false);
//           setEditingTask(null);
//           dispatch(fetchTasks(filter));
//         }}
//       />
//     </div>
//   );
// };

// export default Tasks;

// /* -------------------- Reusable Components -------------------- */

// const EmptyState = () => (
//   <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/5">
//     <CheckSquare className="mx-auto mb-4 text-white/40" size={48} />
//     <p className="text-white/60">No tasks found</p>
//   </div>
// );

// const TaskCard = ({ task, canEditTask, canDeleteTasks, onEdit, onDelete }) => (
//   <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
//     <Link to={`/tasks/${task._id}`}>
//       <h3 className="font-semibold text-white line-clamp-1">{task.title}</h3>
//     </Link>

//     <p className="text-sm text-white/60 mt-2 line-clamp-2">
//       {task.description || "No description"}
//     </p>

//     <div className="mt-4 flex justify-between text-xs text-white/50">
//       <span>{task.projectId?.name || "No Project"}</span>
//       {task.assigneeId ? (
//         <span className="flex items-center gap-1">
//           <User size={14} />
//           {task.assigneeId.firstName}
//         </span>
//       ) : (
//         <span className="italic">Unassigned</span>
//       )}
//     </div>

//     <div className="mt-4 flex justify-end gap-2">
//       {canEditTask(task) && (
//         <button onClick={onEdit} className="icon-btn">
//           <Edit size={16} />
//         </button>
//       )}
//       {canDeleteTasks && (
//         <button onClick={onDelete} className="icon-btn text-rose-300">
//           <Trash2 size={16} />
//         </button>
//       )}
//     </div>
//   </div>
// );
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchTasks,
  updateTaskStatus,
  deleteTask,
} from "../store/slices/taskSlice";
import { fetchProjects } from "../store/slices/projectSlice";
import { fetchUsers } from "../store/slices/userSlice";
import {
  Plus,
  Trash2,
  CheckSquare,
  Edit,
  User,
  LayoutGrid,
  List,
} from "lucide-react";
import TaskModal from "../components/Tasks/TaskModal";
import KanbanColumn from "../components/Tasks/KanbanColumn";
import usePermissions from "../hooks/usePermissions";

const statusStyles = {
  TODO: "bg-white/10 text-white/70 border-white/20",
  IN_PROGRESS: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  IN_REVIEW: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  DONE: "bg-green-500/15 text-green-300 border-green-500/30",
  BLOCKED: "bg-red-500/15 text-red-300 border-red-500/30",
  CANCELLED: "bg-white/10 text-white/50 border-white/20",
};

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);

  const { canCreateTasks, canDeleteTasks, canEditTask, isEmployee } =
    usePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" or "list"
  const [filter, setFilter] = useState({
    status: "",
    projectId: "",
    assigneeId: "",
  });

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchUsers({ limit: 100 }));
    dispatch(fetchTasks(filter));
  }, [dispatch, filter]);

  const filteredTasks = tasks?.filter((task) => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.projectId && task.projectId?._id !== filter.projectId)
      return false;
    if (
      filter.assigneeId &&
      filter.assigneeId !== "unassigned" &&
      task.assigneeId?._id !== filter.assigneeId
    )
      return false;
    if (filter.assigneeId === "unassigned" && task.assigneeId) return false;
    return true;
  });

  // Kanban columns configuration
  const kanbanColumns = [
    { status: "TODO", name: "To Do", color: "#64748b" },
    { status: "IN_PROGRESS", name: "In Progress", color: "#3b82f6" },
    { status: "IN_REVIEW", name: "In Review", color: "#eab308" },
    { status: "DONE", name: "Done", color: "#22c55e" },
    { status: "BLOCKED", name: "Blocked", color: "#ef4444" },
    { status: "CANCELLED", name: "Cancelled", color: "#6b7280" },
  ];

  const handleTaskDrop = async (taskId, newStatus) => {
    await dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
    dispatch(fetchTasks(filter));
  };

  const handleTaskClick = (task) => {
    if (canEditTask && canEditTask(task)) {
      setEditingTask(task);
      setIsModalOpen(true);
    }
  };

  const handleAddTask = (status) => {
    setEditingTask(status ? { status } : null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await dispatch(deleteTask(taskId));
      dispatch(fetchTasks(filter));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
            Tasks
          </h1>
          <p className="text-white/60 mt-1 text-sm sm:text-base">
            {isEmployee
              ? "Track tasks assigned to you"
              : "Create, assign and manage tasks"}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                viewMode === "kanban"
                  ? "bg-primary-500 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              title="Kanban View"
            >
              <LayoutGrid size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-primary-500 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              title="List View"
            >
              <List size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>

          {canCreateTasks && (
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-primary-500 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-400 transition-colors"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Status</option>
            {Object.keys(statusStyles).map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
            value={filter.projectId}
            onChange={(e) =>
              setFilter({ ...filter, projectId: e.target.value })
            }
          >
            <option value="">All Projects</option>
            {projects?.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          {!isEmployee && (
            <select
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
              value={filter.assigneeId}
              onChange={(e) =>
                setFilter({ ...filter, assigneeId: e.target.value })
              }
            >
              <option value="">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {users?.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary-400" />
          <p className="text-sm text-white/60">Loading tasks...</p>
        </div>
      ) : viewMode === "kanban" ? (
        /* Kanban Board View */
        filteredTasks?.length ? (
          <div
            className="
            flex 
             gap-5 overflow-x-auto
            pb-4 w-full
            custom-scrollbar-dark
          "
          >
            {kanbanColumns.map((column) => (
              <KanbanColumn
                key={column.status}
                column={column}
                tasks={filteredTasks}
                onTaskDrop={handleTaskDrop}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                canCreateTasks={canCreateTasks}
                canEditTask={canEditTask}
                canDeleteTasks={canDeleteTasks}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <CheckSquare className="mx-auto mb-4 text-white/40" size={48} />
            <p className="text-white/60">No tasks found</p>
          </div>
        )
      ) : /* List View */
      filteredTasks?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-auto custom-scrollbar-dark">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl transition hover:-translate-y-1 hover:shadow-primary-500/10 overflow-auto"
            >
              <div className="flex justify-between items-start gap-3">
                <Link to={`/tasks/${task._id}`} className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-primary-300 transition line-clamp-1">
                    {task.title}
                  </h3>
                </Link>

                {canEditTask(task) ? (
                  <select
                    value={task.status}
                    onChange={(e) =>
                      dispatch(
                        updateTaskStatus({
                          id: task._id,
                          status: e.target.value,
                        })
                      )
                    }
                    className={`text-xs px-3 py-1 rounded-full border cursor-pointer ${
                      statusStyles[task.status]
                    }`}
                  >
                    {Object.keys(statusStyles).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${
                      statusStyles[task.status]
                    }`}
                  >
                    {task.status}
                  </span>
                )}
              </div>

              <p className="text-sm text-white/60 mt-3 line-clamp-2">
                {task.description || "No description"}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                <span>{task.projectId?.name || "No Project"}</span>

                {task.assigneeId ? (
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {task.assigneeId.firstName}
                  </span>
                ) : (
                  <span className="italic">Unassigned</span>
                )}
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                {canEditTask(task) && (
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <Edit size={16} />
                  </button>
                )}

                {canDeleteTasks && (
                  <button
                    onClick={() => dispatch(deleteTask(task._id))}
                    className="p-2 rounded-lg border border-white/10 bg-rose-500/15 text-rose-300 hover:bg-rose-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <CheckSquare className="mx-auto mb-4 text-white/40" size={48} />
          <p className="text-white/60">No tasks found</p>
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
