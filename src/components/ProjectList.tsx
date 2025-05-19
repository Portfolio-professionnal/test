import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function ProjectList({ projects, clients }: { projects: any[], clients: any[] }) {
  const deleteProject = useMutation(api.projects.remove);

  const handleDelete = async (id: Id<"projects">) => {
    try {
      await deleteProject({ id });
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const getClientName = (clientId: Id<"clients">) => {
    const client = clients.find(c => c._id === clientId);
    return client?.name || "Unknown Client";
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Client</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Rate</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id} className="border-b">
              <td className="p-4">{project.name}</td>
              <td className="p-4">{getClientName(project.clientId)}</td>
              <td className="p-4">{project.status}</td>
              <td className="p-4">${project.rate}/hr</td>
              <td className="p-4">
                <button
                  onClick={() => handleDelete(project._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
