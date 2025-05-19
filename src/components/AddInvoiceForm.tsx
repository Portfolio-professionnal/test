import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface InvoiceItem {
  description: string;
  hours: number;
  rate: number;
}

export function AddInvoiceForm({ 
  projects, 
  clients,
  onClose 
}: { 
  projects: any[];
  clients: any[];
  onClose: () => void;
}) {
  const [projectId, setProjectId] = useState<Id<"projects"> | "">("");
  const [clientId, setClientId] = useState<Id<"clients"> | "">("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", hours: 0, rate: 0 }
  ]);

  const createInvoice = useMutation(api.invoices.create);

  const handleAddItem = () => {
    setItems([...items, { description: "", hours: 0, rate: 0 }]);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.hours * item.rate), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !clientId) {
      toast.error("Please select both project and client");
      return;
    }
    try {
      await createInvoice({
        projectId,
        clientId,
        amount: calculateTotal(),
        dueDate: new Date(dueDate).getTime(),
        items: items.map(item => ({
          ...item,
          hours: Number(item.hours),
          rate: Number(item.rate)
        }))
      });
      toast.success("Invoice created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create invoice");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Create New Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Project</label>
              <select
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value as Id<"projects">);
                  const project = projects.find(p => p._id === e.target.value);
                  if (project) {
                    setClientId(project.clientId);
                  }
                }}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Hours</label>
                  <input
                    type="number"
                    value={item.hours}
                    onChange={(e) => handleItemChange(index, "hours", Number(e.target.value))}
                    className="w-full border rounded p-2"
                    required
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block mb-1">Rate ($)</label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, "rate", Number(e.target.value))}
                    className="w-full border rounded p-2"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="text-indigo-500 hover:text-indigo-700"
          >
            + Add Item
          </button>

          <div className="text-right text-xl font-bold">
            Total: ${calculateTotal().toFixed(2)}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
