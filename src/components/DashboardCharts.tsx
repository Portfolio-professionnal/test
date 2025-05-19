import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/format";
import { Doc } from "../../convex/_generated/dataModel";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { startOfMonth, format, subMonths } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function DashboardCharts() {
  const { t, i18n } = useTranslation();
  const invoices = useQuery(api.invoices.list) || [];
  const projects = useQuery(api.projects.list) || [];
  const tasks = useQuery(api.tasks.list) || [];
  
  const locale = i18n.language === 'fr' ? fr : enUS;

  // Revenue Chart Data
  const monthlyData = invoices.reduce((acc: any[], invoice: Doc<"invoices">) => {
    const month = startOfMonth(invoice.dueDate).getTime();
    const existingMonth = acc.find(d => d.month === month);
    
    if (existingMonth) {
      existingMonth.amount += invoice.amount;
      if (invoice.status === 'paid') {
        existingMonth.paid += invoice.amount;
      }
    } else {
      acc.push({
        month,
        amount: invoice.amount,
        paid: invoice.status === 'paid' ? invoice.amount : 0
      });
    }
    return acc;
  }, []).sort((a, b) => a.month - b.month);

  // Project Status Distribution
  const projectStatusData = Object.entries(
    projects.reduce((acc: Record<string, number>, project: Doc<"projects">) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({
    name: t(`status.${name}`),
    value
  }));

  // Task Priority Distribution
  const taskPriorityData = Object.entries(
    tasks.reduce((acc: Record<string, number>, task: Doc<"tasks">) => {
      if (task.status !== 'completed') {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({
    name: t(`priority.${name}`),
    value
  }));

  // Invoice Status Distribution
  const invoiceStatusData = Object.entries(
    invoices.reduce((acc: Record<string, number>, invoice: Doc<"invoices">) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({
    name: t(`status.${name}`),
    value
  }));

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div className="col-span-2 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">{t('dashboard.charts.monthlyRevenue')}</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => format(value, 'MMM yyyy', { locale })}
              />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(value) => format(value, 'MMMM yyyy', { locale })}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                name={t('dashboard.charts.totalRevenue')}
                stroke="#4F46E5" 
                fill="#4F46E5" 
                fillOpacity={0.1} 
              />
              <Area 
                type="monotone" 
                dataKey="paid" 
                name={t('dashboard.charts.paidRevenue')}
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Status Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">{t('dashboard.charts.projectStatus')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => [value, t('dashboard.charts.projects')]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Priority Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">{t('dashboard.charts.taskPriority')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskPriorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskPriorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => [value, t('dashboard.charts.tasks')]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
