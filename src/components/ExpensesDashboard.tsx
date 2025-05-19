import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/format";
import { Doc } from "../../convex/_generated/dataModel";
import {
  ReceiptPercentIcon,
  DocumentCheckIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export function ExpensesDashboard() {
  const { t } = useTranslation();
  const expenses = useQuery(api.expenses.list) || [];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === "pending");
  const approvedExpenses = expenses.filter(e => e.status === "approved");
  const reimbursedExpenses = expenses.filter(e => e.status === "reimbursed");

  const expensesByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Expense Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <ReceiptPercentIcon className="h-8 w-8 text-indigo-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-sm text-gray-500">{t('expenses.totalExpenses')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(
                  pendingExpenses.reduce((sum, e) => sum + e.amount, 0)
                )}
              </p>
              <p className="text-sm text-gray-500">{t('expenses.pendingExpenses')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <DocumentCheckIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(
                  approvedExpenses.reduce((sum, e) => sum + e.amount, 0)
                )}
              </p>
              <p className="text-sm text-gray-500">{t('expenses.approvedExpenses')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(
                  reimbursedExpenses.reduce((sum, e) => sum + e.amount, 0)
                )}
              </p>
              <p className="text-sm text-gray-500">{t('expenses.reimbursedExpenses')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium">{t('expenses.recentExpenses')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('expenses.description')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('expenses.category')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('expenses.amount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('expenses.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('expenses.date')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.slice(0, 5).map((expense) => (
                <tr key={expense._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t(`expenses.categories.${expense.category}`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                        expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {t(`expenses.status.${expense.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium">{t('expenses.byCategory')}</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {t(`expenses.categories.${category}`)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(amount)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({((amount / totalExpenses) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
