import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTranslation } from "react-i18next";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfMonth, format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { formatCurrency } from "../utils/format";
import { Doc } from "../../convex/_generated/dataModel";

interface MonthlyData {
  month: number;
  amount: number;
}

export function RevenueChart() {
  const { t, i18n } = useTranslation();
  const invoices = useQuery(api.invoices.list) || [];
  
  const locale = i18n.language === 'fr' ? fr : enUS;

  const monthlyData = invoices.reduce((acc: MonthlyData[], invoice: Doc<"invoices">) => {
    const month = startOfMonth(invoice.dueDate).getTime();
    const existingMonth = acc.find(d => d.month === month);
    
    if (existingMonth) {
      existingMonth.amount += invoice.amount;
    } else {
      acc.push({ month, amount: invoice.amount });
    }
    return acc;
  }, []).sort((a, b) => a.month - b.month);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">{t('dashboard.charts.monthlyRevenue')}</h3>
      <div className="h-64">
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
              stroke="#4F46E5" 
              fill="#4F46E5" 
              fillOpacity={0.1} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
