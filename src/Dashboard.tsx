import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useTranslation } from "react-i18next";
import { ClientList } from "./components/ClientList";
import { ProjectList } from "./components/ProjectList";
import { InvoiceList } from "./components/InvoiceList";
import { TaskList } from "./components/TaskList";
import { AddClientForm } from "./components/AddClientForm";
import { AddProjectForm } from "./components/AddProjectForm";
import { AddInvoiceForm } from "./components/AddInvoiceForm";
import { AddTaskForm } from "./components/AddTaskForm";
import { DashboardStats } from "./components/DashboardStats";
import { RevenueChart } from "./components/RevenueChart";
import { Doc } from "../convex/_generated/dataModel";
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  CurrencyEuroIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

type View = "dashboard" | "clients" | "projects" | "invoices" | "tasks" | "documents" | "expenses" | "reports" | "settings";

const menuItems: { id: View; icon: any; translationKey: string }[] = [
  { id: "dashboard", icon: HomeIcon, translationKey: "dashboard" },
  { id: "clients", icon: UserGroupIcon, translationKey: "clients" },
  { id: "projects", icon: BriefcaseIcon, translationKey: "projects" },
  { id: "invoices", icon: DocumentTextIcon, translationKey: "invoices" },
  { id: "tasks", icon: ClipboardDocumentListIcon, translationKey: "tasks" },
  { id: "documents", icon: DocumentDuplicateIcon, translationKey: "documents" },
  { id: "expenses", icon: CurrencyEuroIcon, translationKey: "expenses" },
  { id: "reports", icon: ChartBarIcon, translationKey: "reports" },
  { id: "settings", icon: Cog6ToothIcon, translationKey: "settings" },
];

export function Dashboard({ user }: { user: Doc<"users"> }) {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<View>("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const clients = useQuery(api.clients.list) || [];
  const projects = useQuery(api.projects.list) || [];
  const invoices = useQuery(api.invoices.list) || [];
  const tasks = useQuery(api.tasks.list) || [];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-700 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>Freelance CRM</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className={`h-6 w-6 transform transition-transform ${!sidebarOpen && 'rotate-180'}`} />
          </button>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center p-3 transition-colors ${
                view === item.id
                  ? "bg-indigo-800 border-r-4 border-white"
                  : "hover:bg-indigo-600"
              }`}
            >
              <item.icon className="h-6 w-6 flex-shrink-0" />
              {sidebarOpen && (
                <span className="ml-3">{t(`navigation.${item.translationKey}`)}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b z-10">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                {t(`navigation.${view}`)}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {i18n.language === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
              </button>
              {view !== "dashboard" && view !== "reports" && view !== "settings" && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <span className="mr-2">+</span>
                  {t(`actions.new${view.charAt(0).toUpperCase() + view.slice(1, -1)}`)}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {view === "dashboard" && (
            <div className="space-y-6">
              <DashboardStats />
              <RevenueChart />
            </div>
          )}

          {view === "clients" && (
            <>
              <ClientList clients={clients} />
              {showAddForm && (
                <AddClientForm onClose={() => setShowAddForm(false)} />
              )}
            </>
          )}

          {view === "projects" && (
            <>
              <ProjectList projects={projects} clients={clients} />
              {showAddForm && (
                <AddProjectForm
                  clients={clients}
                  onClose={() => setShowAddForm(false)}
                />
              )}
            </>
          )}

          {view === "invoices" && (
            <>
              <InvoiceList invoices={invoices} projects={projects} clients={clients} />
              {showAddForm && (
                <AddInvoiceForm
                  projects={projects}
                  clients={clients}
                  onClose={() => setShowAddForm(false)}
                />
              )}
            </>
          )}

          {view === "tasks" && (
            <>
              <TaskList tasks={tasks} projects={projects} />
              {showAddForm && (
                <AddTaskForm
                  projects={projects}
                  onClose={() => setShowAddForm(false)}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
