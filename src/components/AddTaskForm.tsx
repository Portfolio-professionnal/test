import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { useTranslation } from "react-i18next";

export function AddTaskForm({ 
  projects,
  onClose 
}: { 
  projects: any[];
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [projectId, setProjectId] = useState<Id<"projects"> | "">("");
  const [dueDate, setDueDate] = useState("");

  const createTask = useMutation(api.tasks.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        title,
        description,
        priority,
        projectId: projectId || undefined,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      });
      toast.success("Tâche créée avec succès");
      onClose();
    } catch (error) {
      toast.error("Échec de la création de la tâche");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Nouvelle tâche</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Priorité</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Projet (optionnel)</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value as Id<"projects">)}
              className="w-full border rounded p-2"
            >
              <option value="">Sélectionner un projet</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Date d'échéance (optionnelle)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded"
            >
              {t('actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
