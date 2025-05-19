import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function InvoiceList({ invoices, projects, clients }: { 
  invoices: any[],
  projects: any[],
  clients: any[]
}) {
  const updateStatus = useMutation(api.invoices.updateStatus);

  const handleStatusUpdate = async (id: Id<"invoices">, status: string) => {
    try {
      await updateStatus({ id, status });
      toast.success("Invoice status updated");
    } catch (error) {
      toast.error("Failed to update invoice status");
    }
  };

  const getProjectName = (projectId: Id<"projects">) => {
    const project = projects.find(p => p._id === projectId);
    return project?.name || "Unknown Project";
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
            <th className="text-left p-4">Project</th>
            <th className="text-left p-4">Client</th>
            <th className="text-left p-4">Amount</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Due Date</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id} className="border-b">
              <td className="p-4">{getProjectName(invoice.projectId)}</td>
              <td className="p-4">{getClientName(invoice.clientId)}</td>
              <td className="p-4">${invoice.amount}</td>
              <td className="p-4">{invoice.status}</td>
              <td className="p-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
              <td className="p-4">
                <select
                  value={invoice.status}
                  onChange={(e) => handleStatusUpdate(invoice._id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
