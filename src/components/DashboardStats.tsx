import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/format";
import { Doc } from "../../convex/_generated/dataModel";
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export function DashboardStats() {
  const { t } = useTranslation();
  const clients = useQuery(api.clients.list) || [];
  const projects = useQuery(api.projects.list) || [];
  const invoices = useQuery(api.invoices.list) || [];
  const tasks = useQuery(api.tasks.list) || [];
  const timeEntries = useQuery(api.timeEntries.list) || [];

  const totalRevenue = invoices
    .filter((inv: Doc<"invoices">) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingRevenue = invoices
    .filter((inv: Doc<"invoices">) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingInvoices = invoices.filter((inv: Doc<"invoices">) => inv.status === "pending").length;
  const overdueInvoices = invoices.filter((inv: Doc<"invoices">) => inv.status === "overdue").length;
  
  const activeProjects = projects.filter((p: Doc<"projects">) => p.status === "active").length;
  const activeClients = clients.filter((c: Doc<"clients">) => c.status === "active").length;
  
  const urgentTasks = tasks.filter((t: Doc<"tasks">) => 
    t.priority === "urgent" && t.status !== "completed"
  ).length;

  const totalHoursThisMonth = timeEntries
    .filter((entry: Doc<"timeEntries">) => {
      const entryDate = new Date(entry.date);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && 
             entryDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, entry) => sum + entry.duration / 60, 0);

  const stats = [
    {
      name: t('dashboard.stats.totalRevenue'),
      value: formatCurrency(totalRevenue),
      icon: BanknotesIcon,
      change: "+12.3%",
      changeType: "positive",
    },
    {
      name: t('dashboard.stats.pendingRevenue'),
      value: formatCurrency(pendingRevenue),
      icon: ClockIcon,
      change: pendingInvoices.toString(),
      changeLabel: t('dashboard.stats.pendingInvoices'),
    },
    {
      name: t('dashboard.stats.activeClients'),
      value: activeClients,
      icon: UserGroupIcon,
      change: clients.length.toString(),
      changeLabel: t('dashboard.stats.totalClients'),
    },
    {
      name: t('dashboard.stats.activeProjects'),
      value: activeProjects,
      icon: DocumentCheckIcon,
      change: projects.length.toString(),
      changeLabel: t('dashboard.stats.totalProjects'),
    },
    {
      name: t('dashboard.stats.monthlyHours'),
      value: Math.round(totalHoursThisMonth).toString() + 'h',
      icon: ChartBarIcon,
      change: "+5.4%",
      changeType: "positive",
    },
    {
      name: t('dashboard.stats.urgentTasks'),
      value: urgentTasks,
      icon: ExclamationCircleIcon,
      change: overdueInvoices.toString(),
      changeLabel: t('dashboard.stats.overdueInvoices'),
      alert: urgentTasks > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
            stat.alert ? 'border-red-200 bg-red-50' : 'border-gray-100'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon
                  className={`h-8 w-8 ${
                    stat.alert ? 'text-red-500' : 'text-indigo-500'
                  }`}
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="ml-2 flex items-baseline text-sm font-semibold">
                    {stat.changeType === "positive" ? (
                      <span className="text-green-600">
                        {stat.change}
                      </span>
                    ) : stat.changeType === "negative" ? (
                      <span className="text-red-600">
                        {stat.change}
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        {stat.changeLabel ? `${stat.change} ${stat.changeLabel}` : stat.change}
                      </span>
                    )}
                  </p>
                </div>
                <h3 className="mt-1 text-sm font-medium text-gray-500">
                  {stat.name}
                </h3>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
