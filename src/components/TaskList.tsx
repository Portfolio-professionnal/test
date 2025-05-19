import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { useTranslation } from "react-i18next";

export function TaskList({ tasks, projects }: { tasks: any[], projects: any[] }) {
  const { t } = useTranslation();
  const updateTaskStatus = useMutation(api.tasks.updateStatus);

  const handleStatusUpdate = async (id: Id<"tasks">, status: string) => {
    try {
      await updateTaskStatus({ id, status });
      toast.success("Statut de la tâche mis à jour");
    } catch (error) {
      toast.error("Échec de la mise à jour du statut");
    }
  };

  const getProjectName = (projectId: Id<"projects">) => {
    const project = projects.find(p => p._id === projectId);
    return project?.name || "-";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Titre</th>
            <th className="text-left p-4">Projet</th>
            <th className="text-left p-4">Priorité</th>
            <th className="text-left p-4">Statut</th>
            <th className="text-left p-4">Date d'échéance</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b">
              <td className="p-4">{task.title}</td>
              <td className="p-4">{task.projectId ? getProjectName(task.projectId) : "-"}</td>
              <td className={`p-4 ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </td>
              <td className="p-4">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="pending">{t('status.pending')}</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">{t('status.completed')}</option>
                </select>
              </td>
              <td className="p-4">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
              </td>
              <td className="p-4">
                <button
                  onClick={() => handleStatusUpdate(task._id, "completed")}
                  className={`px-2 py-1 rounded ${
                    task.status === "completed"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-green-100 text-green-700"
                  }`}
                  disabled={task.status === "completed"}
                >
                  ✓
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
